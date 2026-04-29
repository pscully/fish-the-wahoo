import { useEffect } from 'react';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface JsonLdProps {
  data: JsonLdData;
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  const stringified = items.map((item) => JSON.stringify(item));
  const cacheKey = stringified.join('||');

  useEffect(() => {
    const scripts = stringified.map((text, i) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      if (id) el.dataset.jsonldId = `${id}-${i}`;
      el.text = text;
      document.head.appendChild(el);
      return el;
    });
    return () => {
      scripts.forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return null;
}
