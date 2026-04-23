import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Expand } from 'lucide-react';
import type { GalleryImage } from '../../content/gallery';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick?: (index: number) => void;
}

interface TileProps {
  image: GalleryImage;
  index: number;
  onClick?: () => void;
}

const Tile = forwardRef<HTMLElement, TileProps>(({ image, index, onClick }, ref) => {
  const eager = index < 4;
  const imgProps = {
    src: image.src,
    alt: image.alt,
    loading: eager ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    ...(eager ? { fetchPriority: 'high' as const } : {}),
    className: 'w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]',
  };

  const content = (
    <>
      <img {...imgProps} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nautical-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      {onClick && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-nautical-dark/70 text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
        >
          <Expand className="h-4 w-4" />
        </span>
      )}
    </>
  );

  const wrapperClass =
    'group relative block w-full overflow-hidden rounded-xl bg-nautical-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-nautical-blue';

  if (onClick) {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        aria-label={`View image: ${image.alt}`}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
        className={`${wrapperClass} cursor-zoom-in mb-4 break-inside-avoid`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
      className={`${wrapperClass} mb-4 break-inside-avoid`}
    >
      {content}
    </motion.div>
  );
});

Tile.displayName = 'GalleryTile';

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      {images.map((image, i) => (
        <Tile
          key={image.src}
          image={image}
          index={i}
          onClick={onImageClick ? () => onImageClick(i) : undefined}
        />
      ))}
    </div>
  );
}
