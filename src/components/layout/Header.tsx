import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Anchor } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/book', label: 'Packages & Pricing' },
  { to: '/about', label: 'About' },
  { to: '/check', label: 'Check Your Charter' },
  { to: '/faq', label: 'FAQ' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const headerBg = scrolled || !isHome
    ? 'bg-navy-950/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link to="/" className="flex items-center gap-2 group">
            <Anchor className="w-8 h-8 text-sea-400 transition-transform duration-300 group-hover:rotate-12" />
            <div className="flex flex-col">
              <span className="text-white font-display text-xl leading-none">Fish The Wahoo</span>
              <span className="text-sea-400 text-[10px] font-body font-medium tracking-widest uppercase">
                Charleston Fishing Charters
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg font-body text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-sea-400'
                    : 'text-navy-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book" className="ml-3 btn-primary text-sm py-2.5">
              Book Now
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-sea-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-navy-950/98 backdrop-blur-md border-t border-navy-800 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-lg font-body text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-sea-600/20 text-sea-400'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/book" className="btn-primary w-full text-sm py-2.5">
              Book Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
