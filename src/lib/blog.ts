export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  content: string;
}

// Eagerly load all .md files as raw strings at build time.
// Path is relative to the Vite project root.
const modules = import.meta.glob('/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

/**
 * Parse our own frontmatter instead of pulling gray-matter into the browser
 * (which depends on Node internals and can blow up at scale). The scraper
 * always writes values as JSON strings, so each line is safe to JSON.parse.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const rawVal = line.slice(idx + 1).trim();
    if (!key) continue;
    try {
      data[key] = JSON.parse(rawVal);
    } catch {
      data[key] = rawVal.replace(/^['"]|['"]$/g, '');
    }
  }
  return { data, content: m[2] };
}

function parsePost(raw: string, filePath: string): BlogPost | null {
  try {
    const { data, content } = parseFrontmatter(raw);
    const filename = filePath.split('/').pop() ?? '';
    const slug = (data.slug as string) ?? filename.replace(/\.md$/, '');
    return {
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? '',
      description: (data.description as string) ?? '',
      image: data.image as string | undefined,
      content,
    };
  } catch (err) {
    console.error(`[blog] failed to parse ${filePath}`, err);
    return null;
  }
}

let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (_cache) return _cache;
  const posts = Object.entries(modules)
    .map(([path, raw]) => parsePost(raw, path))
    .filter((p): p is BlogPost => !!p && !!p.title && !!p.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  _cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
