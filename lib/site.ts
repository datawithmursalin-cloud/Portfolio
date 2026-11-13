/* Where the site lives. Both values come from the environment at build time,
   so the same code works at a domain root and under a GitHub Pages sub-path.
   NEXT_PUBLIC_BASE_PATH  e.g. "/Portfolio" for username.github.io/Portfolio, empty at a domain root
   NEXT_PUBLIC_SITE_URL   the full public address, without a trailing slash */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://datawithmursalin-cloud.github.io/Portfolio';
