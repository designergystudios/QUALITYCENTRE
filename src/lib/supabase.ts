import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials
export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://zzgwjegqiefanzhshxyn.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  '[REDACTED-SECRET]';

export const SUPABASE_SERVICE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) ||
  '[REDACTED-SECRET]';

// Live public URL for Quality Centre branded logo in Supabase Storage
export const LIVE_SUPABASE_LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/client-logos/quality-centre-logo.jpg`;

// Live public URL for full CMS configuration database in Supabase Storage (site-data bucket is public and accepts JSON)
export const LIVE_SUPABASE_DB_URL = `${SUPABASE_URL}/storage/v1/object/public/site-data/cms-database.json`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Fetch latest CMS configuration directly from live Supabase database
 */
export async function fetchLiveDatabase() {
  try {
    const res = await fetch(`${LIVE_SUPABASE_DB_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Live Supabase database fetch notice:', err);
  }
  return null;
}

/**
 * Persist CMS database snapshot directly to live Supabase Cloud storage across all devices
 */
export async function saveLiveDatabaseToSupabase(dbData: any): Promise<boolean> {
  try {
    const payload = {
      ...dbData,
      lastUpdated: dbData?.lastUpdated || Date.now(),
    };
    const jsonString = JSON.stringify(payload, null, 2);

    const headers = {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'x-upsert': 'true',
      'cache-control': 'no-cache, no-store, must-revalidate',
    };

    // Direct PUT/POST to Supabase Storage site-data/cms-database.json (Accessible globally to all devices)
    let res = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/cms-database.json`, {
      method: 'PUT',
      headers,
      body: jsonString,
    });

    if (!res.ok) {
      res = await fetch(`${SUPABASE_URL}/storage/v1/object/site-data/cms-database.json`, {
        method: 'POST',
        headers,
        body: jsonString,
      });
    }

    if (res.ok) {
      return true;
    } else {
      const errText = await res.text().catch(() => '');
      console.warn('Direct Supabase cloud save warning:', res.status, errText);
    }
  } catch (err) {
    console.warn('Live Supabase database direct save error:', err);
  }
  return false;
}

/**
 * Generic helper to upload any File or base64 dataUrl to Supabase Storage
 */
export async function uploadFileToSupabaseStorage({
  fileOrDataUrl,
  bucket = 'client-logos',
  filename,
  prefix = 'asset',
}: {
  fileOrDataUrl: string | File;
  bucket?: string;
  filename?: string;
  prefix?: string;
}): Promise<string> {
  // If already a remote HTTP/HTTPS URL, return directly
  if (typeof fileOrDataUrl === 'string') {
    if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://')) {
      return fileOrDataUrl;
    }
  }

  try {
    let buffer: Blob;
    let mimeType = 'image/jpeg';
    let fileExt = 'jpg';

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:')) {
        const matches = fileOrDataUrl.match(/^data:(.+?);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          if (mimeType.includes('pdf')) fileExt = 'pdf';
          else if (mimeType.includes('svg')) fileExt = 'svg';
          else if (mimeType.includes('png')) fileExt = 'png';
          else if (mimeType.includes('webp')) fileExt = 'webp';
          else if (mimeType.includes('mp4')) fileExt = 'mp4';
          else if (mimeType.includes('webm')) fileExt = 'webm';
          else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) fileExt = 'jpg';

          const byteCharacters = atob(matches[2]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          buffer = new Blob([byteArray], { type: mimeType });
        } else {
          return fileOrDataUrl;
        }
      } else {
        return fileOrDataUrl;
      }
    } else {
      buffer = fileOrDataUrl;
      mimeType = fileOrDataUrl.type || 'application/octet-stream';
      const name = fileOrDataUrl.name.toLowerCase();
      if (name.endsWith('.pdf')) fileExt = 'pdf';
      else if (name.endsWith('.png')) fileExt = 'png';
      else if (name.endsWith('.svg')) fileExt = 'svg';
      else if (name.endsWith('.webp')) fileExt = 'webp';
      else if (name.endsWith('.mp4')) fileExt = 'mp4';
      else if (name.endsWith('.webm')) fileExt = 'webm';
      else if (name.endsWith('.mov')) fileExt = 'mov';
      else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) fileExt = 'jpg';
    }

    // Normalize mimeType for Supabase strict checking
    let cleanMime = (mimeType || 'application/octet-stream').toLowerCase().trim();
    if (cleanMime === 'image/jpg' || cleanMime === 'image/pjpeg' || cleanMime === 'image/jfif' || fileExt === 'jpg') {
      cleanMime = 'image/jpeg';
    } else if (cleanMime === 'image/svg' || cleanMime.includes('svg')) {
      cleanMime = 'image/svg+xml';
    } else if (cleanMime.includes('png')) {
      cleanMime = 'image/png';
    } else if (cleanMime.includes('webp')) {
      cleanMime = 'image/webp';
    }

    // Determine target bucket: videos and PDFs should always go to 'site-data' which allows all binary types
    const isSpecialBinary = cleanMime.includes('pdf') || cleanMime.includes('video') || fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'mov';
    const targetBucket = isSpecialBinary ? 'site-data' : bucket;

    const finalFilename = filename || `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;

    // 1. Direct browser client upload to Supabase Storage using admin privileges
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(targetBucket)
        .upload(finalFilename, buffer, {
          contentType: cleanMime,
          upsert: true,
        });

      if (!error && data) {
        return `${SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${finalFilename}`;
      }

      // If client-logos bucket rejected mime type or size, immediately upload to 'site-data' which allows all files
      if (targetBucket !== 'site-data') {
        const fallback = await supabaseAdmin.storage
          .from('site-data')
          .upload(finalFilename, buffer, {
            contentType: cleanMime,
            upsert: true,
          });

        if (!fallback.error && fallback.data) {
          return `${SUPABASE_URL}/storage/v1/object/public/site-data/${finalFilename}`;
        }
      }
    } catch (directErr) {
      console.warn('Direct upload notice, trying proxy:', directErr);
    }

    // 2. If browser direct upload failed (e.g. network/CORS), proxy through server-side endpoint
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(buffer);
    });
    const dataUrl = await dataUrlPromise;

    const proxyEndpoint = isSpecialBinary ? '/api/upload-pdf' : '/api/upload-client-logo';
    const proxyPayload = isSpecialBinary
      ? { file: dataUrl, fileName: finalFilename, bucket: 'site-data', mimeType: cleanMime }
      : { image: dataUrl, fileName: finalFilename, bucket: 'site-data', mimeType: cleanMime };

    const proxyRes = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyPayload),
    });

    if (proxyRes.ok) {
      const result = await proxyRes.json();
      if (result.pdfUrl || result.logoUrl) {
        return result.pdfUrl || result.logoUrl;
      }
    }

    // Ultimate fallback: direct public storage URL in site-data
    return `${SUPABASE_URL}/storage/v1/object/public/site-data/${finalFilename}`;
  } catch (err) {
    console.error('Failed to upload file to Supabase storage:', err);
    throw err;
  }
}

