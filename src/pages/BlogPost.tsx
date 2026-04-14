import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts } from '../lib/blog';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? '');

  if (!post) return <Navigate to="/blog" replace />;

  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  const prev = allPosts[idx + 1];
  const next = allPosts[idx - 1];

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        ogImage={post.image}
        canonicalPath={`/blog/${post.slug}/`}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        {post.image ? (
          <>
            <div className="absolute inset-0 z-0">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-nautical-dark/80" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-accent-orange text-sm font-bold uppercase tracking-widest mb-6 hover:gap-2 transition-all"
              >
                ← Blog
              </Link>
              <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">{post.date}</p>
              <h1 className="text-4xl md:text-5xl text-white uppercase leading-tight">{post.title}</h1>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-accent-orange text-sm font-bold uppercase tracking-widest mb-6 hover:gap-2 transition-all"
            >
              ← Blog
            </Link>
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">{post.date}</p>
            <h1 className="text-4xl md:text-5xl text-white uppercase leading-tight">{post.title}</h1>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-12 bg-nautical-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-dark">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* Prev / Next */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="group">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">← Previous</p>
                <p className="text-white text-sm font-bold group-hover:text-accent-orange transition-colors leading-snug">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link to={`/blog/${next.slug}`} className="group text-right">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Next →</p>
                <p className="text-white text-sm font-bold group-hover:text-accent-orange transition-colors leading-snug">
                  {next.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
