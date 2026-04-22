/**
 * Legacy URL redirect map.
 * key: old path (no trailing slash), value: new path
 * Used to generate _redirects at build time.
 */
export const redirects: Record<string, string> = {
  // WooCommerce replacements
  '/shop': '/book',
  '/checkout': '/book',
  '/cart': '/book',
  '/my-account': '/book',
  '/thank-you': '/book',
  '/success': '/book',
  '/fishing-reservation': '/book',

  // Booking aliases
  '/book-your-trip': '/book',
  '/manual-booking': '/book',

  // Check aliases
  '/check-my-charter': '/check',

  // About aliases
  '/meet-the-crew': '/about',
  '/captains': '/about',

  // Retired packages
  '/packages/4-hour-family-fun-in-the-sun-charter': '/packages',
  '/packages/4-hour-near-shore-fishing': '/packages',
  '/packages/overnight-gulf-stream-deep-sea-fishing': '/packages',
  '/packages/6-hour-deep-sea-fishing': '/packages/6-hour-bottom-fishing',

  // Contact aliases
  '/contact-us': '/contact',

  // Packages
  '/packages-and-prices': '/packages',

  // Legal aliases
  '/contact-us/privacy-policy': '/privacy-policy',
  '/contact-us/terms-of-use': '/terms-of-use',

  // Blog category
  '/category/general': '/blog',

  // Daily catch
  '/captain-daily-report': '/daily-catch',
  '/charter-survey': '/contact',

  // Species legacy flat URLs (301 to new /species/:slug/)
  '/blue-marlin-fishing': '/species/blue-marlin',
  '/white-marlin-fishing': '/species/white-marlin',
  '/dolphin-fishing': '/species/dolphin',
  '/mahi-mahi-fishing': '/species/mahi-mahi',
  '/grouper-fishing': '/species/grouper',
  '/red-snapper-fishing': '/species/red-snapper',
  '/sailfish-fishing': '/species/sailfish',
  '/sea-bass-fishing': '/species/sea-bass',
  '/tuna-fishing': '/species/tuna-charleston',
  '/swordfish-fishing': '/species/swordfish',
  '/shark-fishing': '/species/shark',
  '/wahoo-fishing': '/species/wahoo',

  // Cryptic date-slug daily catch posts
  '/7716': '/daily-catch',
  '/82016': '/daily-catch',
  '/125-1221': '/daily-catch',
  '/1224-228': '/daily-catch',
  '/925-108': '/daily-catch',
  '/82916-2': '/daily-catch',
  '/8516-81816': '/daily-catch',
  '/1010-112': '/daily-catch',
  '/12-22-16': '/daily-catch',
  '/12-1-23-fish-report': '/daily-catch',
  '/september-4th-harbor-cruise': '/daily-catch',
  '/august-1-inshore': '/daily-catch',
  '/july-5th-deep-sea-fishing-adventure': '/daily-catch',
};
