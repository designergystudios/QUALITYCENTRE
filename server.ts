import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'cms-database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.DATABASE_URL || 'https://zzgwjegqiefanzhshxyn.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '[REDACTED-SECRET]';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

// Ensure required directories exist
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Helper to pull latest database state from live Supabase cloud storage on container startup and runtime requests
let lastCloudPullTime = 0;
async function syncDatabaseFromSupabase(force = false) {
  try {
    const { data: signData, error } = await supabaseAdmin.storage.from('site-data').createSignedUrl('cms-database.json', 300);
    if (!error && signData?.signedUrl) {
      const res = await fetch(signData.signedUrl, { cache: 'no-store' });
      if (res.ok) {
        const cloudDb = await res.json();
        const localDb = readDatabase();
        const cloudTime = Number(cloudDb.lastUpdated || 0);
        const localTime = Number(localDb?.lastUpdated || 0);
        if (force || !localDb || localTime === 0 || cloudTime >= localTime) {
          fs.writeFileSync(DB_FILE, JSON.stringify(cloudDb, null, 2), 'utf-8');
          console.log('Synchronized local database from Supabase cloud snapshot');
        } else if (localTime > cloudTime) {
          await syncDatabaseToSupabase(localDb);
        }
      }
    }
    lastCloudPullTime = Date.now();
  } catch (err) {
    console.warn('Startup cloud database sync notice:', err);
  }
}

// Immediately trigger startup synchronization
syncDatabaseFromSupabase(true).catch(() => {});

// Helper to sync state to live Supabase storage
async function syncDatabaseToSupabase(data: any) {
  if (!SUPABASE_KEY) return;
  const jsonBody = JSON.stringify(data, null, 2);
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'x-upsert': 'true',
    'cache-control': 'no-cache, no-store, must-revalidate',
  };

  try {
    let res = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/cms-database.json`, {
      method: 'PUT',
      headers,
      body: jsonBody,
    });

    if (!res.ok) {
      res = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/cms-database.json`, {
        method: 'POST',
        headers,
        body: jsonBody,
      });
    }

    if (!res.ok) {
      const txt = await res.text();
      console.warn('Background Supabase storage sync status:', res.status, txt);
    } else {
      console.log('Successfully synchronized database to Supabase cloud storage (site-data)');
    }
  } catch (err) {
    console.warn('Background Supabase storage sync notice:', err);
  }
}

// Helper to upload image or document to live Supabase storage bucket
async function uploadImageToSupabase(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  bucket = 'site-data'
): Promise<string | null> {
  if (!SUPABASE_KEY) return null;

  // Normalize mime-type
  let cleanMime = (mimeType || 'application/octet-stream').toLowerCase().trim();
  if (cleanMime === 'image/jpg' || cleanMime === 'image/pjpeg' || cleanMime === 'image/jfif' || filename.endsWith('.jpg')) {
    cleanMime = 'image/jpeg';
  } else if (cleanMime === 'image/svg' || cleanMime.includes('svg')) {
    cleanMime = 'image/svg+xml';
  } else if (cleanMime.includes('png')) {
    cleanMime = 'image/png';
  } else if (cleanMime.includes('webp')) {
    cleanMime = 'image/webp';
  }

  let targetBucket = bucket;
  if (cleanMime.includes('pdf') || cleanMime.includes('video')) {
    targetBucket = 'site-data';
  }

  const makeHeaders = (mType: string) => ({
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': mType,
    'x-upsert': 'true',
    'cache-control': 'no-cache, no-store, must-revalidate',
  });

  try {
    let res = await fetch(`${SUPABASE_URL}/storage/v1/object/${targetBucket}/${filename}`, {
      method: 'PUT',
      headers: makeHeaders(cleanMime),
      body: buffer,
    });
    if (!res.ok) {
      res = await fetch(`${SUPABASE_URL}/storage/v1/object/${targetBucket}/${filename}`, {
        method: 'POST',
        headers: makeHeaders(cleanMime),
        body: buffer,
      });
    }
    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${filename}?v=${Date.now()}`;
    }

    // If client-logos or targetBucket rejected mime type, immediately fallback to site-data
    if (targetBucket !== 'site-data') {
      let fbRes = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/${filename}`, {
        method: 'PUT',
        headers: makeHeaders(cleanMime),
        body: buffer,
      });
      if (!fbRes.ok) {
        fbRes = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/${filename}`, {
          method: 'POST',
          headers: makeHeaders(cleanMime),
          body: buffer,
        });
      }
      if (fbRes.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/site-data/${filename}?v=${Date.now()}`;
      }
    }
    const errText = await res.text();
    console.warn(`Supabase storage upload returned ${res.status}:`, errText);
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
async function writeDatabase(data: any) {
  try {
    data.lastUpdated = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Synchronously push update to live Supabase cloud storage (site-data bucket)
    await syncDatabaseToSupabase(data);
    return true;
  } catch (err) {
    console.error('Error writing cms-database.json:', err);
    return false;
  }
}

