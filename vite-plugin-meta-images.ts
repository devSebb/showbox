import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates og:image and twitter:image meta tags
 * to point to the app's thumbnail image with the correct deployment domain.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      if (!baseUrl) {
        log('[meta-images] no Replit deployment domain found, skipping meta tag updates');
        return html;
      }

      // Check if thumbnail image exists in public directory
      const publicDir = path.resolve(process.cwd(), 'client', 'public');
      const thumbnailPngPath = path.join(publicDir, 'thumbnail.png');
      const thumbnailJpgPath = path.join(publicDir, 'thumbnail.jpg');
      const thumbnailJpegPath = path.join(publicDir, 'thumbnail.jpeg');

      let imageExt: string | null = null;
      if (fs.existsSync(thumbnailPngPath)) {
        imageExt = 'png';
      } else if (fs.existsSync(thumbnailJpgPath)) {
        imageExt = 'jpg';
      } else if (fs.existsSync(thumbnailJpegPath)) {
        imageExt = 'jpeg';
      }

      if (!imageExt) {
        log('[meta-images] Thumbnail image not found, skipping meta tag updates');
        return html;
      }

      const imageUrl = `${baseUrl}/thumbnail.${imageExt}`;

      log('[meta-images] updating meta image tags to:', imageUrl);

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/g,
        `<meta property="og:image" content="${imageUrl}" />`
      );

      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`
      );

      return html;
    },
  };
}

function getDeploymentUrl(): string | null {
  if (process.env.RENDER_EXTERNAL_URL) {
    const url = new URL(process.env.RENDER_EXTERNAL_URL).origin;
    log('[meta-images] using Render external URL:', url);
    return url;
  }

  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    const url = `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN}`;
    log('[meta-images] using internal app domain:', url);
    return url;
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    const url = `https://${process.env.REPLIT_DEV_DOMAIN}`;
    log('[meta-images] using dev domain:', url);
    return url;
  }

  return null;
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
}
