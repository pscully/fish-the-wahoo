import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  LayoutDashboard,
  CalendarDays,
  Ship,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays, exact: false },
  { to: '/admin/captains', label: 'Captains & Boats', icon: Ship, exact: false },
  { to: '/admin/availability', label: 'Availability', icon: Users, exact: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      }
      setChecking(false);
    });
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="animate-pulse text-navy-400 font-body">Loading...</div>
      </div>
    );
  }

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-navy-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-950 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-navy-800">
          <Link to="/admin" className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-sea-400" />
            <span className="text-white font-display text-lg">FTW Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-navy-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                isActive(link.to, link.exact)
                  ? 'bg-sea-600/20 text-sea-400'
                  : 'text-navy-400 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-navy-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-body text-sm text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-body text-sm text-navy-500 hover:bg-navy-800 hover:text-navy-300 transition-colors mt-1"
          >
            View Public Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-navy-200 h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-navy-600 hover:text-navy-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display text-navy-900">
            {sidebarLinks.find((l) => isActive(l.to, l.exact))?.label || 'Admin'}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