// Enable JSON body parsing with large payload capacity for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Disable browser & proxy caching for all API endpoints
app.use('/api', (req: Request, res: Response, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve public uploads directory statically so uploaded logos are accessible to all devices
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(process.cwd(), 'public')));

// ============================================================================
// API ROUTES FIRST
// ============================================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET full CMS state directly from the live database
app.get('/api/cms', async (req: Request, res: Response) => {
  const localDb = readDatabase();
  try {
    const { data: signData, error } = await supabaseAdmin.storage.from('site-data').createSignedUrl('cms-database.json', 300);
    if (!error && signData?.signedUrl) {
      const cloudRes = await fetch(signData.signedUrl, { cache: 'no-store' });
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData && (cloudData.clientLogos || cloudData.companyConfig || cloudData.heroConfig || cloudData.successStories)) {
          const cloudTime = Number(cloudData.lastUpdated || 0);
          const localTime = Number(localDb?.lastUpdated || 0);

          if (!localDb || localTime === 0 || cloudTime >= localTime) {
            try {
              fs.writeFileSync(DB_FILE, JSON.stringify(cloudData, null, 2), 'utf-8');
            } catch {}
            return res.json(cloudData);
          } else {
            return res.json(localDb);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Direct live database fetch error in /api/cms:', err);
  }

  // Backup fallback
  if (localDb) {
    return res.json(localDb);
  }
  res.status(500).json({ error: 'Database could not be read' });
});

// POST save / update full CMS state into persistent database
app.post('/api/cms', async (req: Request, res: Response) => {
  const existingDb = readDatabase() || {};
  const payload = req.body;
  const updatedDb = {
    ...existingDb,
    ...payload,
    lastUpdated: payload.lastUpdated || Date.now(),
  };

  const success = await writeDatabase(updatedDb);
  if (!success) {
    return res.status(500).json({ error: 'Failed to write to database' });
  }
  res.json({ success: true, db: updatedDb });
});

// POST update company configuration (including logoUrl and logoType)
app.post('/api/company', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const updates = req.body;
  db.companyConfig = {
    ...(db.companyConfig || {}),
    ...updates,
  };

  const success = await writeDatabase(db);
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

  await writeDatabase(db);

  res.json({
    success: true,
    logoUrl: finalLogoUrl,
    companyConfig: db.companyConfig,
  });
});

// POST update hero section
app.post('/api/hero', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.heroConfig = {
    ...(db.heroConfig || {}),
    ...req.body,
  };

  await writeDatabase(db);
  res.json({ success: true, heroConfig: db.heroConfig });
});

