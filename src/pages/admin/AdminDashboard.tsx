import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, DollarSign, Clock, Ship, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BookingWithRelations } from '../../lib/types';
import { formatCents, formatDateShort, getStatusColor, getStatusLabel } from '../../lib/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, upcoming: 0 });
  const [recentBookings, setRecentBookings] = useState<BookingWithRelations[]>([]);

  useEffect(() => {
    async function load() {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, boat_classes(*), trip_durations(*), captains(*), boats(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (bookings) {
        const all = bookings as BookingWithRelations[];
        setRecentBookings(all);
        const today = new Date().toISOString().split('T')[0];
        setStats({
          total: all.length,
          pending: all.filter(
            (b) => !b.assigned_captain_id && b.booking_status !== 'cancelled'
          ).length,
          revenue: all
            .filter((b) => b.payment_status === 'paid')
            .reduce((sum, b) => sum + b.deposit_amount, 0),
          upcoming: all.filter(
            (b) => b.booking_date >= today && b.booking_status !== 'cancelled'
          ).length,
        });
      }
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: CalendarDays },
    { label: 'Needs Captain', value: stats.pending, icon: Clock },
    { label: 'Deposit Revenue', value: formatCents(stats.revenue), icon: DollarSign },
    { label: 'Upcoming Trips', value: stats.upcoming, icon: Ship },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-nautical-blue rounded-xl border border-white/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <div className="w-9 h-9 bg-accent-orange/10 border border-accent-orange/20 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent-orange" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-nautical-blue rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-display font-bold text-lg text-white uppercase">Recent Bookings</h2>
          <Link
            to="/admin/bookings"
            className="text-accent-orange text-sm font-medium flex items-center gap-1 hover:text-orange-400 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Ref', 'Customer', 'Date', 'Class', 'Status', 'Deposit'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-bold text-white">
                    {booking.reference_code}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-300">
                    {booking.customer_first_name} {booking.customer_last_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-400">
                    {formatDateShort(booking.booking_date)}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-400">
                    {booking.boat_classes?.name}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(
                        booking.booking_status
                      )}`}
                    >
                      {getStatusLabel(booking.booking_status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-white font-bold">
                    {formatCents(booking.deposit_amount)}
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
