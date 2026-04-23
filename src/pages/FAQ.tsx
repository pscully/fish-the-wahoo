import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

const faqs = [
  {
    category: 'Booking & Payment',
    questions: [
      {
        q: 'How does the booking process work?',
        a: 'Select your boat class, pick a date and duration, enter your information, and pay a small deposit to secure your spot. We then match you with the ideal captain and boat for your trip. The remaining balance is paid directly to your captain on the day of the charter.',
      },
      {
        q: 'How much is the deposit?',
        a: 'Deposits vary by boat class and trip duration, typically ranging from $500 to $900. This deposit is our captain placement fee and secures your reservation. The full charter price minus your deposit is paid directly to your captain.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made more than 7 days prior to the trip date receive a full deposit refund. Cancellations within 7 days are subject to a 50% deposit retention. Weather-related cancellations receive a full refund or reschedule at no cost.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) for the booking deposit. The remaining balance paid to the captain on trip day can typically be paid via credit card, cash, or check — confirm with your assigned captain.',
      },
    ],
  },
  {
    category: 'The Trip',
    questions: [
      {
        q: 'What are the trip duration options?',
        a: 'We offer trips ranging from 4-hour family trips to 12-hour full-day offshore adventures and overnight Gulf Stream expeditions. Longer trips allow you to venture further offshore for bigger game fish.',
      },
      {
        q: 'What fish will we catch?',
        a: 'Charleston offers incredible offshore fishing year-round. Common catches include mahi-mahi, wahoo, king mackerel, cobia, and various tuna species. On full-day trips, you may target marlin, sailfish, and swordfish. Nearshore trips typically yield snapper, grouper, sea bass, and triggerfish.',
      },
      {
        q: 'What should I bring?',
        a: 'Bring sunscreen (SPF 50+), sunglasses, a hat, non-marking shoes or sandals, a light jacket or rain gear, any personal snacks or drinks, and a cooler for your catch. All fishing tackle, bait, licenses, and ice are provided.',
      },
      {
        q: 'Can I bring my own food and drinks?',
        a: 'Yes. Most boats have coolers and refrigerators. Bring whatever food and beverages you like. Alcohol is permitted but please drink responsibly — the open ocean is not the place for overindulgence.',
      },
      {
        q: 'Is there a restroom on the boat?',
        a: 'All of our sportfishing vessels have enclosed, air-conditioned cabins with private restrooms.',
      },
    ],
  },
  {
    category: 'Captains & Boats',
    questions: [
      {
        q: 'How do you select my captain?',
        a: "We match your party with a captain based on the boat class you selected, the captain's availability, their expertise with your target species, and the conditions expected for your trip date. Our network includes 15+ experienced offshore captains.",
      },
      {
        q: 'Can I request a specific captain?',
        a: "If you have a preference, note it in the special requests field during booking and we will do our best to accommodate. Availability is not guaranteed for specific captain requests.",
      },
      {
        q: 'What size groups can you accommodate?',
        a: 'Our 48-50 foot and 53-59 foot sportfishers accommodate up to 6 passengers. Our larger vessels can take up to 12 passengers, making them perfect for corporate outings or large groups.',
      },
      {
        q: 'Are the boats safe?',
        a: 'All vessels in our network are maintained to the highest standards, carry all required safety equipment, and are operated by licensed, experienced captains.',
      },
    ],
  },
  {
    category: 'Weather & Conditions',
    questions: [
      {
        q: 'What happens if the weather is bad?',
        a: "Your captain makes the final call on whether conditions are safe to fish. If the trip is cancelled due to weather, you receive a full deposit refund or can reschedule at no additional cost.",
      },
      {
        q: 'What if I get seasick?',
        a: "We recommend taking motion sickness medication (such as Bonine or Dramamine) the evening before and morning of your trip, even if you don't typically get seasick. Our larger vessels provide a much smoother ride that helps minimize motion discomfort.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-5 text-left group"
      >
        <span className="text-white font-semibold pr-8 group-hover:text-accent-orange transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${
            open ? 'rotate-180 text-accent-orange' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ | Fish The Wahoo Charleston Fishing Charters"
        description="Frequently asked questions about booking a deep sea fishing charter with Fish The Wahoo in Charleston, SC."
        canonicalPath="/faq/"
      />

      <section className="relative pt-40 pb-16 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-12 h-12 text-accent-orange mx-auto mb-6" />
          <h1 className="text-5xl text-white uppercase mb-6">
            Frequently Asked Questions
          </h1>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-lg mx-auto">
            Everything you need to know about booking and enjoying your Charleston deep sea
            fishing charter
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl text-accent-orange uppercase tracking-widest font-bold mb-4">
                  {section.category}
                </h2>
                <div className="metallic-card rounded-xl px-8">
                  {section.questions.map((item) => (
                    <FAQItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-nautical-blue rounded-xl p-8 text-center border border-white/10">
            <h3 className="text-xl text-white uppercase mb-3">Still Have Questions?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Give us a call at{' '}
              <a href="tel:8433122981" className="text-accent-orange hover:underline">
                (843) 312-2981
              </a>{' '}
              or book your charter and add any questions in the special requests field.
            </p>
            <Link to="/book" className="btn-primary">
              Book Your Charter
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
