import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface GalleryImage {
  src: string;
  alt: string;
  size?: 'large' | 'medium' | 'small';
}

const defaultImages: GalleryImage[] = [
  {
    src: 'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Boat at sunset',
    size: 'large',
  },
  {
    src: 'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Deep sea catch',
    size: 'medium',
  },
  {
    src: 'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Family fishing',
    size: 'small',
  },
  {
    src: 'https://images.pexels.com/photos/3361691/pexels-photo-3361691.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Fishing charter',
    size: 'small',
  },
  {
    src: 'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Ocean fishing',
    size: 'medium',
  },
  {
    src: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Trophy tuna',
    size: 'small',
  },
  {
    src: 'https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Captain at helm',
    size: 'small',
  },
  {
    src: 'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Group catch',
    size: 'large',
  },
];

interface GallerySectionProps {
  images?: GalleryImage[];
  showViewAll?: boolean;
}

export default function GallerySection({
  images = defaultImages,
  showViewAll = true,
}: GallerySectionProps) {
  return (
    <section id="gallery" className="py-24 bg-nautical-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label">Photos</span>
          <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">
            Recent Catches & Our Fleet
          </h2>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            A glimpse into the daily adventures on the Atlantic. From trophy catches to our
            state-of-the-art sportfishing fleet.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                img.size === 'large'
                  ? 'row-span-2 col-span-2'
                  : img.size === 'medium'
                  ? 'col-span-2'
                  : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-bold uppercase tracking-widest text-sm">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-16 text-center">
            <Link to="/gallery" className="btn-outline">
              View Full Gallery
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
