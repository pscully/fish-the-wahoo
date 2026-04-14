import { useState } from 'react';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { BoatClass, TripDuration, Pricing, BookingFormData } from '../../lib/types';
import { formatCents } from '../../lib/format';

interface Props {
  formData: BookingFormData;
  boatClasses: BoatClass[];
  tripDurations: TripDuration[];
  selectedPricing: Pricing | null;
  onSuccess: (referenceCode: string) => void;
  onBack: () => void;
}

export default function StepPayment({
  formData,
  boatClasses,
  tripDurations,
  selectedPricing,
  onSuccess,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedClass = boatClasses.find((c) => c.id === formData.boatClassId);
  const selectedDuration = tripDurations.find((d) => d.id === formData.tripDurationId);

  const handlePayment = async () => {
    if (!selectedPricing) return;
    setLoading(true);
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
          boatClassId: formData.boatClassId,
          tripDurationId: formData.tripDurationId,
          bookingDate: formData.bookingDate ? format(formData.bookingDate, 'yyyy-MM-dd') : '',
          partySize: formData.partySize,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process payment');
      if (data.referenceCode) onSuccess(data.referenceCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-white uppercase text-center mb-2">Review & Pay Deposit</h2>
      <p className="text-slate-400 text-center mb-8">Confirm your details and pay the booking deposit</p>

      <div className="max-w-lg mx-auto">
        {/* Summary card */}
        <div className="bg-nautical-blue border border-white/10 rounded-xl overflow-hidden mb-6">
          <div className="bg-nautical-light/50 px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Booking Summary</h3>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: 'Vessel Class', value: selectedClass?.name },
              {
                label: 'Trip Duration',
                value: selectedDuration
                  ? `${selectedDuration.name} (${selectedDuration.time_description})`
                  : null,
              },
              {
                label: 'Date',
                value: formData.bookingDate
                  ? format(formData.bookingDate, 'EEEE, MMMM d, yyyy')
                  : '---',
              },
              {
                label: 'Party Size',
                value: `${formData.partySize} ${formData.partySize === 1 ? 'person' : 'people'}`,
              },
              {
                label: 'Customer',
                value: `${formData.firstName} ${formData.lastName}`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{value ?? '---'}</span>
              </div>
            ))}

            {formData.specialRequests && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-slate-500 text-xs">Special Requests</span>
                <p className="text-slate-300 text-sm mt-1">{formData.specialRequests}</p>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Full Trip Price</span>
                <span className="text-slate-300">
                  {selectedPricing ? formatCents(selectedPricing.total_price) : '---'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-white font-bold">Deposit Due Now</span>
                <span className="text-2xl font-display text-accent-orange">
                  {selectedPricing ? formatCents(selectedPricing.deposit_amount) : '---'}
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Remaining{' '}
                {selectedPricing
                  ? formatCents(selectedPricing.total_price - selectedPricing.deposit_amount)
                  : '---'}{' '}
                paid directly to your captain on trip day.
              </p>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-xl p-5 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent-orange mt-0.5 shrink-0" />
          <div>
            <p className="text-white font-bold text-sm mb-1">Secure Booking Deposit</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your deposit secures your booking and is our captain placement fee. The remaining
              trip balance is paid directly to your assigned captain on the day of your charter.
              All payments are processed securely via Stripe.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-900/50 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
          ) : (
            <>Pay Deposit {selectedPricing ? formatCents(selectedPricing.deposit_amount) : ''}</>
          )}
        </button>

        <button onClick={onBack} className="btn-ghost w-full mt-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Your Info
        </button>
      </div>
    </div>
  );
}
