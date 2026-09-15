import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'cms-database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.DATABASE_URL || 'https://zzgwjegqiefanzhshxyn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Ensure required directories exist
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Helper to sync state to live Supabase storage
async function syncDatabaseToSupabase(data: any) {
  if (!SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/cms-database.json`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: JSON.stringify(data, null, 2),
    });
  } catch (err) {
    console.warn('Background Supabase storage sync notice:', err);
  }
}

// Helper to upload image to live Supabase storage bucket
async function uploadImageToSupabase(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  bucket = 'client-logos'
): Promise<string | null> {
  if (!SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true',
      },
      body: buffer,
    });
    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}?v=${Date.now()}`;
    } else {
      const errText = await res.text();
      console.warn(`Supabase storage upload returned ${res.status}:`, errText);
    }
  } catch (e) {
    console.warn('Failed to upload image to Supabase storage:', e);
  }
  return null;
}

// Helper to read database
function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading cms-database.json:', err);
  }
  return null;
}

// Helper to write database
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Asynchronously push update to live Supabase database
    syncDatabaseToSupabase(data).catch(() => {});
    return true;
  } catch (err) {
    console.error('Error writing cms-database.json:', err);
    return false;
  }
}

// Enable JSON body parsing with large payload capacity for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve public uploads directory statically so uploaded logos are accessible to all devices
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(process.cwd(), 'public')));

// ============================================================================
// API ROUTES FIRST
// ============================================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET full CMS state from persistent database
app.get('/api/cms', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database could not be read' });
  }
  res.json(db);
});

// POST update company configuration (including logoUrl and logoType)
app.post('/api/company', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const updates = req.body;
  db.companyConfig = {
    ...(db.companyConfig || {}),
    ...updates,
  };

  const success = writeDatabase(db);
  if (!success) {
    return res.status(500).json({ error: 'Failed to write to database' });
  }

  res.json({ success: true, companyConfig: db.companyConfig });
});

// POST dedicated upload-logo endpoint
// Supports both base64 uploads and direct URLs, writing to persistent disk and database
app.post('/api/upload-logo', async (req: Request, res: Response) => {
  const { image, fileName } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  let finalLogoUrl = image;

  // If base64 data URL, write to static public/uploads folder AND live Supabase storage
  if (typeof image === 'string' && image.startsWith('data:image/')) {
    try {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'svg+xml') { ext = 'svg'; mimeType = 'image/svg+xml'; }
        if (ext === 'jpeg') { ext = 'jpg'; mimeType = 'image/jpeg'; }
        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = `quality-centre-logo.${ext}`;
        const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
        fs.writeFileSync(targetPath, buffer);
        finalLogoUrl = `/uploads/${uniqueFileName}`;

        // Upload to live Supabase Storage bucket for cross-device global availability
        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType);
        if (supabaseUrl) {
          finalLogoUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Failed to save image to disk/supabase, falling back to database URL storage', e);
    }
  }

  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.companyConfig = {
    ...(db.companyConfig || {}),
    logoUrl: finalLogoUrl,
    logoType: 'custom',
  };

  writeDatabase(db);

  res.json({
    success: true,
    logoUrl: finalLogoUrl,
    companyConfig: db.companyConfig,
  });
});

// POST update hero section
app.post('/api/hero', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.heroConfig = {
    ...(db.heroConfig || {}),
    ...req.body,
  };

  writeDatabase(db);
  res.json({ success: true, heroConfig: db.heroConfig });
});

// Dedicated endpoint to upload client logo to Supabase storage
app.post('/api/upload-client-logo', async (req: Request, res: Response) => {
  const { image, fileName, bucket = 'client-logos', clientName } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  let finalLogoUrl = image;

  if (typeof image === 'string' && image.startsWith('data:image/')) {
    try {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'svg+xml') { ext = 'svg'; mimeType = 'image/svg+xml'; }
        if (ext === 'jpeg') { ext = 'jpg'; mimeType = 'image/jpeg'; }
        const buffer = Buffer.from(matches[2], 'base64');
        const cleanName = (clientName || 'client')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 24);
        const uniqueFileName = fileName || `client-${cleanName}-${Date.now()}.${ext}`;

        // Save local copy for fallback
        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          finalLogoUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        // Upload to live Supabase Storage bucket for cross-device global availability
        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, bucket);
        if (supabaseUrl) {
          finalLogoUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Failed to upload client logo to Supabase storage:', e);
    }
  }

  res.json({
    success: true,
    logoUrl: finalLogoUrl,
    isCloudHosted: finalLogoUrl.includes('supabase.co'),
  });
});

// Client logos CRUD
app.post('/api/client-logos', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let logoUrl = req.body.logoUrl;
  if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('data:image/')) {
    try {
      const matches = logoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'svg+xml') { ext = 'svg'; mimeType = 'image/svg+xml'; }
        if (ext === 'jpeg') { ext = 'jpg'; mimeType = 'image/jpeg'; }
        const buffer = Buffer.from(matches[2], 'base64');
        const cleanName = (req.body.name || 'client')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .slice(0, 24);
        const uniqueFileName = `client-${cleanName}-${Date.now()}.${ext}`;

        // Save local copy
        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          logoUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        // Upload directly to live Supabase Storage bucket
        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'client-logos');
        if (supabaseUrl) {
          logoUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save client logo to Supabase storage:', e);
    }
  }

  const newLogo = {
    id: req.body.id || `logo-${Date.now()}`,
    name: req.body.name || 'Client',
    industry: req.body.industry || 'Enterprise',
    logoUrl: logoUrl,
  };

  db.clientLogos = [newLogo, ...(db.clientLogos || [])];
  writeDatabase(db);
  res.json({ success: true, clientLogo: newLogo, clientLogos: db.clientLogos });
});

app.delete('/api/client-logos/:id', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.clientLogos = (db.clientLogos || []).filter((item: any) => item.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true, clientLogos: db.clientLogos });
});

// Success stories CRUD
app.post('/api/success-stories', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let imageUrl = req.body.imageUrl;
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
    try {
      const matches = imageUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'jpeg') ext = 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = `story-${Date.now()}.${ext}`;

        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          imageUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'client-logos');
        if (supabaseUrl) {
          imageUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save story image to Supabase storage:', e);
    }
  }

  const newStory = {
    id: req.body.id || `story-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
    imageUrl: imageUrl,
  };

  db.successStories = [newStory, ...(db.successStories || [])];
  writeDatabase(db);
  res.json({ success: true, story: newStory, successStories: db.successStories });
});

app.delete('/api/success-stories/:id', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.successStories = (db.successStories || []).filter((item: any) => item.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true, successStories: db.successStories });
});

// Gallery items CRUD
app.post('/api/gallery', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const newItem = {
    id: req.body.id || `media-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
  };

  db.galleryItems = [newItem, ...(db.galleryItems || [])];
  writeDatabase(db);
  res.json({ success: true, item: newItem, galleryItems: db.galleryItems });
});

app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.galleryItems = (db.galleryItems || []).filter((item: any) => item.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true, galleryItems: db.galleryItems });
});

// ============================================================================
// VITE INTEGRATION
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quality Centre Full-Stack Database Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
