import { Link } from 'react-router-dom';
import { Anchor, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const quickLinks = [
  { to: '/packages', label: 'Packages & Pricing' },
  { to: '/captains', label: 'Our Captains' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const packageLinks = [
  { to: '/packages/4-hour-family-fun-in-the-sun-charter', label: '4-Hour Family Fun' },
  { to: '/packages/6-hour-deep-sea-fishing', label: '6-Hour Deep Sea' },
  { to: '/packages/9-hour-deep-sea-fishing', label: '9-Hour Deep Sea' },
  { to: '/packages/12-hour-deep-sea-fishing', label: '12-Hour Deep Sea' },
  { to: '/packages/harbor-cruises', label: 'Harbor Cruises' },
];

export default function Footer() {
  return (
    <footer className="bg-nautical-dark border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-accent-orange p-2 rounded-full">
                <Anchor className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-white leading-none uppercase tracking-tighter">
                  Fish The Wahoo
                </span>
                <span className="text-[10px] font-medium text-accent-orange uppercase tracking-[0.2em]">
                  Charleston Fishing Charters
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Charleston's premier deep-sea fishing charter service. Providing
              unforgettable offshore adventures for over 30 years.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/fishthewahoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-accent-orange transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/fishthewahoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-accent-orange transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@fishthewahoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-accent-orange transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-display font-bold uppercase tracking-widest mb-6 text-sm">
              Quick Links
            </h5>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-accent-orange text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-display font-bold uppercase tracking-widest mb-6 text-sm">
              Contact Info
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <span>Shem Creek Marina<br />Mount Pleasant, SC 29464</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-accent-orange shrink-0" />
                <span>(843) 568-3222</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-accent-orange shrink-0" />
                <span>info@fishthewahoo.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white font-display font-bold uppercase tracking-widest mb-6 text-sm">
              Newsletter
            </h5>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe for seasonal updates, trip reports, and special offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                placeholder="Email Address"
                className="bg-nautical-blue border border-white/10 px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-accent-orange placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-accent-orange px-4 py-2 text-white hover:bg-orange-600 transition-colors shrink-0"
              >
                Go
              </button>
            </form>
            <div className="mt-8">
              <h5 className="text-white font-display font-bold uppercase tracking-widest mb-4 text-sm">
                Fishing Packages
              </h5>
              <ul className="space-y-2">
                {packageLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-slate-400 hover:text-accent-orange text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Fish The Wahoo. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="text-slate-500 hover:text-white text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="text-slate-500 hover:text-white text-xs transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              to="/cancellation-policy"
              className="text-slate-500 hover:text-white text-xs transition-colors"
            >
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
