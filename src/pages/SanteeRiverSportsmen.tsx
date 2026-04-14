import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

export default function SanteeRiverSportsmen() {
  return (
    <>
      <SEO
        title="Santee River Sportsmen | Fish The Wahoo Partner"
        description="Santee River Sportsmen — a partner brand of Fish The Wahoo. Freshwater fishing trips on the Santee River, South Carolina."
        canonicalPath="/santee-river-sportsmen/"
      />

      <section className="pt-32 pb-20 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Partner Brand</span>
          <h1 className="text-5xl text-white uppercase mb-6">Santee River Sportsmen</h1>
          <div className="w-24 h-1 bg-accent-orange mx-auto mb-8" />
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Santee River Sportsmen is a freshwater fishing operation on the Santee River in South
            Carolina. For more information about freshwater trips, contact us directly.
          </p>
          <Link to="/contact" className="btn-primary px-12 py-4 text-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
