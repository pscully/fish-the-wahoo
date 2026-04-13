import { useState } from 'react';
import { Search, Loader2, Ship, Calendar, Users, Anchor } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BookingWithRelations } from '../lib/types';
import { formatDate, formatCents, getStatusColor, getStatusLabel } from '../lib/format';

export default function CheckCharter() {
  const [lastName, setLastName] = useState('');
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookingWithRelations[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName.trim() && !refCode.trim()) return;
    setLoading(true);
    setSearched(true);

    let query = supabase
      .from('bookings')
      .select('*, boat_classes(*), trip_durations(*), captains(*), boats(*)')
      .order('booking_date', { ascending: true });

    if (refCode.trim()) {
      query = query.eq('reference_code', refCode.trim().toUpperCase());
    } else {
      query = query.ilike('customer_last_name', lastName.trim());
    }

    const { data } = await query;

    if (data) {
      setResults(data as BookingWithRelations[]);
    } else {
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-navy-50 min-h-screen pt-24 pb-16">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sea-100 rounded-2xl mb-4">
            <Search className="w-8 h-8 text-sea-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-navy-900 mb-2">Check Your Charter</h1>
          <p className="text-navy-500 font-body max-w-md mx-auto">
            Look up your booking to see your trip details, assigned captain, and current status
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-12">
          <div className="bg-white rounded-xl border border-navy-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-body font-semibold text-navy-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-field"
                placeholder="Enter your last name"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-navy-200" />
              <span className="text-navy-400 font-body text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-navy-200" />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-navy-700 mb-1">
                Reference Code
              </label>
              <input
                type="text"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="input-field uppercase"
                placeholder="e.g. FTW-A1B2C3"
              />
            </div>
            <button
              type="submit"
              disabled={loading || (!lastName.trim() && !refCode.trim())}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find My Charter
                </>
              )}
            </button>
          </div>
        </form>

        {searched && results !== null && (
          <div className="max-w-2xl mx-auto">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Anchor className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                <h3 className="text-xl text-navy-900 mb-2">No Bookings Found</h3>
                <p className="text-navy-500 font-body text-sm">
                  We couldn't find any charters matching your search. Double-check your last
                  name or reference code and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-navy-500 font-body text-sm">
                  Found {results.length} booking{results.length > 1 ? 's' : ''}
                </p>
                {results.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl border border-navy-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-3 bg-navy-50 border-b border-navy-200">
                      <div className="flex items-center gap-3">
                        <span className="font-body font-semibold text-navy-900 text-sm">
                          {booking.reference_code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-semibold ${getStatusColor(booking.booking_status)}`}>
                          {getStatusLabel(booking.booking_status)}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-semibold ${getStatusColor(booking.payment_status)}`}>
                        {getStatusLabel(booking.payment_status)}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-sea-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-navy-400 font-body text-xs">Date</p>
                            <p className="text-navy-900 font-body font-medium text-sm">
                              {formatDate(booking.booking_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Ship className="w-4 h-4 text-sea-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-navy-400 font-body text-xs">Vessel Class</p>
                            <p className="text-navy-900 font-body font-medium text-sm">
                              {booking.boat_classes?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-sea-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-navy-400 font-body text-xs">Duration & Party</p>
                            <p className="text-navy-900 font-body font-medium text-sm">
                              {booking.trip_durations?.name} -- {booking.party_size} guest{booking.party_size > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Anchor className="w-4 h-4 text-sea-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-navy-400 font-body text-xs">Captain & Boat</p>
                            <p className="text-navy-900 font-body font-medium text-sm">
                              {booking.captains?.name && booking.boats?.name
                                ? `Capt. ${booking.captains.name} - ${booking.boats.name}`
                                : 'Assignment Pending'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-navy-100 flex items-center justify-between">
                        <span className="text-navy-400 font-body text-xs">
                          Deposit: {formatCents(booking.deposit_amount)}
                        </span>
                        <span className="text-navy-400 font-body text-xs">
                          Booked: {formatDate(booking.created_at.split('T')[0])}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