// POST update book configuration (image, synopsis/description, title, takeaways, etc.)
app.post('/api/book', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let coverImage = req.body.coverImage;
  if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('data:image/')) {
    try {
      const matches = coverImage.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'svg+xml') { ext = 'svg'; mimeType = 'image/svg+xml'; }
        if (ext === 'jpeg') { ext = 'jpg'; mimeType = 'image/jpeg'; }
        const buffer = Buffer.from(matches[2], 'base64');
        const cleanTitle = (req.body.title || 'iso-9000-secret')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .slice(0, 24);
        const uniqueFileName = `book-cover-${cleanTitle}-${Date.now()}.${ext}`;

        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          coverImage = `/uploads/${uniqueFileName}`;
        } catch {}

        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'client-logos');
        if (supabaseUrl) {
          coverImage = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save book cover to Supabase storage:', e);
    }
  }

  db.bookConfig = {
    ...(db.bookConfig || {}),
    ...req.body,
    ...(coverImage ? { coverImage } : {}),
  };

  await writeDatabase(db);
  res.json({ success: true, bookConfig: db.bookConfig });
});

// Dedicated endpoint to upload book cover to Supabase storage
app.post('/api/upload-book-cover', async (req: Request, res: Response) => {
  const { image, fileName, bookTitle } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  let finalCoverUrl = image;

  if (typeof image === 'string' && image.startsWith('data:image/')) {
    try {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        let mimeType = `image/${ext}`;
        if (ext === 'svg+xml') { ext = 'svg'; mimeType = 'image/svg+xml'; }
        if (ext === 'jpeg') { ext = 'jpg'; mimeType = 'image/jpeg'; }
        const buffer = Buffer.from(matches[2], 'base64');
        const cleanTitle = (bookTitle || 'iso-9000-secret')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 24);
        const uniqueFileName = fileName || `book-cover-${cleanTitle}-${Date.now()}.${ext}`;

        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          finalCoverUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'client-logos');
        if (supabaseUrl) {
          finalCoverUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Failed to upload book cover to Supabase storage:', e);
    }
  }

  // Also update db.bookConfig with the new cover URL
  const db = readDatabase();
  if (db) {
    db.bookConfig = {
      ...(db.bookConfig || {}),
      coverImage: finalCoverUrl,
    };
    await writeDatabase(db);
  }

  res.json({
    success: true,
    coverUrl: finalCoverUrl,
    isCloudHosted: finalCoverUrl.includes('supabase.co'),
    bookConfig: db ? db.bookConfig : undefined,
  });
});

