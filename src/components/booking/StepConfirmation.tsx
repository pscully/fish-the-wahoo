import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Copy, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { BoatClass, TripDuration, Pricing, BookingFormData } from '../../lib/types';
import { formatCents } from '../../lib/format';

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
      <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-orange rounded-full mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl text-white uppercase mb-2">You're All Set!</h2>
      <p className="text-slate-400 mb-8">
        Your charter has been booked. We'll assign the perfect captain for your trip.
      </p>

      {/* Reference code */}
      <div className="bg-nautical-blue border border-white/10 rounded-xl p-6 mb-6">
        <p className="text-slate-400 text-sm mb-2">Your Reference Code</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl font-display text-accent-orange tracking-widest">
            {referenceCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Copy reference code"
          >
            <Copy className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        {copied && <p className="text-accent-orange text-xs mb-2">Copied to clipboard!</p>}
        <p className="text-slate-500 text-xs">Save this code to check your charter status anytime</p>
      </div>

      {/* Booking details */}
      <div className="bg-nautical-blue border border-white/10 rounded-xl overflow-hidden mb-6 text-left">
        <div className="bg-nautical-light/50 px-6 py-3 border-b border-white/10">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Booking Details</h3>
        </div>
        <div className="p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Vessel Class</span>
            <span className="text-white font-medium">{selectedClass?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duration</span>
            <span className="text-white font-medium">{selectedDuration?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date</span>
            <span className="text-white font-medium">
              {formData.bookingDate ? format(formData.bookingDate, 'MMMM d, yyyy') : '---'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Party Size</span>
            <span className="text-white font-medium">{formData.partySize}</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit Paid</span>
              <span className="text-green-400 font-bold">
                {selectedPricing ? formatCents(selectedPricing.deposit_amount) : '---'}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-500 text-xs">Due to Captain on Trip Day</span>
              <span className="text-slate-500 text-xs">
                {selectedPricing
                  ? formatCents(selectedPricing.total_price - selectedPricing.deposit_amount)
                  : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-xl p-5 mb-8 text-left">
        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3">What Happens Next</h4>
        <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
          <li>We'll assign the ideal captain and boat for your trip</li>
          <li>You'll receive a confirmation email with all the details</li>
          <li>Pay the remaining balance directly to your captain on trip day</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/check?ref=${referenceCode}`} className="btn-primary">
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
