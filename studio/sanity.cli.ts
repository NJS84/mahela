import { defineCliConfig } from 'sanity/cli';

// Defaults are the Mahela project; public ids, not secrets. Env vars override them.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '4bvl0nc1',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: process.env.SANITY_STUDIO_HOST,
});
