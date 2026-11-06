// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.mahela.co.za',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
