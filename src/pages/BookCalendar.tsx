/**
 * /book/calendar — Multi-step booking flow.
 *
 * 1. Boat class       (from boat_classes table, enriched with static bestFor bullets)
 * 2. Trip duration    (filtered to durations that have a pricing row for the class)
 * 3. Time slot        (6:00 AM / 12:00 PM, only for 6h trips)
 * 4. Preferred date   (any future date)
 * 5. Backup date      (any future date, different from preferred; + optional flex notes)
 * 6. Guest details
 * 7. Payment          (Stripe Payment Element — charges a 10% deposit)
 *
 * Post-payment the user lands on /book/thanks/:refCode.
 */

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Ship,
  Clock,
  Sunrise,
  Sun,
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BoatClass, TripDuration, Pricing } from '../lib/types';
import { formatCents } from '../lib/format';
import { boats } from '../content/boats';
import { getPackageBySlug } from '../content/packages';
import SEO from '../components/seo/SEO';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise: Promise<Stripe | null> = PUBLISHABLE_KEY
  ? loadStripe(PUBLISHABLE_KEY)
  : Promise.resolve(null);

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEP_LABELS: Record<Step, string> = {
  1: 'Class',
  2: 'Duration',
  3: 'Time',
  4: 'Date',
  5: 'Backup',
  6: 'Details',
  7: 'Payment',
};

interface FormState {
  classId: string;
  durationId: string;
  timeSlot: '' | '06:00' | '12:00';
  bookingDate: Date | null;
  backupDate: Date | null;
  backupDateNotes: string;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

const emptyForm: FormState = {
  classId: '',
  durationId: '',
  timeSlot: '',
  bookingDate: null,
  backupDate: null,
  backupDateNotes: '',
  partySize: 2,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
};

const tomorrow = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
};

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const classDetails = (classSlug: string) =>
  boats.find((b) => b.classSlug === classSlug);

// ---------------------------------------------------------------------------
// Outer page component
// ---------------------------------------------------------------------------

