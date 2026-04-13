import { useEffect, useState } from 'react';
import { Search, Send, Loader2, X, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BookingWithRelations, Captain, Boat } from '../../lib/types';
import { formatCents, formatDate, formatDateShort, getStatusColor, getStatusLabel } from '../../lib/format';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [assignCaptainId, setAssignCaptainId] = useState('');
  const [assignBoatId, setAssignBoatId] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [bookingRes, captainRes, boatRes] = await Promise.all([
      supabase.from('bookings').select('*, boat_classes(*), trip_durations(*), captains(*), boats(*)').order('created_at', { ascending: false }),
      supabase.from('captains').select('*').eq('is_active', true).order('name'),
      supabase.from('boats').select('*').eq('is_active', true).order('name'),
    ]);
    if (bookingRes.data) setBookings(bookingRes.data as BookingWithRelations[]);
    if (captainRes.data) setCaptains(captainRes.data as Captain[]);
    if (boatRes.data) setBoats(boatRes.data as Boat[]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch = !search ||
      b.reference_code.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_last_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_first_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (booking: BookingWithRelations) => {
    setSelectedBooking(booking);
    setAssignCaptainId(booking.assigned_captain_id || '');
    setAssignBoatId(booking.assigned_boat_id || '');
  };

  const handleAssign = async () => {
    if (!selectedBooking || !assignCaptainId) return;
    setSaving(true);
    const updates: Record<string, string> = {
      assigned_captain_id: assignCaptainId,
      booking_status: 'captain_assigned',
    };
    if (assignBoatId) updates.assigned_boat_id = assignBoatId;

    await supabase.from('bookings').update(updates).eq('id', selectedBooking.id);
    setSaving(false);
    setSelectedBooking(null);
    loadData();
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    await supabase.from('bookings').update({ booking_status: newStatus }).eq('id', bookingId);
    loadData();
    if (selectedBooking?.id === bookingId) setSelectedBooking(null);
  };

  const handleNotifyCaptain = async (bookingId: string) => {
    setNotifying(true);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`${supabaseUrl}/functions/v1/notify-captain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ bookingId }),
    });
    setNotifying(false);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by name or reference code..."
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field appearance-none pr-10 min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="captain_assigned">Captain Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-200 bg-navy-50">
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Ref</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Class</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Captain</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-navy-500 uppercase tracking-wider">Deposit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-navy-400 font-body text-sm">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-navy-400 font-body text-sm">No bookings found</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => openDetail(b)}
                    className="border-b border-navy-100 last:border-0 hover:bg-navy-50 cursor-pointer"
                  >
                    <td className="px-5 py-3 font-body text-sm font-medium text-navy-900">{b.reference_code}</td>
                    <td className="px-5 py-3 font-body text-sm text-navy-700">{b.customer_first_name} {b.customer_last_name}</td>
                    <td className="px-5 py-3 font-body text-sm text-navy-600">{formatDateShort(b.booking_date)}</td>
                    <td className="px-5 py-3 font-body text-sm text-navy-600">{b.boat_classes?.name}</td>
                    <td className="px-5 py-3 font-body text-sm text-navy-600">{b.trip_durations?.name}</td>
                    <td className="px-5 py-3 font-body text-sm text-navy-600">{b.captains?.name || <span className="text-amber-600">Unassigned</span>}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${getStatusColor(b.booking_status)}`}>
                        {getStatusLabel(b.booking_status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-body text-sm text-navy-900 font-medium">{formatCents(b.deposit_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-200">
              <h3 className="font-display text-lg text-navy-900">
                Booking {selectedBooking.reference_code}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="p-1 hover:bg-navy-100 rounded-lg">
                <X className="w-5 h-5 text-navy-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-navy-400 font-body text-xs">Customer</span>
                  <p className="text-navy-900 font-body font-medium">
                    {selectedBooking.customer_first_name} {selectedBooking.customer_last_name}
                  </p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Email</span>
                  <p className="text-navy-900 font-body font-medium">{selectedBooking.customer_email}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Phone</span>
                  <p className="text-navy-900 font-body font-medium">{selectedBooking.customer_phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Party Size</span>
                  <p className="text-navy-900 font-body font-medium">{selectedBooking.party_size}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Date</span>
                  <p className="text-navy-900 font-body font-medium">{formatDate(selectedBooking.booking_date)}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Duration</span>
                  <p className="text-navy-900 font-body font-medium">{selectedBooking.trip_durations?.name}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Vessel Class</span>
                  <p className="text-navy-900 font-body font-medium">{selectedBooking.boat_classes?.name}</p>
                </div>
                <div>
                  <span className="text-navy-400 font-body text-xs">Deposit</span>
                  <p className="text-navy-900 font-body font-medium">{formatCents(selectedBooking.deposit_amount)}</p>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div>
                  <span className="text-navy-400 font-body text-xs">Special Requests</span>
                  <p className="text-navy-700 font-body text-sm mt-1">{selectedBooking.special_requests}</p>
                </div>
              )}

              <div className="border-t border-navy-200 pt-4">
                <h4 className="font-body font-semibold text-navy-900 text-sm mb-3">Assign Captain & Boat</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-body font-medium text-navy-500 mb-1">Captain</label>
                    <select
                      value={assignCaptainId}
                      onChange={(e) => setAssignCaptainId(e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">Select Captain</option>
                      {captains.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-navy-500 mb-1">Boat</label>
                    <select
                      value={assignBoatId}
                      onChange={(e) => setAssignBoatId(e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">Select Boat</option>
                      {boats.filter((b) => !assignCaptainId || b.captain_id === assignCaptainId || !b.captain_id).map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAssign}
                    disabled={!assignCaptainId || saving}
                    className="btn-primary text-sm py-2 w-full disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Assignment'}
                  </button>
                </div>
              </div>

              <div className="border-t border-navy-200 pt-4 space-y-2">
                <h4 className="font-body font-semibold text-navy-900 text-sm mb-3">Actions</h4>
                {selectedBooking.assigned_captain_id && (
                  <button
                    onClick={() => handleNotifyCaptain(selectedBooking.id)}
                    disabled={notifying}
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-sea-50 text-sea-700 rounded-lg font-body text-sm font-medium hover:bg-sea-100 transition-colors disabled:opacity-50"
                  >
                    {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {selectedBooking.captain_notified_at ? 'Resend to Captain' : 'Send to Captain'}
                    {selectedBooking.captain_notified_at && (
                      <span className="ml-auto text-xs text-sea-500">
                        Sent {formatDateShort(selectedBooking.captain_notified_at.split('T')[0])}
                      </span>
                    )}
                  </button>
                )}
                <div className="flex gap-2">
                  {selectedBooking.booking_status !== 'completed' && selectedBooking.booking_status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                      className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-body text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                  {selectedBooking.booking_status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-body text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
