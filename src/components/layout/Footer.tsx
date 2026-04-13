import { Link } from 'react-router-dom';
import { Anchor, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300">
      <div className="container-wide mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Anchor className="w-7 h-7 text-sea-400" />
              <div className="flex flex-col">
                <span className="text-white font-display text-lg leading-none">Fish The Wahoo</span>
                <span className="text-sea-400 text-[9px] font-body font-medium tracking-widest uppercase">
                  Charleston Fishing Charters
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Charleston's best deep sea fishing. Book in one place and get access to 15+ captains
              and boats around Charleston.
            </p>
          </div>

          <div>
            <h3 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/book', label: 'Book a Charter' },
                { to: '/check', label: 'Check Your Charter' },
                { to: '/about', label: 'About Us' },
                { to: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-sea-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-sea-400 shrink-0" />
                <span>(843) 568-3222</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-sea-400 shrink-0" />
                <span>info@fishthewahoo.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-sea-400 shrink-0" />
                <span>Charleston, SC</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Fishing Packages
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/book" className="text-sm hover:text-sea-400 transition-colors duration-200">
                  Half Day Charters
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-sm hover:text-sea-400 transition-colors duration-200">
                  3/4 Day Charters
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-sm hover:text-sea-400 transition-colors duration-200">
                  Full Day Charters
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-navy-500">
            &copy; {new Date().getFullYear()} Fish The Wahoo. All rights reserved.
          </p>
          <p className="text-xs text-navy-500">
            Charleston, South Carolina
          </p>
        </div>
      </div>
    </footer>
  );
}
