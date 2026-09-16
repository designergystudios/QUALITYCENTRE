import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials
export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://zzgwjegqiefanzhshxyn.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  '[REDACTED-SECRET]';

// Live public URL for Quality Centre branded logo in Supabase Storage
export const LIVE_SUPABASE_LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/client-logos/quality-centre-logo.jpg`;

// Live public URL for full CMS configuration database in Supabase Storage
export const LIVE_SUPABASE_DB_URL = `${SUPABASE_URL}/storage/v1/object/public/client-logos/cms-database.json`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch latest CMS configuration directly from live Supabase database
 */
export async function fetchLiveDatabase() {
  try {
    const res = await fetch(`${LIVE_SUPABASE_DB_URL}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
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
 * Persist CMS database snapshot directly to live Supabase Cloud storage
 */
export async function saveLiveDatabaseToSupabase(dbData: any) {
  try {
    const payload = {
      ...dbData,
      lastUpdated: dbData?.lastUpdated || Date.now(),
    };
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const { error } = await supabase.storage
      .from('client-logos')
      .upload('cms-database.json', blob, {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload notice:', error);
    }
    // Always call server proxy endpoint to ensure local container disk stays updated
    await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonString,
    }).catch(() => {});
  } catch (err) {
    console.warn('Live Supabase database save notice:', err);
  }
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
      mimeType = fileOrDataUrl.type || 'application/pdf';
      const name = fileOrDataUrl.name.toLowerCase();
      if (name.endsWith('.pdf')) fileExt = 'pdf';
      else if (name.endsWith('.png')) fileExt = 'png';
      else if (name.endsWith('.svg')) fileExt = 'svg';
      else if (name.endsWith('.webp')) fileExt = 'webp';
      else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) fileExt = 'jpg';
    }

    const finalFilename = filename || `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;

    // 1. Direct browser client upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalFilename, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (!error && data) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${finalFilename}`;
    }

    // 2. If browser direct upload failed (e.g. RLS policy on anon key), proxy through server-side endpoint
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(buffer);
    });
    const dataUrl = await dataUrlPromise;

    const proxyRes = await fetch('/api/upload-client-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        fileName: finalFilename,
        bucket,
      }),
    });

    if (proxyRes.ok) {
      const result = await proxyRes.json();
      if (result.logoUrl) {
        return result.logoUrl;
      }
    }

    // Fallback: direct public storage URL
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${finalFilename}`;
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
    bucket: 'client-logos',
    filename,
    prefix: 'case-study-pdf',
  });
}
