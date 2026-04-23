import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  LayoutDashboard,
  CalendarDays,
  Ship,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays, exact: false },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail, exact: false },
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
      if (!session) navigate('/admin/login');
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
      <div className="min-h-screen bg-nautical-dark flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-nautical-dark flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-nautical-blue border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-accent-orange p-1.5 rounded-full">
              <Anchor className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg tracking-tight">FTW Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to, link.exact)
                  ? 'bg-accent-orange/20 text-accent-orange'
                  : 'text-slate-400 hover:bg-nautical-light hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-nautical-light hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-nautical-light hover:text-slate-300 transition-colors"
          >
            View Public Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-nautical-blue border-b border-white/10 h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-white">
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
