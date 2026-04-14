import SEO from '../components/seo/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Fish The Wahoo"
        description="Privacy policy for Fish The Wahoo deep sea fishing charters in Charleston, SC."
        canonicalPath="/privacy-policy/"
      />

      <section className="pt-32 pb-20 bg-nautical-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Legal</span>
          <h1 className="text-5xl text-white uppercase mb-6">Privacy Policy</h1>
          <div className="w-24 h-1 bg-accent-orange mb-12" />

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Information We Collect</h2>
              <p>
                When you make a booking or contact us, we collect your name, email address, phone
                number, and payment information (processed securely via Stripe). We do not store
                your full credit card details.
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">How We Use Your Information</h2>
              <ul className="space-y-2">
                <li>To process and confirm your charter booking</li>
                <li>To contact you about your booking details and any changes</li>
                <li>To send seasonal updates and offers if you opt in</li>
                <li>To improve our services</li>
              </ul>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third
                parties, except as required to complete your booking (e.g., sharing your contact
                information with your assigned captain) or as required by law.
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Cookies</h2>
              <p>
                Our site uses standard analytics cookies to understand how visitors use the site.
                You can disable cookies in your browser settings.
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Contact</h2>
              <p>
                Questions about this policy? Email{' '}
                <a href="mailto:info@fishthewahoo.com" className="text-accent-orange hover:underline">
                  info@fishthewahoo.com
                </a>
                .
              </p>
            </div>

            <p className="text-slate-500 text-xs mt-8">Last updated: 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}
