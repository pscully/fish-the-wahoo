import SEO from '../components/seo/SEO';
import { CreditCard } from 'lucide-react';

export default function CharterPayment() {
  return (
    <>
      <SEO
        title="Charter Payment | Fish The Wahoo"
        description="Secure deposit payment for your Fish The Wahoo fishing charter in Charleston, SC."
        canonicalPath="/charter-payment/"
      />

      <section className="pt-40 pb-20 bg-nautical-dark">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CreditCard className="w-12 h-12 text-accent-orange mx-auto mb-6" />
          <h1 className="text-4xl text-white uppercase mb-4">Charter Payment</h1>
          <div className="w-24 h-1 bg-accent-orange mx-auto mb-8" />
          <p className="text-slate-400 mb-8">
            Your captain has sent you a payment link. Please complete your deposit payment below
            to confirm your booking.
          </p>
          <div className="metallic-card rounded-xl p-8 text-left">
            <p className="text-slate-400 text-sm text-center">
              Payment link details loading... If you have questions, call{' '}
              <a href="tel:8433122981" className="text-accent-orange hover:underline">
                (843) 312-2981
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