// Dedicated endpoint to upload client logo to Supabase storage
app.post('/api/upload-client-logo', async (req: Request, res: Response) => {
  const { image, fileName, bucket = 'client-logos', clientName } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  let finalLogoUrl = image;

  if (typeof image === 'string' && image.startsWith('data:')) {
    try {
      const commaIdx = image.indexOf(',');
      if (commaIdx !== -1) {
        const meta = image.slice(0, commaIdx);
        const base64Data = image.slice(commaIdx + 1);
        const mimeMatch = meta.match(/^data:([^;]+)/);
        let mimeType = (mimeMatch ? mimeMatch[1] : 'image/png').toLowerCase().trim();
        let ext = 'png';
        if (mimeType.includes('svg')) { ext = 'svg'; mimeType = 'image/svg+xml'; }
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) { ext = 'jpg'; mimeType = 'image/jpeg'; }
        else if (mimeType.includes('webp')) { ext = 'webp'; mimeType = 'image/webp'; }
        else if (mimeType.includes('gif')) { ext = 'gif'; mimeType = 'image/gif'; }

        const buffer = Buffer.from(base64Data, 'base64');
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
        const targetBucket = mimeType.includes('gif') ? 'site-data' : bucket;
        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, targetBucket);
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

// POST upload PDF document to live Supabase Storage bucket
app.post('/api/upload-pdf', async (req: Request, res: Response) => {
  const { file, fileName, bucket = 'client-logos' } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  let finalUrl = file;

  if (typeof file === 'string' && file.startsWith('data:')) {
    try {
      const matches = file.match(/^data:(.+?);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        let ext = 'pdf';
        if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
        else if (mimeType.includes('svg')) ext = 'svg';

        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = fileName || `case-study-${Date.now()}.${ext}`;

        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          finalUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, bucket);
        if (supabaseUrl) {
          finalUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Failed to upload PDF to Supabase storage:', e);
    }
  }

  res.json({
    success: true,
    pdfUrl: finalUrl,
    logoUrl: finalUrl,
    isCloudHosted: finalUrl.includes('supabase.co'),
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

  const targetId = req.body.id || `logo-${Date.now()}`;
  const logoRecord = {
    id: targetId,
    name: req.body.name || 'Client',
    industry: req.body.industry || 'Enterprise',
    caption: req.body.caption || '',
    logoUrl: logoUrl,
  };

  const existingIdx = (db.clientLogos || []).findIndex((item: any) => item.id === targetId);
  if (existingIdx >= 0) {
    db.clientLogos[existingIdx] = {
      ...db.clientLogos[existingIdx],
      ...logoRecord,
      logoUrl: logoUrl || db.clientLogos[existingIdx].logoUrl,
    };
  } else {
    db.clientLogos = [logoRecord, ...(db.clientLogos || [])];
  }
  await writeDatabase(db);
  res.json({ success: true, clientLogo: logoRecord, clientLogos: db.clientLogos });
});

app.put('/api/client-logos/:id', async (req: Request, res: Response) => {
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

        try {
          const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
          fs.writeFileSync(targetPath, buffer);
          logoUrl = `/uploads/${uniqueFileName}`;
        } catch {}

        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'client-logos');
        if (supabaseUrl) {
          logoUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save updated client logo to Supabase:', e);
    }
  }

  const id = req.params.id;
  const existingIdx = (db.clientLogos || []).findIndex((item: any) => item.id === id);
  if (existingIdx >= 0) {
    db.clientLogos[existingIdx] = {
      ...db.clientLogos[existingIdx],
      ...req.body,
      id,
      logoUrl: logoUrl || db.clientLogos[existingIdx].logoUrl,
    };
    await writeDatabase(db);
    return res.json({ success: true, clientLogo: db.clientLogos[existingIdx], clientLogos: db.clientLogos });
  }

  return res.status(404).json({ error: 'Logo not found' });
});

app.delete('/api/client-logos/:id', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.clientLogos = (db.clientLogos || []).filter((item: any) => item.id !== req.params.id);
  await writeDatabase(db);
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

  let pdfUrl = req.body.pdfUrl;
  if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.startsWith('data:')) {
    try {
      const matches = pdfUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = `story-doc-${Date.now()}.pdf`;
        const supabaseUrl = await uploadImageToSupabase(buffer, uniqueFileName, mimeType, 'site-data');
        if (supabaseUrl) {
          pdfUrl = supabaseUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save story PDF to Supabase storage:', e);
    }
  }

  const storyId = req.body.id || `story-${Date.now()}`;
  const storyData = {
    ...req.body,
    id: storyId,
    date: req.body.date || new Date().toISOString().split('T')[0],
    imageUrl: imageUrl,
    pdfUrl: pdfUrl,
  };

  const existingIndex = (db.successStories || []).findIndex((item: any) => item.id === storyId);
  if (existingIndex >= 0) {
    db.successStories[existingIndex] = { ...db.successStories[existingIndex], ...storyData };
  } else {
    db.successStories = [storyData, ...(db.successStories || [])];
  }

  await writeDatabase(db);
  res.json({ success: true, story: storyData, successStories: db.successStories });
});

app.delete('/api/success-stories/:id', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.successStories = (db.successStories || []).filter((item: any) => item.id !== req.params.id);
  await writeDatabase(db);
  res.json({ success: true, successStories: db.successStories });
});

// Gallery items CRUD
app.post('/api/gallery', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const newItem = {
    id: req.body.id || `media-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
  };

  db.galleryItems = [newItem, ...(db.galleryItems || [])];
  await writeDatabase(db);
  res.json({ success: true, item: newItem, galleryItems: db.galleryItems });
});

app.delete('/api/gallery/:id', async (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.galleryItems = (db.galleryItems || []).filter((item: any) => item.id !== req.params.id);
  await writeDatabase(db);
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
