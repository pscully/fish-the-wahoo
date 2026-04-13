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

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment');
      }

      if (data.referenceCode) {
        onSuccess(data.referenceCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-navy-900 mb-2 text-center">Review & Pay Deposit</h2>
      <p className="text-navy-500 font-body text-center mb-8">
        Confirm your details and pay the booking deposit
      </p>

      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-navy-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-navy-900 px-6 py-4">
            <h3 className="text-white font-body font-semibold">Booking Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Vessel Class</span>
              <span className="text-navy-900 font-body font-medium text-sm">
                {selectedClass?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Trip Duration</span>
              <span className="text-navy-900 font-body font-medium text-sm">
                {selectedDuration?.name} ({selectedDuration?.time_description})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Date</span>
              <span className="text-navy-900 font-body font-medium text-sm">
                {formData.bookingDate
                  ? format(formData.bookingDate, 'EEEE, MMMM d, yyyy')
                  : '---'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Party Size</span>
              <span className="text-navy-900 font-body font-medium text-sm">
                {formData.partySize} {formData.partySize === 1 ? 'person' : 'people'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Customer</span>
              <span className="text-navy-900 font-body font-medium text-sm">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            {formData.specialRequests && (
              <div className="pt-2 border-t border-navy-100">
                <span className="text-navy-500 font-body text-xs">Special Requests</span>
                <p className="text-navy-700 font-body text-sm mt-1">{formData.specialRequests}</p>
              </div>
            )}

            <div className="border-t border-navy-200 pt-4 mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-500 font-body">Full Trip Price</span>
                <span className="text-navy-500 font-body">
                  {selectedPricing ? formatCents(selectedPricing.total_price) : '---'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-900 font-body font-semibold">Deposit Due Now</span>
                <span className="text-2xl font-display text-sea-700">
                  {selectedPricing ? formatCents(selectedPricing.deposit_amount) : '---'}
                </span>
              </div>
              <p className="text-navy-400 font-body text-xs mt-2">
                Remaining balance of{' '}
                {selectedPricing
                  ? formatCents(selectedPricing.total_price - selectedPricing.deposit_amount)
                  : '---'}{' '}
                is paid directly to your captain on the day of the trip.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-sea-50 border border-sea-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-sea-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sea-800 font-body font-semibold text-sm mb-1">
                Secure Booking Deposit
              </p>
              <p className="text-sea-700 font-body text-xs leading-relaxed">
                Your deposit secures your booking and is our captain placement fee. The remaining
                trip balance is paid directly to your assigned captain on the day of your charter.
                All payments are processed securely via Stripe.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 font-body text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay Deposit {selectedPricing ? formatCents(selectedPricing.deposit_amount) : ''}
            </>
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
