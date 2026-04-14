/**
 * Charter Booking Calendar — P5
 * Route: /book/calendar
 * URL params: ?class=<boat-class-slug>, ?duration=<duration-slug>, ?package=<package-slug>
 *
 * Self-contained booking flow: calendar → guest details → deposit payment.
 * Uses the same create-payment-intent edge function as the existing wizard.
 */

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isBefore,
  startOfDay,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Shield, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BoatClass, TripDuration, Pricing } from '../lib/types';
import { formatCents } from '../lib/format';
import { getPackageBySlug } from '../content/packages';
import SEO from '../components/seo/SEO';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BookCalendar() {
  const [searchParams] = useSearchParams();

  // ---- Catalog data ----
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [tripDurations, setTripDurations] = useState<TripDuration[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);

  // ---- Selections ----
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDurationId, setSelectedDurationId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ---- Availability ----
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingAvail, setLoadingAvail] = useState(false);

  // ---- Form ----
  const [form, setForm] = useState<FormState>({
    partySize: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // ---- Submit state ----
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [referenceCode, setReferenceCode] = useState('');

  // ---- Load catalog ----
  useEffect(() => {
    async function load() {
      const [classRes, durRes, priceRes] = await Promise.all([
        supabase.from('boat_classes').select('*').order('display_order'),
        supabase.from('trip_durations').select('*').order('display_order'),
        supabase.from('pricing').select('*'),
      ]);
      if (classRes.data) setBoatClasses(classRes.data as BoatClass[]);
      if (durRes.data) setTripDurations(durRes.data as TripDuration[]);
      if (priceRes.data) setPricing(priceRes.data as Pricing[]);
    }
    load();
  }, []);

  // ---- Resolve URL params into selections ----
  useEffect(() => {
    if (!boatClasses.length || !tripDurations.length) return;

    const packageSlug = searchParams.get('package');
    const classSlug = searchParams.get('class');
    const durationSlug = searchParams.get('duration');

    // Package slug → derive class and duration
    if (packageSlug) {
      const pkg = getPackageBySlug(packageSlug);
      if (pkg) {
        const matchedClass = boatClasses[pkg.boatClassIndex];
        if (matchedClass && !selectedClassId) setSelectedClassId(matchedClass.id);
      }
    }

    if (classSlug && !selectedClassId) {
      const found = boatClasses.find((c) => c.slug === classSlug);
      if (found) setSelectedClassId(found.id);
    }

    if (durationSlug && !selectedDurationId) {
      const found = tripDurations.find((d) => d.slug === durationSlug);
      if (found) setSelectedDurationId(found.id);
    }

    // Default to first options if nothing specified
    if (!selectedClassId && boatClasses.length) setSelectedClassId(boatClasses[0].id);
    if (!selectedDurationId && tripDurations.length) setSelectedDurationId(tripDurations[0].id);
  }, [boatClasses, tripDurations, searchParams]);

  // ---- Load availability for current month ----
  useEffect(() => {
    if (!selectedClassId) return;
    setLoadingAvail(true);

    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    supabase
      .from('captain_availability')
      .select('date, boats!inner(boat_class_id)')
      .eq('is_available', true)
      .gte('date', start)
      .lte('date', end)
      .then(({ data }) => {
        if (data) {
          const rows = data as Array<{ date: string; boats: unknown }>;
          const available = new Set(
            rows
              .filter((row) => {
                const boats = row.boats as { boat_class_id: string } | null;
                return boats?.boat_class_id === selectedClassId;
              })
              .map((row) => row.date)
          );
          setAvailableDates(available);
        }
        setLoadingAvail(false);
      });
  }, [selectedClassId, currentMonth]);

  // ---- Derived data ----
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth]);

  const firstDayOffset = getDay(startOfMonth(currentMonth));
  const today = startOfDay(new Date());

  const selectedPricing = pricing.find(
    (p) => p.boat_class_id === selectedClassId && p.trip_duration_id === selectedDurationId
  );

  const selectedClass = boatClasses.find((c) => c.id === selectedClassId);
  const selectedDuration = tripDurations.find((d) => d.id === selectedDurationId);

  // ---- Payment submit ----
  const handleConfirm = async () => {
    if (!selectedDate || !selectedPricing || !form.firstName || !form.lastName || !form.email) {
      setError('Please fill in all required fields and select a date.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          boatClassId: selectedClassId,
          tripDurationId: selectedDurationId,
          bookingDate: format(selectedDate, 'yyyy-MM-dd'),
          partySize: form.partySize,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed. Please try again.');
      if (data.referenceCode) setReferenceCode(data.referenceCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Confirmation screen ----
  if (referenceCode) {
    return (
      <div className="min-h-screen bg-nautical-dark flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-lg w-full text-center">
          <CheckCircle className="w-20 h-20 text-accent-orange mx-auto mb-6" />
          <h1 className="text-4xl text-white uppercase mb-4">Booking Confirmed</h1>
          <p className="text-slate-400 mb-2">Your reference code is:</p>
          <p className="text-3xl font-display font-bold text-accent-orange mb-8 tracking-widest">
            {referenceCode}
          </p>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            A confirmation email is on its way to {form.email}. We'll be in touch within 24 hours
            to confirm your captain assignment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/check?ref=${referenceCode}`} className="btn-primary px-8 py-3">
              View My Booking
            </Link>
            <Link to="/" className="btn-outline px-8 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Book Your Charter | Fish The Wahoo Charleston"
        description="Choose your date, pick your trip type, and book your deep sea fishing charter out of Charleston, SC. Deposit secures your spot."
        canonicalPath="/book/calendar/"
      />

      {/* Page header */}
      <section className="pt-32 pb-6 bg-nautical-dark border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Online Booking</span>
          <h1 className="text-4xl md:text-5xl text-white uppercase">Book Your Charter</h1>
        </div>
      </section>

      <main className="bg-nautical-dark min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trip selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                Vessel Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedDate(null);
                }}
                className="input-field"
              >
                {boatClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                Trip Duration
              </label>
              <select
                value={selectedDurationId}
                onChange={(e) => setSelectedDurationId(e.target.value)}
                className="input-field"
              >
                {tripDurations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.time_description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* ---- LEFT COLUMN ---- */}
            <div className="flex-grow space-y-10">
              {/* Calendar */}
              <section>
                <h2 className="text-2xl font-display uppercase tracking-wide text-white mb-6">
                  Select Your Charter Date
                </h2>
                <div className="bg-nautical-blue/80 backdrop-blur-sm p-6 rounded-sm border border-white/10 shadow-xl">
                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => { setCurrentMonth(subMonths(currentMonth, 1)); setSelectedDate(null); }}
                      className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-display uppercase tracking-wider font-bold text-white">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <button
                      onClick={() => { setCurrentMonth(addMonths(currentMonth, 1)); setSelectedDate(null); }}
                      className="text-white hover:text-accent-orange transition-colors p-1"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div
                        key={d}
                        className="py-2 text-xs font-display font-bold uppercase tracking-wide text-slate-400"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Empty offset cells */}
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <div key={`empty-${i}`} className="py-3" />
                    ))}

                    {days.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isPast = isBefore(day, today);
                      const isAvailable = availableDates.has(dateStr);
                      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

                      if (isSelected) {
                        return (
                          <button
                            key={dateStr}
                            className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-accent-orange text-white font-display font-bold text-sm"
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      }

                      if (isPast || !isAvailable) {
                        return (
                          <div
                            key={dateStr}
                            className="py-3 text-slate-600 cursor-not-allowed text-sm select-none"
                          >
                            {format(day, 'd')}
                          </div>
                        );
                      }

                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(day)}
                          className="py-3 text-white text-sm rounded-sm bg-nautical-light/60 hover:bg-nautical-light transition-colors"
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>

                  {loadingAvail && (
                    <p className="text-center text-slate-500 text-xs mt-4 flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading availability...
                    </p>
                  )}

                  {!loadingAvail && availableDates.size === 0 && (
                    <p className="text-center text-slate-500 text-xs mt-4">
                      No availability this month. Try the next month or call us at (843) 568-3222.
                    </p>
                  )}

                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-sm bg-nautical-light/60 inline-block" />
                      Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-accent-orange inline-block" />
                      Selected
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-sm bg-white/10 inline-block opacity-40" />
                      Unavailable
                    </span>
                  </div>
                </div>
              </section>

              {/* Guest & Contact form */}
              <section>
                <h2 className="text-2xl font-display uppercase tracking-wide text-white mb-6">
                  Guest &amp; Contact Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Col 1 */}
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <select
                          value={form.partySize}
                          onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
                          className="input-field appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field"
                        placeholder="Email Address *"
                        required
                      />
                    </div>
                    {/* Col 2 */}
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="input-field"
                        placeholder="First Name *"
                        required
                      />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field"
                        placeholder="Phone Number"
                      />
                    </div>
                    {/* Col 3 */}
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="input-field"
                        placeholder="Last Name *"
                        required
                      />
                      <textarea
                        value={form.specialRequests}
                        onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                        className="input-field resize-none min-h-[100px]"
                        placeholder="Special Requests"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={submitting || !selectedDate}
                    className="btn-primary w-full py-4 text-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                    ) : selectedPricing ? (
                      `Confirm Booking — Pay ${formatCents(selectedPricing.deposit_amount)} Deposit`
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </section>
            </div>

            {/* ---- RIGHT SIDEBAR ---- */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-nautical-blue/80 border border-accent-orange rounded-sm p-6 shadow-xl sticky top-24">
                <h2 className="text-xl font-display uppercase tracking-wide text-white mb-6 border-b border-white/10 pb-4">
                  Booking Summary
                </h2>
                <div className="space-y-4 text-sm">
                  <SummaryRow
                    label="Date"
                    value={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'}
                    highlight={!selectedDate}
                  />
                  <SummaryRow label="Vessel" value={selectedClass?.name ?? '—'} />
                  <SummaryRow
                    label="Duration"
                    value={
                      selectedDuration
                        ? `${selectedDuration.name} (${selectedDuration.time_description})`
                        : '—'
                    }
                  />
                  <SummaryRow label="Guests" value={`${form.partySize} guest${form.partySize !== 1 ? 's' : ''}`} />
                </div>

                {selectedPricing && (
                  <>
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-400">
                        <span>Full Trip Price</span>
                        <span>{formatCents(selectedPricing.total_price)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-base">
                        <span>Deposit Due Now</span>
                        <span className="text-accent-orange text-xl font-display">
                          {formatCents(selectedPricing.deposit_amount)}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-4 leading-relaxed">
                      Remaining {formatCents(selectedPricing.total_price - selectedPricing.deposit_amount)} paid directly to your captain on trip day.
                    </p>
                  </>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Payments secured by Stripe. Your deposit holds the date; balance goes to
                    your captain.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="font-display font-bold text-slate-400 uppercase tracking-wide text-xs w-20 shrink-0">
        {label}:
      </span>
      <span className={`text-right leading-snug ${highlight ? 'text-slate-500 italic' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