/**
 * Upload a client logo directly to live Supabase Storage bucket ('client-logos')
 */
export async function uploadClientLogoToLiveStorage(
  fileOrDataUrl: string | File,
  clientName?: string
): Promise<string> {
  const cleanName = (clientName || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 24);

  let ext = 'jpg';
  if (typeof fileOrDataUrl !== 'string') {
    if (fileOrDataUrl.name.endsWith('.png')) ext = 'png';
    else if (fileOrDataUrl.name.endsWith('.svg')) ext = 'svg';
    else if (fileOrDataUrl.name.endsWith('.webp')) ext = 'webp';
  } else if (fileOrDataUrl.includes('image/png')) {
    ext = 'png';
  } else if (fileOrDataUrl.includes('image/svg')) {
    ext = 'svg';
  }

  const filename = `client-${cleanName}-${Date.now()}.${ext}`;

  return uploadFileToSupabaseStorage({
    fileOrDataUrl,
    bucket: 'client-logos',
    filename,
    prefix: 'client',
  });
}

/**
 * Upload a story cover image to live Supabase Storage bucket ('client-logos')
 */
export async function uploadStoryImageToLiveStorage(
  fileOrDataUrl: string | File,
  storyTitle?: string
): Promise<string> {
  const cleanTitle = (storyTitle || 'story')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 24);

  const filename = `story-${cleanTitle}-${Date.now()}.jpg`;

  return uploadFileToSupabaseStorage({
    fileOrDataUrl,
    bucket: 'client-logos',
    filename,
    prefix: 'story',
  });
}

/**
 * Upload a company branded logo file directly to live Supabase Storage bucket
 */
export async function uploadLogoToLiveStorage(fileOrDataUrl: string | File): Promise<string> {
  return uploadFileToSupabaseStorage({
    fileOrDataUrl,
    bucket: 'client-logos',
    filename: 'quality-centre-logo.jpg',
    prefix: 'logo',
  });
}

/**
 * Upload a book cover image directly to live Supabase Storage bucket ('client-logos')
 */
export async function uploadBookCoverToLiveStorage(
  fileOrDataUrl: string | File,
  bookTitle?: string
): Promise<string> {
  const cleanTitle = (bookTitle || 'iso-9000-secret')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 24);

  let ext = 'jpg';
  if (typeof fileOrDataUrl !== 'string') {
    if (fileOrDataUrl.name.endsWith('.png')) ext = 'png';
    else if (fileOrDataUrl.name.endsWith('.webp')) ext = 'webp';
  } else if (fileOrDataUrl.includes('image/png')) {
    ext = 'png';
  } else if (fileOrDataUrl.includes('image/webp')) {
    ext = 'webp';
  }

  const filename = `book-cover-${cleanTitle}-${Date.now()}.${ext}`;

  return uploadFileToSupabaseStorage({
    fileOrDataUrl,
    bucket: 'client-logos',
    filename,
    prefix: 'book',
  });
}

/**
 * Upload a Case Study PDF document directly to live Supabase Storage bucket ('client-logos' or 'site-data')
 */
export async function uploadPdfToLiveStorage(
  fileOrDataUrl: string | File,
  storyTitle?: string
): Promise<string> {
  const cleanTitle = (storyTitle || 'case-study')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 24);

  const filename = `case-study-${cleanTitle}-${Date.now()}.pdf`;

  return uploadFileToSupabaseStorage({
    fileOrDataUrl,
    bucket: 'site-data',
    filename,
    prefix: 'case-study-pdf',
  });
}
