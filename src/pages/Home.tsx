import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BoatClass, Captain, Pricing } from '../lib/types';
import Hero from '../components/sections/Hero';
import StatsBar from '../components/sections/StatsBar';
import PackagesPreview from '../components/sections/PackagesPreview';
import GallerySection from '../components/sections/GallerySection';
import CTABanner from '../components/sections/CTABanner';
import CaptainsSection from '../components/sections/CaptainsSection';
import ReviewsSection from '../components/sections/ReviewsSection';

interface ClassWithPricing extends BoatClass {
  startingDeposit: number;
}

export default function Home() {
  const [boatClasses, setBoatClasses] = useState<ClassWithPricing[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);

  useEffect(() => {
    async function load() {
      const [classRes, pricingRes, captainRes] = await Promise.all([
        supabase.from('boat_classes').select('*').order('display_order'),
        supabase.from('pricing').select('*'),
        supabase.from('captains').select('*').eq('is_active', true).limit(3),
      ]);

      if (classRes.data && pricingRes.data) {
        const classes = (classRes.data as BoatClass[]).map((bc) => {
          const prices = (pricingRes.data as Pricing[]).filter(
            (p) => p.boat_class_id === bc.id
          );
          const minDeposit =
            prices.length > 0 ? Math.min(...prices.map((p) => p.deposit_amount)) : 0;
          return { ...bc, startingDeposit: minDeposit };
        });
        setBoatClasses(classes);
      }

      if (captainRes.data) {
        setCaptains(captainRes.data as Captain[]);
      }
    }
    load();
  }, []);

  return (
    <>
      <Hero
        badge="The Premier Deep Sea Experience"
        headline={
          <>
            The Home For <span className="text-accent-orange">Deep Sea</span> Fishing{' '}
            <br />
            <span className="text-slate-400">Charleston, SC</span>
          </>
        }
        subheadline="Experience the thrill of the Atlantic with our world-class fleet and expert captains. From trophy marlin to family fun, we provide the ultimate offshore adventure."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        secondaryCta={{ label: 'View Packages', to: '/packages' }}
      />

      <StatsBar />

      <PackagesPreview boatClasses={boatClasses} />

      <GallerySection />

      <CTABanner />

      <CaptainsSection captains={captains} />

      <ReviewsSection />
    </>
  );
}
