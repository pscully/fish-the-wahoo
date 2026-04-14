import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const BASE_TITLE = 'Fish The Wahoo | Charleston Deep Sea Fishing Charters';
const BASE_URL = 'https://fishthewahoo.com';

export default function SEO({ title, description, ogImage, canonicalPath }: SEOProps) {
  const fullTitle = title === BASE_TITLE ? title : `${title} | Fish The Wahoo`;
  const defaultDesc =
    'Charleston\'s premier deep sea fishing charter service. Book a 4-12 hour offshore trip with expert captains. Mahi, marlin, wahoo, and more.';

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

    setMeta('description', description || defaultDesc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description || defaultDesc, true);
    if (ogImage) setMeta('og:image', ogImage, true);
    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = `${BASE_URL}${canonicalPath}`;
    }
  }, [fullTitle, description, ogImage, canonicalPath, defaultDesc]);

  return null;
}
