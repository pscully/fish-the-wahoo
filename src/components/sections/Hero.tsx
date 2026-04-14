import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface HeroProps {
  badge?: string;
  headline: React.ReactNode;
  subheadline?: string;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  bgImage?: string;
  fullscreen?: boolean;
}

export default function Hero({
  badge = 'The Premier Deep Sea Experience',
  headline,
  subheadline,
  primaryCta = { label: 'Book A Trip', to: '/book' },
  secondaryCta,
  bgImage = 'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=1920',
  fullscreen = true,
}: HeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        fullscreen ? 'min-h-screen' : 'min-h-[60vh]'
      }`}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Deep Sea Fishing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-nautical-dark/60 via-nautical-dark/40 to-nautical-dark" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {badge && (
            <span className="section-label">
              {badge}
            </span>
          )}
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.9] uppercase">
            {headline}
          </h1>
          {subheadline && (
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
              {subheadline}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={primaryCta.to} className="btn-primary w-full sm:w-auto px-12 py-4 text-lg">
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link to={secondaryCta.to} className="btn-outline w-full sm:w-auto px-12 py-4 text-lg">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {fullscreen && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-accent-orange rounded-full" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
