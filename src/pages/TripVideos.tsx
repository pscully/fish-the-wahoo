import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

interface TripVideo {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  display_order: number;
}

export default function TripVideos() {
  const [videos, setVideos] = useState<TripVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('trip_videos')
      .select('id, title, description, youtube_id, display_order')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data) setVideos(data as TripVideo[]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="Trip Videos | Fish The Wahoo Charleston"
        description="Watch deep sea fishing trip videos from Fish The Wahoo out of Charleston, SC. Blue marlin, mahi-mahi, wahoo, swordfish, and more."
        canonicalPath="/trip-videos/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Video</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">Trip Videos</h1>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            Watch our captains in action. From trophy marlin to swordfish in the Gulf Stream,
            here's what fishing with Fish The Wahoo looks like.
          </p>
        </div>
      </section>

      <section className="py-12 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : videos.length === 0 ? (
            <div className="bg-nautical-blue rounded-xl p-12 text-center border border-white/10">
              <p className="text-slate-400">Videos coming soon. Follow us on YouTube for the latest trips.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="metallic-card rounded-xl overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}`}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-display font-bold mb-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
