/**
 * Extract video metadata from YouTube/Vimeo URLs using oEmbed
 */

export interface VideoMeta {
  title: string;
  thumbnailUrl: string;
  providerName: string;
  embedUrl: string;
  duration?: number;
}

/**
 * Parse a YouTube or Vimeo URL and return an oEmbed metadata object
 */
export async function fetchVideoMeta(url: string): Promise<VideoMeta | null> {
  try {
    if (isYouTube(url)) {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const videoId = extractYouTubeId(url);
      return {
        title: data.title,
        thumbnailUrl: data.thumbnail_url,
        providerName: "YouTube",
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      };
    }

    if (isVimeo(url)) {
      const res = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const vimeoId = extractVimeoId(url);
      return {
        title: data.title,
        thumbnailUrl: data.thumbnail_url,
        providerName: "Vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
        duration: data.duration,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function isYouTube(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

export function isVimeo(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] || null;
}

/**
 * Get a thumbnail URL for a video without making an API call
 * (useful for quick display before full metadata loads)
 */
export function getQuickThumbnail(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  
  return null; // Vimeo requires API call
}
