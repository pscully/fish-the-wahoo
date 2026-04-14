import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import SEO from '../components/seo/SEO';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <SEO
        title="Contact Fish The Wahoo | Charleston Fishing Charters"
        description="Contact Fish The Wahoo deep sea fishing charters in Charleston, SC. Call (843) 568-3222 or send us a message."
        canonicalPath="/contact/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Get In Touch</span>
          <h1 className="text-5xl text-white uppercase mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-accent-orange" />
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="space-y-8 mb-12">
                {[
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: '(843) 568-3222',
                    href: 'tel:8435683222',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'info@fishthewahoo.com',
                    href: 'mailto:info@fishthewahoo.com',
                  },
                  {
                    icon: MapPin,
                    label: 'Location',
                    value: 'Shem Creek Marina\nMount Pleasant, SC 29464',
                    href: null,
                  },
                  {
                    icon: Clock,
                    label: 'Hours',
                    value: 'Daily 6am — 8pm\nAfter hours for emergencies',
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-orange/10 border border-accent-orange/20 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent-orange" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-slate-200 hover:text-accent-orange transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-slate-200 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="aspect-video rounded-xl overflow-hidden bg-nautical-blue border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.123456789!2d-79.877!3d32.784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDQ3JzAyLjQiTiA3OcKwNTInMzMuMiJX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Fish The Wahoo location"
                />
              </div>
            </div>

            <div className="metallic-card rounded-xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-white uppercase mb-4">Message Sent!</h3>
                  <p className="text-slate-400">
                    We'll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl text-white uppercase mb-8">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-field resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4">
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
