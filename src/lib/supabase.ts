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
export const LIVE_SUPABASE_DB_URL = `${SUPABASE_URL}/storage/v1/object/public/site-data/cms-database.json`;

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
 * Upload a logo file directly to live Supabase Storage bucket
 */
export async function uploadLogoToLiveStorage(fileOrDataUrl: string | File): Promise<string> {
  try {
    let buffer: Blob;
    let mimeType = 'image/jpeg';
    let fileExt = 'jpg';

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image/')) {
        const matches = fileOrDataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          mimeType = `image/${matches[1]}`;
          if (matches[1] === 'svg+xml') fileExt = 'svg';
          else if (matches[1] === 'png') fileExt = 'png';
          else if (matches[1] === 'webp') fileExt = 'webp';

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
        // Already a public URL
        return fileOrDataUrl;
      }
    } else {
      buffer = fileOrDataUrl;
      mimeType = fileOrDataUrl.type || 'image/jpeg';
      if (fileOrDataUrl.name.endsWith('.png')) fileExt = 'png';
      else if (fileOrDataUrl.name.endsWith('.svg')) fileExt = 'svg';
      else if (fileOrDataUrl.name.endsWith('.webp')) fileExt = 'webp';
    }

    const filename = `quality-centre-logo.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('client-logos')
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage client upload error, using direct public URL', error);
      return LIVE_SUPABASE_LOGO_URL;
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/client-logos/${filename}?v=${Date.now()}`;
    return publicUrl;
  } catch (e) {
    console.error('Failed to upload to live Supabase storage:', e);
    return LIVE_SUPABASE_LOGO_URL;
  }
}
