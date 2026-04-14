import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { ArrowLeft, ArrowRight, Clock, Users, Minus, Plus } from 'lucide-react';
import type { BoatClass, TripDuration, Pricing, BookingFormData } from '../../lib/types';
import { formatCents } from '../../lib/format';
import 'react-day-picker/dist/style.css';

interface Props {
  boatClasses: BoatClass[];
  tripDurations: TripDuration[];
  pricing: Pricing[];
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepSelectDetails({
  boatClasses,
  tripDurations,
  pricing,
  formData,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [error, setError] = useState('');
  const selectedClass = boatClasses.find((c) => c.id === formData.boatClassId);

  const getPrice = (durationId: string) =>
    pricing.find(
      (p) => p.boat_class_id === formData.boatClassId && p.trip_duration_id === durationId
    );

  const handleNext = () => {
    if (!formData.tripDurationId) { setError('Please select a trip duration.'); return; }
    if (!formData.bookingDate) { setError('Please select a date.'); return; }
    setError('');
    onNext();
  };

  const disabledDays = { before: addDays(new Date(), 2) };

  return (
    <div>
      <h2 className="text-2xl text-white uppercase text-center mb-2">Choose Trip Details</h2>
      <p className="text-slate-400 text-center mb-8">
        {selectedClass?.name} — select your duration, date, and party size
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              Trip Duration
            </label>
            <div className="space-y-3">
              {tripDurations.map((td) => {
                const price = getPrice(td.id);
                const isSelected = formData.tripDurationId === td.id;
                return (
                  <button
                    key={td.id}
                    onClick={() => onUpdate({ tripDurationId: td.id })}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-accent-orange bg-accent-orange/10'
                        : 'border-white/10 bg-nautical-blue hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${isSelected ? 'text-accent-orange' : 'text-slate-500'}`} />
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? 'text-accent-orange' : 'text-white'}`}>
                          {td.name}
                        </p>
                        <p className="text-slate-500 text-xs">{td.time_description}</p>
                      </div>
                    </div>
                    {price && (
                      <div className="text-right">
                        <p className="font-display text-lg text-white">
                          {formatCents(price.deposit_amount)}
                        </p>
                        <p className="text-slate-500 text-xs">deposit</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Party size */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              <Users className="w-4 h-4 inline mr-1" />
              Party Size
            </label>
            <div className="flex items-center gap-4 bg-nautical-blue border border-white/10 rounded-xl p-4">
              <button
                onClick={() => onUpdate({ partySize: Math.max(1, formData.partySize - 1) })}
                className="w-10 h-10 rounded-lg bg-nautical-light flex items-center justify-center hover:bg-nautical-light/80 transition-colors"
              >
                <Minus className="w-4 h-4 text-slate-300" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-display text-white">{formData.partySize}</span>
                <p className="text-slate-500 text-xs">
                  {formData.partySize === 1 ? 'person' : 'people'}
                </p>
              </div>
              <button
                onClick={() =>
                  onUpdate({
                    partySize: Math.min(selectedClass?.max_passengers || 6, formData.partySize + 1),
                  })
                }
                className="w-10 h-10 rounded-lg bg-nautical-light flex items-center justify-center hover:bg-nautical-light/80 transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-300" />
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Max {selectedClass?.max_passengers} passengers for this vessel class
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
            Select Date
          </label>
          <div className="bg-nautical-blue border border-white/10 rounded-xl p-4 flex justify-center">
            <DayPicker
              mode="single"
              selected={formData.bookingDate || undefined}
              onSelect={(date) => onUpdate({ bookingDate: date || null })}
              disabled={disabledDays}
              fromMonth={new Date()}
              numberOfMonths={1}
            />
          </div>
          {formData.bookingDate && (
            <p className="text-accent-orange text-sm mt-2 text-center font-bold">
              {format(formData.bookingDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button onClick={handleNext} className="btn-primary">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
