export const SITE_URL = 'https://fishthewahoo.com';
export const SITE_NAME = 'Fish The Wahoo';
export const DEFAULT_OG_IMAGE = '/images/fish-the-wahoo-charleston-sc.jpg';
export const DEFAULT_DESCRIPTION =
  "Charleston's premier deep sea fishing charter service. Book a 1/2 day, 3/4 day, or full day offshore trip with expert captains. Mahi, marlin, wahoo, and more.";
export const PHONE = '(843) 312-2981';
export const EMAIL = 'chuck141w@yahoo.com';

export function absUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pathOf(url: URL | string): string {
  const p = typeof url === 'string' ? url : url.pathname;
  if (p === '/' || p === '') return '/';
  return p.endsWith('/') ? p : `${p}/`;
}
