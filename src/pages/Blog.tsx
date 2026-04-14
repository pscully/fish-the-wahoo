import { Link } from 'react-router-dom';
import { getAllPosts } from '../lib/blog';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function Blog() {
  const posts = getAllPosts();

  return (
    <>
      <SEO
        title="Deep Sea Fishing Blog | Fish The Wahoo Charleston"
        description="Fishing tips, trip reports, species guides, and deep sea fishing news from Fish The Wahoo out of Charleston, SC."
        canonicalPath="/blog/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Articles</span>
          <h1 className="text-5xl text-white uppercase mb-4">Fishing Blog</h1>
          <div className="w-24 h-1 bg-accent-orange mb-6" />
          <p className="text-slate-400 max-w-2xl">
            Fishing tips, species guides, trip reports, and deep sea fishing news from the
            Fish The Wahoo crew.
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="bg-nautical-blue rounded-xl p-12 text-center border border-white/10">
              <p className="text-slate-400 text-lg mb-2">Blog posts are being migrated.</p>
              <p className="text-slate-500 text-sm">Check back soon for tips, reports, and species guides.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="metallic-card rounded-xl overflow-hidden group block"
                >
                  {post.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
                      {post.date}
                    </p>
                    <h2 className="text-white font-display font-bold text-lg mb-3 leading-snug group-hover:text-accent-orange transition-colors">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    <span className="inline-block mt-4 text-accent-orange text-xs font-bold uppercase tracking-widest">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
