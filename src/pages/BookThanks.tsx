import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, Star, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BookingWithRelations } from '../lib/types';
import { formatCents } from '../lib/format';
import SEO from '../components/seo/SEO';

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_ATTEMPTS = 15; // ≈ 30 s

type Status = 'polling' | 'confirmed' | 'stuck' | 'not-found';

function formatFullDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTimeSlot(slot: string): string {
  if (slot === '06:00') return '6:00 AM departure';
  if (slot === '12:00') return '12:00 PM departure';
  return '';
}

export default function BookThanks() {
  const { refCode } = useParams<{ refCode: string }>();
  const [status, setStatus] = useState<Status>('polling');
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!refCode) {
      setStatus('not-found');
      return;
    }

    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      attemptsRef.current += 1;

      const { data } = await supabase
        .from('bookings')
        .select('*, boat_classes(*), trip_durations(*), captains(*), boats(*)')
        .eq('reference_code', refCode!.toUpperCase())
        .maybeSingle();

      if (cancelled) return;

      if (!data) {
        if (attemptsRef.current >= 3) {
          setStatus('not-found');
          return;
        }
      } else {
        setBooking(data as BookingWithRelations);
        if (data.payment_status === 'paid') {
          setStatus('confirmed');
          return;
        }
      }

      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        setStatus('stuck');
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [refCode]);

  const gbpReviewUrl = import.meta.env.VITE_GBP_REVIEW_URL as string | undefined;

  return (
    <>
      <SEO
        title="Booking Confirmed | Fish The Wahoo"
        description="Your Fish The Wahoo fishing charter is booked. Your captain will reach out shortly with next steps."
        canonicalPath={`/book/thanks/${refCode ?? ''}/`}
      />

      <section className="min-h-screen bg-nautical-dark pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {status === 'polling' && (
            <div className="metallic-card rounded-xl p-12 text-center">
              <Loader2 className="w-14 h-14 text-accent-orange mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl text-white uppercase mb-3">Processing your payment…</h1>
              <p className="text-slate-400">
                Hang tight — we're confirming your deposit and setting up your booking.
              </p>
            </div>
          )}

          {status === 'not-found' && (
            <div className="metallic-card rounded-xl p-12 text-center">
              <h1 className="text-2xl text-white uppercase mb-3">Booking not found</h1>
              <p className="text-slate-400 mb-8">
                We couldn't find a booking with reference <span className="font-mono">{refCode}</span>.
                If you just paid, it may still be processing.
              </p>
              <Link to="/book" className="btn-primary inline-block px-8 py-3">
                Start a new booking
              </Link>
            </div>
          )}

          {status === 'stuck' && (
            <div className="metallic-card rounded-xl p-12 text-center">
              <Clock className="w-14 h-14 text-accent-orange mx-auto mb-6" />
              <h1 className="text-2xl text-white uppercase mb-3">Payment is processing</h1>
              <p className="text-slate-400 mb-4">
                Your booking is recorded but the payment confirmation is taking a moment to catch
                up. You'll receive a confirmation email shortly.
              </p>
              <p className="text-slate-500 text-sm mb-8">
                Reference code:{' '}
                <span className="font-mono text-white font-bold">{refCode}</span>
              </p>
              <Link to={`/check?ref=${refCode}`} className="btn-outline inline-block px-8 py-3">
                View my booking
              </Link>
            </div>
          )}

          {status === 'confirmed' && booking && (
            <div className="metallic-card rounded-xl p-10">
              <div className="text-center mb-10">
                <CheckCircle className="w-16 h-16 text-accent-orange mx-auto mb-5" />
                <h1 className="text-3xl text-white uppercase mb-3">Booking confirmed</h1>
                <p className="text-slate-400">
                  Reference code{' '}
                  <span className="font-mono text-accent-orange font-bold tracking-widest">
                    {booking.reference_code}
                  </span>
                </p>
              </div>

              <div className="bg-nautical-blue/60 rounded-lg p-6 border border-white/10 mb-8">
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Trip details
                </h2>
                <dl className="space-y-2.5 text-sm">
                  <Row label="Vessel class" value={booking.boat_classes?.name} />
                  <Row
                    label="Duration"
                    value={[
                      booking.trip_durations?.name,
                      formatTimeSlot(booking.time_slot),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  />
                  <Row label="Preferred date" value={formatFullDate(booking.booking_date)} />
                  {booking.backup_date && (
                    <Row label="Backup date" value={formatFullDate(booking.backup_date)} />
                  )}
                  {booking.backup_date_notes && (
                    <Row label="Flex notes" value={booking.backup_date_notes} />
                  )}
                  <Row label="Party size" value={String(booking.party_size)} />
                  <Row
                    label="Deposit paid"
                    value={formatCents(booking.deposit_amount)}
                    highlight
                  />
                </dl>
              </div>

              <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-5 mb-8">
                <p className="text-white leading-relaxed">
                  <span className="text-accent-orange font-bold uppercase tracking-widest text-xs block mb-2">
                    What happens next
                  </span>
                  Your captain will reach out shortly to confirm your dates and provide next steps
                  and trip preparation details. A confirmation email is also on its way to{' '}
                  <span className="text-white font-semibold">{booking.customer_email}</span>.
                </p>
              </div>

              {gbpReviewUrl && (
                <div className="text-center mb-6">
                  <p className="text-slate-300 mb-4">Care to leave us a review?</p>
                  <a
                    href={gbpReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 px-8 py-3"
                  >
                    <Star className="w-4 h-4" />
                    Leave a Google review
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-white/10">
                <Link
                  to={`/check?ref=${booking.reference_code}`}
                  className="btn-outline px-6 py-2.5 text-center"
                >
                  View my booking
                </Link>
                <Link to="/" className="btn-outline px-6 py-2.5 text-center">
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | undefined;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd
        className={`text-right ${highlight ? 'text-accent-orange font-bold' : 'text-white'}`}
      >
        {value}
      </dd>
    </div>
  );
}
