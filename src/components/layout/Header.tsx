import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Anchor } from 'lucide-react';

const navLinks = [
  { to: '/packages', label: 'Packages' },
  { to: '/captains', label: 'Captains' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
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
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-accent-orange p-2 rounded-full">
            <Anchor className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-white leading-none uppercase tracking-tighter">
              Fish The Wahoo
            </span>
            <span className="text-[10px] font-medium text-accent-orange uppercase tracking-[0.2em]">
              Charleston Fishing Charters
            </span>
          </div>
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
          <Link to="/book" className="btn-primary py-2 px-6 text-sm">
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
              <Link to="/book" className="btn-primary w-full mt-4 text-center">
                Book A Trip
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
