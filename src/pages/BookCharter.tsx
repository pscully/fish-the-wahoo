import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ship, Calendar, User, CreditCard, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BoatClass, TripDuration, Pricing, BookingFormData, BookingStep } from '../lib/types';
import StepSelectClass from '../components/booking/StepSelectClass';
import StepSelectDetails from '../components/booking/StepSelectDetails';
import StepCustomerInfo from '../components/booking/StepCustomerInfo';
import StepPayment from '../components/booking/StepPayment';
import StepConfirmation from '../components/booking/StepConfirmation';

const steps: { key: BookingStep; label: string; icon: typeof Ship }[] = [
  { key: 'class', label: 'Select Boat', icon: Ship },
  { key: 'details', label: 'Trip Details', icon: Calendar },
  { key: 'info', label: 'Your Info', icon: User },
  { key: 'payment', label: 'Pay Deposit', icon: CreditCard },
  { key: 'confirmation', label: 'Confirmed', icon: Check },
];

export default function BookCharter() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<BookingStep>('class');
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [tripDurations, setTripDurations] = useState<TripDuration[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [referenceCode, setReferenceCode] = useState('');
  const [formData, setFormData] = useState<BookingFormData>({
    boatClassId: '',
    tripDurationId: '',
    bookingDate: null,
    timeSlot: '',
    partySize: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

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

      const classSlug = searchParams.get('class');
      if (classSlug && classRes.data) {
        const found = (classRes.data as BoatClass[]).find((c) => c.slug === classSlug);
        if (found) {
          setFormData((prev) => ({ ...prev, boatClassId: found.id }));
          setCurrentStep('details');
        }
      }
    }
    load();
  }, [searchParams]);

  const updateForm = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const selectedPricing = pricing.find(
    (p) => p.boat_class_id === formData.boatClassId && p.trip_duration_id === formData.tripDurationId
  );

  return (
    <div className="bg-navy-50 min-h-screen pt-24 pb-16">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl text-navy-900 mb-2">Book Your Charter</h1>
          <p className="text-navy-500 font-body">
            Reserve your deep sea fishing adventure in four easy steps
          </p>
        </div>

        {currentStep !== 'confirmation' && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {steps.slice(0, 4).map((step, index) => {
                const isActive = index === currentStepIndex;
                const isComplete = index < currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isComplete
                            ? 'bg-sea-600 text-white'
                            : isActive
                            ? 'bg-navy-900 text-white'
                            : 'bg-navy-200 text-navy-400'
                        }`}
                      >
                        {isComplete ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-body font-medium hidden sm:block ${
                          isActive ? 'text-navy-900' : 'text-navy-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                          index < currentStepIndex ? 'bg-sea-600' : 'bg-navy-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {currentStep === 'class' && (
            <StepSelectClass
              boatClasses={boatClasses}
              pricing={pricing}
              selectedId={formData.boatClassId}
              onSelect={(id) => {
                updateForm({ boatClassId: id });
                setCurrentStep('details');
              }}
            />
          )}
          {currentStep === 'details' && (
            <StepSelectDetails
              boatClasses={boatClasses}
              tripDurations={tripDurations}
              pricing={pricing}
              formData={formData}
              onUpdate={updateForm}
              onNext={() => setCurrentStep('info')}
              onBack={() => setCurrentStep('class')}
            />
          )}
          {currentStep === 'info' && (
            <StepCustomerInfo
              formData={formData}
              onUpdate={updateForm}
              onNext={() => setCurrentStep('payment')}
              onBack={() => setCurrentStep('details')}
            />
          )}
          {currentStep === 'payment' && (
            <StepPayment
              formData={formData}
              boatClasses={boatClasses}
              tripDurations={tripDurations}
              selectedPricing={selectedPricing || null}
              onSuccess={(refCode) => {
                setReferenceCode(refCode);
                setCurrentStep('confirmation');
              }}
              onBack={() => setCurrentStep('info')}
            />
          )}
          {currentStep === 'confirmation' && (
            <StepConfirmation
              formData={formData}
              boatClasses={boatClasses}
              tripDurations={tripDurations}
              selectedPricing={selectedPricing || null}
              referenceCode={referenceCode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
