import { Link } from 'react-router-dom';
import { CheckCircle, Copy, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { BoatClass, TripDuration, Pricing, BookingFormData } from '../../lib/types';
import { formatCents } from '../../lib/format';
import { useState } from 'react';

interface Props {
  formData: BookingFormData;
  boatClasses: BoatClass[];
  tripDurations: TripDuration[];
  selectedPricing: Pricing | null;
  referenceCode: string;
}

export default function StepConfirmation({
  formData,
  boatClasses,
  tripDurations,
  selectedPricing,
  referenceCode,
}: Props) {
  const [copied, setCopied] = useState(false);
  const selectedClass = boatClasses.find((c) => c.id === formData.boatClassId);
  const selectedDuration = tripDurations.find((d) => d.id === formData.tripDurationId);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-3xl text-navy-900 mb-2">You're All Set!</h2>
      <p className="text-navy-500 font-body mb-8">
        Your charter has been booked. We'll assign the perfect captain for your trip.
      </p>

      <div className="bg-white border border-navy-200 rounded-xl p-6 mb-6">
        <p className="text-navy-500 font-body text-sm mb-2">Your Reference Code</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl font-display text-navy-900 tracking-wide">{referenceCode}</span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-navy-100 transition-colors"
            title="Copy reference code"
          >
            <Copy className="w-5 h-5 text-navy-400" />
          </button>
        </div>
        {copied && (
          <p className="text-sea-600 font-body text-xs mb-3">Copied to clipboard!</p>
        )}
        <p className="text-navy-400 font-body text-xs">
          Save this code to check your charter status anytime
        </p>
      </div>

      <div className="bg-white border border-navy-200 rounded-xl overflow-hidden mb-8 text-left">
        <div className="bg-navy-900 px-6 py-3">
          <h3 className="text-white font-body font-semibold text-sm">Booking Details</h3>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-navy-500 font-body text-sm">Vessel Class</span>
            <span className="text-navy-900 font-body font-medium text-sm">{selectedClass?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500 font-body text-sm">Duration</span>
            <span className="text-navy-900 font-body font-medium text-sm">{selectedDuration?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500 font-body text-sm">Date</span>
            <span className="text-navy-900 font-body font-medium text-sm">
              {formData.bookingDate ? format(formData.bookingDate, 'MMMM d, yyyy') : '---'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500 font-body text-sm">Party Size</span>
            <span className="text-navy-900 font-body font-medium text-sm">{formData.partySize}</span>
          </div>
          <div className="border-t border-navy-100 pt-3">
            <div className="flex justify-between">
              <span className="text-navy-500 font-body text-sm">Deposit Paid</span>
              <span className="text-green-700 font-body font-semibold text-sm">
                {selectedPricing ? formatCents(selectedPricing.deposit_amount) : '---'}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-navy-400 font-body text-xs">Due to Captain on Trip Day</span>
              <span className="text-navy-400 font-body text-xs">
                {selectedPricing
                  ? formatCents(selectedPricing.total_price - selectedPricing.deposit_amount)
                  : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sea-50 border border-sea-200 rounded-xl p-5 mb-8 text-left">
        <h4 className="text-sea-800 font-body font-semibold text-sm mb-2">What Happens Next?</h4>
        <ol className="text-sea-700 font-body text-sm space-y-2 list-decimal list-inside">
          <li>We'll assign the ideal captain and boat for your trip</li>
          <li>You'll receive a confirmation email with all the details</li>
          <li>Pay the remaining balance directly to your captain on trip day</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/check" className="btn-primary">
          <Search className="w-4 h-4 mr-2" />
          Check Your Charter
        </Link>
        <Link to="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
