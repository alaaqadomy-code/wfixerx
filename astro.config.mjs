// @ts-check
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// lastmod = the real last change of each page's source file (git commit date;
// today if the file has uncommitted edits). Unknown → no lastmod.
function lastmodFor(url) {
  try {
    const p = decodeURIComponent(new URL(url).pathname).replace(/^\/|\/$/g, '');
    const candidates = p === '' ? ['src/pages/index.astro'] : [`src/pages/${p}.astro`, `src/pages/${p}/index.astro`];
    const file = candidates.find((f) => existsSync(f));
    if (!file) return undefined;
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { encoding: 'utf8' }).trim();
    if (dirty) return new Date().toISOString().slice(0, 10);
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim();
    return d || undefined;
  } catch {
    return undefined;
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://wfixerx.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      }
    })
  ]
});