export default function BookCalendar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [durations, setDurations] = useState<TripDuration[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [paymentInitError, setPaymentInitError] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(false);

  // --- Load catalog ------------------------------------------------------
  useEffect(() => {
    async function load() {
      const [classRes, durRes, priceRes] = await Promise.all([
        supabase.from('boat_classes').select('*').order('display_order'),
        supabase.from('trip_durations').select('*').order('display_order'),
        supabase.from('pricing').select('*'),
      ]);
      if (classRes.data) setBoatClasses(classRes.data as BoatClass[]);
      if (durRes.data) setDurations(durRes.data as TripDuration[]);
      if (priceRes.data) setPricing(priceRes.data as Pricing[]);
      setCatalogReady(true);
    }
    load();
  }, []);

  // --- Resolve URL params → pre-selections -------------------------------
  useEffect(() => {
    if (!catalogReady) return;
    const pkgSlug = searchParams.get('package');
    const classSlug = searchParams.get('class');
    const durSlug = searchParams.get('duration');

    let classId = form.classId;
    let durationId = form.durationId;

    if (pkgSlug) {
      const pkg = getPackageBySlug(pkgSlug);
      if (pkg) {
        const matched = boatClasses[pkg.boatClassIndex];
        if (matched && !classId) classId = matched.id;
      }
    }
    if (classSlug && !classId) {
      const match = boatClasses.find((c) => c.slug === classSlug);
      if (match) classId = match.id;
    }
    if (durSlug && !durationId) {
      const match = durations.find((d) => d.slug === durSlug);
      if (match) durationId = match.id;
    }
    if (classId !== form.classId || durationId !== form.durationId) {
      setForm((f) => ({ ...f, classId, durationId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogReady, boatClasses, durations]);

  // --- Derived values ----------------------------------------------------
  const selectedClass = boatClasses.find((c) => c.id === form.classId);
  const selectedDuration = durations.find((d) => d.id === form.durationId);
  const selectedPricing = pricing.find(
    (p) => p.boat_class_id === form.classId && p.trip_duration_id === form.durationId,
  );

  const durationsForClass = useMemo(
    () =>
      durations.filter((d) =>
        pricing.some((p) => p.boat_class_id === form.classId && p.trip_duration_id === d.id),
      ),
    [durations, pricing, form.classId],
  );

  const needsTimeSlot = selectedDuration?.hours === 6;

  // --- Step navigation ---------------------------------------------------
  const maxReachable = computeMaxReachableStep(form, needsTimeSlot);

  const stepsSequence: Step[] = needsTimeSlot ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 4, 5, 6, 7];

  const goNext = () => {
    const i = stepsSequence.indexOf(step);
    if (i >= 0 && i < stepsSequence.length - 1) setStep(stepsSequence[i + 1]);
  };
  const goBack = () => {
    const i = stepsSequence.indexOf(step);
    if (i > 0) setStep(stepsSequence[i - 1]);
  };

  // When user leaves payment step, reset the intent so we don't leak it.
  useEffect(() => {
    if (step !== 7 && clientSecret) {
      setClientSecret(null);
      setReferenceCode(null);
      setDepositAmount(null);
      setPaymentInitError(null);
    }
  }, [step, clientSecret]);

  // When user enters payment step, create the intent.
  useEffect(() => {
    if (step !== 7 || clientSecret || initLoading) return;
    void initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function initializePayment() {
    if (!form.bookingDate || !form.backupDate) return;
    setInitLoading(true);
    setPaymentInitError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      const res = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnon}`,
          apikey: supabaseAnon,
        },
        body: JSON.stringify({
          boatClassId: form.classId,
          tripDurationId: form.durationId,
          bookingDate: toISO(form.bookingDate),
          backupDate: toISO(form.backupDate),
          backupDateNotes: form.backupDateNotes,
          timeSlot: form.timeSlot,
          partySize: form.partySize,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not start payment');
      setClientSecret(data.clientSecret);
      setReferenceCode(data.referenceCode);
      setDepositAmount(data.depositAmount);
    } catch (err) {
      setPaymentInitError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setInitLoading(false);
    }
  }

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <SEO
        title="Book Your Charter | Fish The Wahoo Charleston"
        description="Book your Charleston deep sea fishing charter. Pick your boat class, date, and pay a 10% deposit to hold your spot."
        canonicalPath="/book/calendar/"
      />

      <section className="pt-32 pb-6 bg-nautical-dark border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Online Booking</span>
          <h1 className="text-4xl md:text-5xl text-white uppercase">Book Your Charter</h1>
        </div>
      </section>

      <main className="bg-nautical-dark min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <ProgressBar current={step} sequence={stepsSequence} maxReachable={maxReachable} />

          {!catalogReady ? (
            <div className="metallic-card rounded-xl p-12 text-center mt-8">
              <Loader2 className="w-8 h-8 text-accent-orange animate-spin mx-auto" />
            </div>
          ) : (
            <div className="mt-8">
              {step === 1 && (
                <StepClass
                  boatClasses={boatClasses}
                  selected={form.classId}
                  onSelect={(id) => {
                    // Changing class might invalidate duration (6h on larger classes)
                    const stillAvailable = pricing.some(
                      (p) => p.boat_class_id === id && p.trip_duration_id === form.durationId,
                    );
                    setForm((f) => ({
                      ...f,
                      classId: id,
                      durationId: stillAvailable ? f.durationId : '',
                      timeSlot:
                        stillAvailable && durations.find((d) => d.id === f.durationId)?.hours === 6
                          ? f.timeSlot
                          : '',
                    }));
                  }}
                  onNext={goNext}
                />
              )}

              {step === 2 && (
                <StepDuration
                  durations={durationsForClass}
                  selected={form.durationId}
                  onSelect={(id) => {
                    const d = durations.find((x) => x.id === id);
                    setForm((f) => ({
                      ...f,
                      durationId: id,
                      timeSlot: d?.hours === 6 ? f.timeSlot : '',
                    }));
                  }}
                  onBack={goBack}
                  onNext={goNext}
                  className={selectedClass?.name}
                />
              )}

              {step === 3 && needsTimeSlot && (
                <StepTime
                  selected={form.timeSlot}
                  onSelect={(slot) => updateField('timeSlot', slot)}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 4 && (
                <StepDate
                  label="Select your preferred charter date"
                  helper="Pick any date you'd like. We'll work to match a boat to your date."
                  value={form.bookingDate}
                  onSelect={(d) => updateField('bookingDate', d)}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 5 && (
                <StepBackup
                  preferred={form.bookingDate}
                  value={form.backupDate}
                  notes={form.backupDateNotes}
                  onSelectDate={(d) => updateField('backupDate', d)}
                  onChangeNotes={(n) => updateField('backupDateNotes', n)}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 6 && (
                <StepGuest
                  form={form}
                  updateField={updateField}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 7 && (
                <StepPayment
                  initLoading={initLoading}
                  clientSecret={clientSecret}
                  referenceCode={referenceCode}
                  depositAmount={depositAmount}
                  paymentInitError={paymentInitError}
                  publishableKey={PUBLISHABLE_KEY}
                  onBack={goBack}
                  onRetry={() => {
                    setPaymentInitError(null);
                    void initializePayment();
                  }}
                  onSuccess={() =>
                    navigate(`/book/thanks/${referenceCode}`, { replace: true })
                  }
                />
              )}

              <SidebarSummary
                form={form}
                selectedClass={selectedClass}
                selectedDuration={selectedDuration}
                selectedPricing={selectedPricing}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function computeMaxReachableStep(f: FormState, needsTimeSlot: boolean): Step {
  if (!f.classId) return 1;
  if (!f.durationId) return 2;
  if (needsTimeSlot && !f.timeSlot) return 3;
  if (!f.bookingDate) return 4;
  if (!f.backupDate) return 5;
  if (!f.firstName || !f.lastName || !f.email) return 6;
  return 7;
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({
  current,
  sequence,
  maxReachable,
}: {
  current: Step;
  sequence: Step[];
  maxReachable: Step;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {sequence.map((s, i) => {
        const active = s === current;
        const done = sequence.indexOf(maxReachable) > i && s !== current;
        return (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                active
                  ? 'bg-accent-orange text-white'
                  : done
                    ? 'bg-nautical-blue text-slate-300 border border-white/10'
                    : 'bg-nautical-blue/50 text-slate-500 border border-white/5'
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
            </div>
            {i < sequence.length - 1 && (
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Class
// ---------------------------------------------------------------------------

function StepClass({
  boatClasses,
  selected,
  onSelect,
  onNext,
}: {
  boatClasses: BoatClass[];
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <StepCard
      title="Pick your boat class"
      helper="Every trip runs on one of three size classes. Pick whichever fits your group and budget."
    >
      <div className="grid grid-cols-1 gap-4">
        {boatClasses.map((bc) => {
          const details = classDetails(bc.slug);
          const active = selected === bc.id;
          return (
            <button
              key={bc.id}
              type="button"
              onClick={() => onSelect(bc.id)}
              className={`text-left p-5 rounded-lg border-2 transition-all ${
                active
                  ? 'border-accent-orange bg-accent-orange/10'
                  : 'border-white/10 bg-nautical-blue/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="w-4 h-4 text-accent-orange" />
                    <h3 className="text-white font-display font-bold uppercase">{bc.name}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-snug">{bc.tagline}</p>
                  {details && (
                    <p className="text-slate-500 text-xs mt-2">
                      {details.length} · Up to {details.capacity} passengers
                    </p>
                  )}
                </div>
                {active && <Check className="w-5 h-5 text-accent-orange shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
      <StepFooter
        onNext={onNext}
        canNext={!!selected}
        nextLabel="Continue"
        showBack={false}
      />
    </StepCard>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Duration
// ---------------------------------------------------------------------------

function StepDuration({
  durations,
  selected,
  onSelect,
  onBack,
  onNext,
  className,
}: {
  durations: TripDuration[];
  selected: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  className: string | undefined;
}) {
  return (
    <StepCard
      title="How long do you want to fish?"
      helper={
        className
          ? `Durations available for the ${className}.`
          : 'Pick the length of your trip.'
      }
    >
      <div className="grid grid-cols-1 gap-3">
        {durations.map((d) => {
          const active = selected === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                active
                  ? 'border-accent-orange bg-accent-orange/10'
                  : 'border-white/10 bg-nautical-blue/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-orange" />
                <div className="text-left">
                  <h3 className="text-white font-bold">{d.name}</h3>
                  <p className="text-slate-400 text-xs">{d.time_description}</p>
                </div>
              </div>
              {active && <Check className="w-5 h-5 text-accent-orange" />}
            </button>
          );
        })}
      </div>

      {durations.some((d) => d.hours === 6) && (
        <div className="mt-5 bg-nautical-blue/60 border border-accent-orange/40 rounded-sm p-4 text-sm text-slate-300 leading-relaxed">
          <span className="font-display font-bold uppercase tracking-widest text-accent-orange text-xs block mb-1">
            Heads up
          </span>
          A 6-hour day is bottom fishing only. The offshore run to the Gulf Stream isn't
          possible in that window — to target mahi, wahoo, tuna, or marlin book the 9-hour or
          12-hour trip.
        </div>
      )}

      <StepFooter onBack={onBack} onNext={onNext} canNext={!!selected} />
    </StepCard>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Time slot (6h only)
// ---------------------------------------------------------------------------

function StepTime({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: string;
  onSelect: (slot: '06:00' | '12:00') => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const options: Array<{
    value: '06:00' | '12:00';
    label: string;
    sub: string;
    Icon: typeof Sunrise;
  }> = [
    { value: '06:00', label: '6:00 AM departure', sub: 'Early-morning bite', Icon: Sunrise },
    { value: '12:00', label: '12:00 PM departure', sub: 'Afternoon half-day', Icon: Sun },
  ];

  return (
    <StepCard
      title="Pick your departure time"
      helper="Half-day trips launch at 6 AM or noon."
    >
      <div className="grid grid-cols-1 gap-3">
        {options.map((o) => {
          const active = selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                active
                  ? 'border-accent-orange bg-accent-orange/10'
                  : 'border-white/10 bg-nautical-blue/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <o.Icon className="w-5 h-5 text-accent-orange" />
                <div className="text-left">
                  <h3 className="text-white font-bold">{o.label}</h3>
                  <p className="text-slate-400 text-xs">{o.sub}</p>
                </div>
              </div>
              {active && <Check className="w-5 h-5 text-accent-orange" />}
            </button>
          );
        })}
      </div>
      <StepFooter onBack={onBack} onNext={onNext} canNext={!!selected} />
    </StepCard>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Preferred date (+ step 5 — Backup date)
// ---------------------------------------------------------------------------

function StepDate({
  label,
  helper,
  value,
  onSelect,
  onBack,
  onNext,
  disabledMatcher,
}: {
  label: string;
  helper: string;
  value: Date | null;
  onSelect: (d: Date) => void;
  onBack: () => void;
  onNext: () => void;
  disabledMatcher?: (date: Date) => boolean;
}) {
  const today = tomorrow();
  return (
    <StepCard title={label} helper={helper}>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => d && onSelect(d)}
          disabled={[
            { before: today },
            ...(disabledMatcher ? [disabledMatcher as never] : []),
          ]}
          classNames={dayPickerClasses}
          weekStartsOn={0}
        />
      </div>
      <StepFooter onBack={onBack} onNext={onNext} canNext={!!value} />
    </StepCard>
  );
}

function StepBackup({
  preferred,
  value,
  notes,
  onSelectDate,
  onChangeNotes,
  onBack,
  onNext,
}: {
  preferred: Date | null;
  value: Date | null;
  notes: string;
  onSelectDate: (d: Date) => void;
  onChangeNotes: (n: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const today = tomorrow();
  const disabledMatcher = preferred
    ? (date: Date) => date.getTime() === preferred.getTime()
    : undefined;

  return (
    <StepCard
      title="Pick a backup date"
      helper="If your preferred date isn't available, we'll try this one next. Add any extra flexibility in the notes below."
    >
      <div className="flex justify-center mb-6">
        <DayPicker
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => d && onSelectDate(d)}
          disabled={[
            { before: today },
            ...(disabledMatcher ? [disabledMatcher as never] : []),
          ]}
          classNames={dayPickerClasses}
          weekStartsOn={0}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
          Flexibility notes <span className="text-slate-600 normal-case font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className="input-field resize-none min-h-[80px]"
          placeholder="e.g. I'm in Charleston all week, any day works"
        />
      </div>
      <StepFooter onBack={onBack} onNext={onNext} canNext={!!value} />
    </StepCard>
  );
}

const dayPickerClasses: Partial<Record<string, string>> = {
  root: 'text-white',
  months: 'flex flex-col',
  month_caption: 'flex justify-center items-center py-2 font-display uppercase tracking-wider text-white',
  caption_label: 'text-white',
  nav: 'flex justify-between items-center px-2',
  button_previous: 'text-slate-400 hover:text-accent-orange p-1',
  button_next: 'text-slate-400 hover:text-accent-orange p-1',
  weekdays: 'flex',
  weekday: 'w-10 py-2 text-xs font-display font-bold uppercase text-slate-500 text-center',
  week: 'flex',
  day: 'w-10 h-10 text-sm',
  day_button:
    'w-10 h-10 rounded-md text-white hover:bg-nautical-light disabled:text-slate-700 disabled:hover:bg-transparent transition-colors',
  selected: '!bg-accent-orange !text-white',
  today: 'text-accent-gold',
};

// ---------------------------------------------------------------------------
// Step 6 — Guest details
// ---------------------------------------------------------------------------

function StepGuest({
  form,
  updateField,
  onBack,
  onNext,
}: {
  form: FormState;
  updateField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const canNext =
    !!form.firstName.trim() &&
    !!form.lastName.trim() &&
    EMAIL_RE.test(form.email) &&
    form.partySize >= 1;

  return (
    <StepCard title="Guest details" helper="We'll send your confirmation here.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First name"
          value={form.firstName}
          onChange={(v) => updateField('firstName', v)}
          required
        />
        <Input
          label="Last name"
          value={form.lastName}
          onChange={(v) => updateField('lastName', v)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => updateField('email', v)}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(v) => updateField('phone', v)}
        />
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
            Party size <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-orange" />
            <select
              value={form.partySize}
              onChange={(e) => updateField('partySize', Number(e.target.value))}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
            Special requests <span className="text-slate-600 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={form.specialRequests}
            onChange={(e) => updateField('specialRequests', e.target.value)}
            className="input-field resize-none min-h-[80px]"
            placeholder="Anything the captain should know?"
          />
        </div>
      </div>
      <StepFooter onBack={onBack} onNext={onNext} canNext={canNext} nextLabel="Continue to payment" />
    </StepCard>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        required={required}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 7 — Payment
// ---------------------------------------------------------------------------

function StepPayment({
  initLoading,
  clientSecret,
  referenceCode,
  depositAmount,
  paymentInitError,
  publishableKey,
  onBack,
  onRetry,
  onSuccess,
}: {
  initLoading: boolean;
  clientSecret: string | null;
  referenceCode: string | null;
  depositAmount: number | null;
  paymentInitError: string | null;
  publishableKey: string | undefined;
  onBack: () => void;
  onRetry: () => void;
  onSuccess: () => void;
}) {
  if (!publishableKey) {
    return (
      <StepCard title="Payment" helper="">
        <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300">
            Stripe is not configured on this site yet. Set{' '}
            <code className="font-mono text-white">VITE_STRIPE_PUBLISHABLE_KEY</code> in your{' '}
            <code className="font-mono text-white">.env</code> to continue.
          </div>
        </div>
        <StepFooter onBack={onBack} showNext={false} />
      </StepCard>
    );
  }

  if (initLoading || (!clientSecret && !paymentInitError)) {
    return (
      <StepCard title="Payment" helper="Setting up secure payment…">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
        </div>
        <StepFooter onBack={onBack} showNext={false} />
      </StepCard>
    );
  }

  if (paymentInitError) {
    return (
      <StepCard title="Payment" helper="">
        <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300">{paymentInitError}</div>
        </div>
        <StepFooter
          onBack={onBack}
          customNext={
            <button onClick={onRetry} className="btn-primary px-6 py-2.5">
              Try again
            </button>
          }
        />
      </StepCard>
    );
  }

  return (
    <StepCard
      title="Pay your deposit"
      helper={
        depositAmount != null
          ? `A ${formatCents(depositAmount)} deposit holds your date. Balance is paid to the captain on trip day.`
          : ''
      }
    >
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: clientSecret!,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#f97316',
              colorBackground: '#112240',
              colorText: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '6px',
            },
          },
        }}
      >
        <PaymentForm onBack={onBack} onSuccess={onSuccess} referenceCode={referenceCode} />
      </Elements>
    </StepCard>
  );
}

function PaymentForm({
  onBack,
  onSuccess,
  referenceCode,
}: {
  onBack: () => void;
  onSuccess: () => void;
  referenceCode: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const origin = window.location.origin;
    const { error: stripeErr } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/book/thanks/${referenceCode ?? ''}`,
      },
      redirect: 'if_required',
    });

    if (stripeErr) {
      setError(stripeErr.message ?? 'Payment failed.');
      setSubmitting(false);
      return;
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && (
        <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-outline px-5 py-2.5"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing…
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" /> Pay deposit
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Shared step scaffolding + summary sidebar
// ---------------------------------------------------------------------------

function StepCard({
  title,
  helper,
  children,
}: {
  title: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <div className="metallic-card rounded-xl p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl text-white uppercase font-display mb-2">{title}</h2>
      {helper && <p className="text-slate-400 text-sm mb-6">{helper}</p>}
      {children}
    </div>
  );
}

function StepFooter({
  onBack,
  onNext,
  canNext,
  nextLabel = 'Continue',
  showBack = true,
  showNext = true,
  customNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  customNext?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 mt-8 pt-5 border-t border-white/5">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="btn-outline px-5 py-2.5 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div />
      )}
      {customNext ??
        (showNext && onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="btn-primary ml-auto px-6 py-2.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {nextLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
    </div>
  );
}

function SidebarSummary({
  form,
  selectedClass,
  selectedDuration,
  selectedPricing,
}: {
  form: FormState;
  selectedClass: BoatClass | undefined;
  selectedDuration: TripDuration | undefined;
  selectedPricing: Pricing | undefined;
}) {
  const rows: Array<[string, string]> = [];
  if (selectedClass) rows.push(['Class', selectedClass.name]);
  if (selectedDuration) rows.push(['Duration', selectedDuration.name]);
  if (form.timeSlot) rows.push(['Departs', form.timeSlot === '06:00' ? '6:00 AM' : '12:00 PM']);
  if (form.bookingDate)
    rows.push([
      'Date',
      form.bookingDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    ]);
  if (form.backupDate)
    rows.push([
      'Backup',
      form.backupDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    ]);
  if (form.partySize)
    rows.push(['Guests', `${form.partySize} ${form.partySize === 1 ? 'guest' : 'guests'}`]);

  if (rows.length === 0) return null;

  return (
    <div className="mt-6 bg-nautical-blue/40 rounded-lg border border-white/5 p-4">
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
        <CalendarIcon className="w-3.5 h-3.5" /> Your selections
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-white text-right">{value}</dd>
          </div>
        ))}
      </dl>
      {selectedPricing && (
        <div className="mt-3 pt-3 border-t border-white/5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Trip total</span>
            <span>{formatCents(selectedPricing.total_price)}</span>
          </div>
          <div className="flex justify-between text-white font-bold">
            <span>Deposit now (10%)</span>
            <span className="text-accent-orange">{formatCents(selectedPricing.deposit_amount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
