import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/packages', label: 'Packages' },
  { to: '/tour-boats', label: 'Boats' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const headerBg =
    scrolled || !isHome
      ? 'bg-nautical-dark/95 backdrop-blur-md py-3 shadow-xl'
      : 'bg-transparent py-6';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center" aria-label="Fish The Wahoo — Charleston Fishing Charters">
          <img
            src="/images/logo.webp"
            alt="Fish The Wahoo — Charleston Fishing Charters"
            className="h-12 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-display font-semibold uppercase tracking-widest transition-colors duration-200 ${
                location.pathname.startsWith(link.to)
                  ? 'text-accent-orange'
                  : 'text-white hover:text-accent-orange'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/book/calendar" className="btn-primary py-2 px-6 text-sm">
            Book A Trip
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-nautical-blue border-t border-white/10 p-6 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-lg font-display font-semibold uppercase transition-colors ${
                    location.pathname.startsWith(link.to)
                      ? 'text-accent-orange'
                      : 'text-white hover:text-accent-orange'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/book/calendar" className="btn-primary w-full mt-4 text-center">
                Book A Trip
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
