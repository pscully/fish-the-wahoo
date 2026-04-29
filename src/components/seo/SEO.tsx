import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const BASE_TITLE = 'Fish The Wahoo | Charleston Deep Sea Fishing Charters';
const BASE_URL = 'https://fishthewahoo.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/fish-the-wahoo-charleston-sc.jpg`;

export default function SEO({ title, description, ogImage, canonicalPath }: SEOProps) {
  const fullTitle = title === BASE_TITLE ? title : `${title} | Fish The Wahoo`;
  const defaultDesc =
    'Charleston\'s premier deep sea fishing charter service. Book a 1/2 day, 3/4 day, or full day offshore trip with expert captains. Mahi, marlin, wahoo, and more.';
  const finalDesc = description || defaultDesc;
  const finalImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${BASE_URL}${ogImage}`
    : DEFAULT_OG_IMAGE;
  const finalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (property) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', finalDesc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:image', finalImage, true);
    if (finalUrl) setMeta('og:url', finalUrl, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', finalImage);

    if (finalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = finalUrl;
    }
  }, [fullTitle, finalDesc, finalImage, finalUrl]);

  return null;
}
