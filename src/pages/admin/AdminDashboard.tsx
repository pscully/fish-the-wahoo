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
          pending: all.filter((b) => !b.assigned_captain_id && b.booking_status !== 'cancelled').length,
          revenue: all.filter((b) => b.payment_status === 'paid').reduce((sum, b) => sum + b.deposit_amount, 0),
          upcoming: all.filter((b) => b.booking_date >= today && b.booking_status !== 'cancelled').length,
        });
      }
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: CalendarDays, color: 'bg-sea-100 text-sea-600' },
    { label: 'Needs Captain', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Deposit Revenue', value: formatCents(stats.revenue), icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Upcoming Trips', value: stats.upcoming, icon: Ship, color: 'bg-navy-100 text-navy-600' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-navy-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-navy-500 font-body text-sm">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display text-navy-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-navy-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-200">
          <h2 className="font-display text-lg text-navy-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sea-600 font-body text-sm font-medium flex items-center gap-1 hover:text-sea-700">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-200">
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Ref</th>
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Class</th>
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Deposit</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50">
                  <td className="px-6 py-3 font-body text-sm font-medium text-navy-900">{booking.reference_code}</td>
                  <td className="px-6 py-3 font-body text-sm text-navy-700">
                    {booking.customer_first_name} {booking.customer_last_name}
                  </td>
                  <td className="px-6 py-3 font-body text-sm text-navy-600">{formatDateShort(booking.booking_date)}</td>
                  <td className="px-6 py-3 font-body text-sm text-navy-600">{booking.boat_classes?.name}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${getStatusColor(booking.booking_status)}`}>
                      {getStatusLabel(booking.booking_status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-body text-sm text-navy-900 font-medium">{formatCents(booking.deposit_amount)}</td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-navy-400 font-body text-sm">
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
