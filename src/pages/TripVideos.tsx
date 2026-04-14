import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

const videos = [
  {
    title: 'Full Day Deep Sea Fishing Trip — Blue Marlin Strike',
    description: 'Follow along on a 12-hour deep sea trip as the crew hooks up on a 400lb blue marlin.',
    embedId: 'dQw4w9WgXcQ',
  },
  {
    title: 'Overnight Gulf Stream Swordfish Trip',
    description: 'Our overnight Gulf Stream trip in action. Night fishing for broadbill swordfish.',
    embedId: 'dQw4w9WgXcQ',
  },
  {
    title: 'Mahi-Mahi Frenzy on the Weed Line',
    description: 'Nonstop mahi-mahi action along a productive Gulf Stream weed line.',
    embedId: 'dQw4w9WgXcQ',
  },
];

export default function TripVideos() {
  return (
    <>
      <SEO
        title="Trip Videos | Fish The Wahoo Charleston"
        description="Watch deep sea fishing trip videos from Fish The Wahoo out of Charleston, SC. Blue marlin, mahi-mahi, wahoo, and more."
        canonicalPath="/trip-videos/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Video</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">Trip Videos</h1>
          <div className="section-divider" />
        </div>
      </section>

      <section className="py-12 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <div key={i} className="metallic-card rounded-xl overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold mb-2 leading-snug">{video.title}</h3>
                  <p className="text-slate-400 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
