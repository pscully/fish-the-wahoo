import { Link } from 'react-router-dom';

interface CTABannerProps {
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaTo?: string;
  bgImage?: string;
}

export default function CTABanner({
  headline = 'Ready for an Unforgettable Adventure?',
  subtext = 'Our calendar fills up fast during peak season. Secure your date today and get ready to experience the best deep sea fishing Charleston has to offer.',
  ctaLabel = 'Check Availability',
  ctaTo = '/book',
  bgImage = '/images/fishing-charters-hero-default.webp',
}: CTABannerProps) {
  return (
    <section
      className="py-20 bg-fixed bg-center bg-cover relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-nautical-dark/80" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl text-white mb-8 uppercase">{headline}</h2>
        <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">{subtext}</p>
        <Link to={ctaTo} className="btn-primary px-12 py-4 text-lg">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
