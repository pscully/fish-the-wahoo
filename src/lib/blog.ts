import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  content: string;
}

// Eagerly load all .md files as raw strings at build time.
// Path is relative to the Vite project root (web-app/).
const modules = import.meta.glob('/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parsePost(raw: string, filePath: string): BlogPost {
  const { data, content } = matter(raw);
  const filename = filePath.split('/').pop() ?? '';
  const slug = data.slug ?? filename.replace(/\.md$/, '');
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    image: data.image,
    content,
  };
}

let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (_cache) return _cache;
  const posts = Object.entries(modules)
    .map(([path, raw]) => parsePost(raw, path))
    .filter((p) => p.title && p.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  _cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
