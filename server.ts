import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'cms-database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure required directories exist
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

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
app.post('/api/upload-logo', (req: Request, res: Response) => {
  const { image, fileName } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  let finalLogoUrl = image;

  // If base64 data URL, write to static public/uploads folder for optimal CDN delivery
  if (typeof image === 'string' && image.startsWith('data:image/')) {
    try {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        if (ext === 'svg+xml') ext = 'svg';
        if (ext === 'jpeg') ext = 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = `logo-${Date.now()}.${ext}`;
        const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
        fs.writeFileSync(targetPath, buffer);
        finalLogoUrl = `/uploads/${uniqueFileName}`;
      }
    } catch (e) {
      console.warn('Failed to save image to disk, falling back to database URL storage', e);
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

// Client logos CRUD
app.post('/api/client-logos', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let logoUrl = req.body.logoUrl;
  if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('data:image/')) {
    try {
      const matches = logoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        if (ext === 'svg+xml') ext = 'svg';
        if (ext === 'jpeg') ext = 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueFileName = `client-${Date.now()}-${Math.floor(Math.random()*1000)}.${ext}`;
        const targetPath = path.join(UPLOADS_DIR, uniqueFileName);
        fs.writeFileSync(targetPath, buffer);
        logoUrl = `/uploads/${uniqueFileName}`;
      }
    } catch (e) {
      console.warn('Could not save client logo to disk, using data URL', e);
    }
  }

  const newLogo = {
    id: `logo-${Date.now()}`,
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
app.post('/api/success-stories', (req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const newStory = {
    id: req.body.id || `story-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
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
