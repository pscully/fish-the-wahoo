import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', honeypot: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: fnError } = await supabase.functions.invoke('contact-submit', { body: form });
    setSubmitting(false);
    if (fnError) {
      setError(fnError.message || 'Could not send message. Please try again or call (843) 312-2981.');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl text-white uppercase mb-4">Message Sent!</h3>
        <p className="text-slate-400">We'll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-xl text-white uppercase mb-8">Send a Message</h3>
      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 rounded text-red-200 text-sm">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
          className="sr-only absolute -left-[9999px] -top-[9999px]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Message</label>
          <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
