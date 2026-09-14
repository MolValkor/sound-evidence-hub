import { defineConfig } from 'astro/config';

// Provisional Netlify-style URL until a custom domain or real Netlify subdomain is confirmed.
// Update this before production deploy; see README.
export default defineConfig({
  site: 'https://sound-evidence-hub.netlify.app',
  output: 'static',
  trailingSlash: 'ignore',
});
