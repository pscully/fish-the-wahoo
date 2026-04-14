import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Ship, Calendar, Users, Anchor } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BookingWithRelations } from '../lib/types';
import { formatDate, formatCents, getStatusColor, getStatusLabel } from '../lib/format';
import SEO from '../components/seo/SEO';

export default function CheckCharter() {
  const [searchParams] = useSearchParams();
  const [lastName, setLastName] = useState('');
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookingWithRelations[] | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto-search when ?ref= is present in the URL (e.g. linked from booking confirmation)
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefCode(ref.toUpperCase());
      runSearch(undefined, ref.toUpperCase());
    }
  }, []);

  const runSearch = async (overrideLastName?: string, overrideRef?: string) => {
    const last = overrideLastName ?? lastName;
    const ref = overrideRef ?? refCode;
    if (!last.trim() && !ref.trim()) return;

    setLoading(true);
    setSearched(true);

    let query = supabase
      .from('bookings')
      .select('*, boat_classes(*), trip_durations(*), captains(*), boats(*)')
      .order('booking_date', { ascending: true });

    if (ref.trim()) {
      query = query.eq('reference_code', ref.trim().toUpperCase());
    } else {
      query = query.ilike('customer_last_name', last.trim());
    }

    const { data } = await query;
    if (data) setResults(data as BookingWithRelations[]);
    else setResults([]);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      <SEO
        title="Check Your Charter | Fish The Wahoo"
        description="Look up your Fish The Wahoo fishing charter booking. View trip details, assigned captain, and current booking status."
        canonicalPath="/check/"
      />

      <div className="bg-nautical-dark min-h-screen pt-24 pb-16">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-orange/10 border border-accent-orange/20 rounded-2xl mb-4">
              <Search className="w-8 h-8 text-accent-orange" />
            </div>
            <h1 className="text-3xl sm:text-4xl text-white uppercase mb-2">Check Your Charter</h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Look up your booking to see your trip details, assigned captain, and current status
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-12">
            <div className="metallic-card rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
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
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs uppercase">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
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
                  <Anchor className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl text-white uppercase mb-2">No Bookings Found</h3>
                  <p className="text-slate-400 text-sm">
                    We couldn't find any charters matching your search. Double-check your last
                    name or reference code and try again.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm">
                    Found {results.length} booking{results.length > 1 ? 's' : ''}
                  </p>
                  {results.map((booking) => (
                    <div key={booking.id} className="metallic-card rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">
                            {booking.reference_code}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(
                              booking.booking_status
                            )}`}
                          >
                            {getStatusLabel(booking.booking_status)}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(
                            booking.payment_status
                          )}`}
                        >
                          {getStatusLabel(booking.payment_status)}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500 text-xs uppercase tracking-widest">Date</p>
                              <p className="text-white font-medium text-sm">
                                {formatDate(booking.booking_date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Ship className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500 text-xs uppercase tracking-widest">Vessel Class</p>
                              <p className="text-white font-medium text-sm">
                                {booking.boat_classes?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Users className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500 text-xs uppercase tracking-widest">Duration & Party</p>
                              <p className="text-white font-medium text-sm">
                                {booking.trip_durations?.name} &mdash; {booking.party_size} guest
                                {booking.party_size > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Anchor className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500 text-xs uppercase tracking-widest">Captain & Boat</p>
                              <p className="text-white font-medium text-sm">
                                {booking.captains?.name && booking.boats?.name
                                  ? `Capt. ${booking.captains.name} — ${booking.boats.name}`
                                  : 'Assignment Pending'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-slate-500 text-xs">
                            Deposit: {formatCents(booking.deposit_amount)}
                          </span>
                          <span className="text-slate-500 text-xs">
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
    </>
  );
}
