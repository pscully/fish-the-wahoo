import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BookingFormData } from '../../lib/types';

interface Props {
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LABEL = 'block text-xs font-bold text-white/40 uppercase tracking-widest mb-2';

export default function StepCustomerInfo({ formData, onUpdate, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <h2 className="text-2xl text-white uppercase text-center mb-2">Your Information</h2>
      <p className="text-slate-400 text-center mb-8">Tell us who we are booking for</p>

      <div className="max-w-lg mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              className="input-field"
              placeholder="John"
            />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className={LABEL}>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              className="input-field"
              placeholder="Smith"
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className={LABEL}>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="input-field"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className={LABEL}>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="input-field"
            placeholder="(843) 555-0123"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className={LABEL}>
            Special Requests{' '}
            <span className="text-slate-600 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => onUpdate({ specialRequests: e.target.value })}
            className="input-field min-h-[100px] resize-y"
            placeholder="Any dietary needs, accessibility requirements, special occasions..."
          />
        </div>
      </div>

      <div className="flex justify-between mt-8 max-w-lg mx-auto">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button onClick={() => { if (validate()) onNext(); }} className="btn-primary">
          Review & Pay
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
