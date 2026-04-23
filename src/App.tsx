import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import ScrollToTop from './components/layout/ScrollToTop';

// Existing pages
import Home from './pages/Home';
import BookCalendar from './pages/BookCalendar';
import BookThanks from './pages/BookThanks';
import CheckCharter from './pages/CheckCharter';
import About from './pages/About';
import FAQ from './pages/FAQ';

// New pages
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import CategoryLanding from './pages/CategoryLanding';
import Species from './pages/Species';
import SpeciesDetail from './pages/SpeciesDetail';
import TourBoats from './pages/TourBoats';
import TourBoatDetail from './pages/TourBoatDetail';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import TripVideos from './pages/TripVideos';
import DailyCatch from './pages/DailyCatch';
import TripPreparations from './pages/TripPreparations';
import CancellationPolicy from './pages/CancellationPolicy';
import Contact from './pages/Contact';
import SanteeRiverSportsmen from './pages/SanteeRiverSportsmen';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CharterPayment from './pages/CharterPayment';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminContacts from './pages/admin/AdminContacts';
import AdminCaptains from './pages/admin/AdminCaptains';
import AdminAvailability from './pages/admin/AdminAvailability';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes with header/footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          {/* Booking */}
          <Route path="/book" element={<Navigate to="/book/calendar" replace />} />
          <Route path="/book/calendar" element={<BookCalendar />} />
          <Route path="/book/thanks/:refCode" element={<BookThanks />} />
          <Route path="/check" element={<CheckCharter />} />
          <Route path="/charter-payment" element={<CharterPayment />} />

          {/* Packages */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />

          {/* Category landings */}
          <Route
            path="/deep-sea-fishing"
            element={
              <CategoryLanding
                category="deep-sea"
                badge="Offshore Fishing"
                headline={<>Deep Sea <span className="text-accent-orange">Fishing</span></>}
                subheadline="Head offshore to the Gulf Stream for mahi-mahi, wahoo, marlin, and tuna. Charleston's best deep sea fishing charters."
                metaTitle="Deep Sea Fishing Charters Charleston SC | Fish The Wahoo"
                metaDescription="Book a deep sea fishing charter out of Charleston, SC. Target mahi-mahi, wahoo, marlin, and tuna on a Gulf Stream offshore trip."
                canonicalPath="/deep-sea-fishing/"
              />
            }
          />
          <Route
            path="/inshore-fishing-charters"
            element={
              <CategoryLanding
                category="near-shore"
                badge="Nearshore Fishing"
                headline={<>Inshore <span className="text-accent-orange">Charters</span></>}
                subheadline="Nearshore and inshore fishing trips targeting snapper, grouper, sea bass, and more. Great for families and first-timers."
                metaTitle="Inshore Fishing Charters Charleston SC | Fish The Wahoo"
                metaDescription="Inshore and nearshore fishing charters out of Charleston, SC. Target snapper, grouper, and sea bass. Family-friendly trips available."
                canonicalPath="/inshore-fishing-charters/"
              />
            }
          />
          <Route
            path="/fishing-charters-in-charleston-sc"
            element={
              <CategoryLanding
                category="deep-sea"
                badge="Charleston, SC"
                headline={<>Fishing Charters in <span className="text-accent-orange">Charleston, SC</span></>}
                subheadline="Fish The Wahoo is Charleston's premier deep sea fishing charter service. One platform, 15+ boats, the perfect trip every time."
                metaTitle="Fishing Charters in Charleston SC | Fish The Wahoo"
                metaDescription="Book a fishing charter in Charleston, SC with Fish The Wahoo. Deep sea offshore trips and nearshore family charters. Call (843) 568-3222."
                canonicalPath="/fishing-charters-in-charleston-sc/"
              />
            }
          />
          {/* Species */}
          <Route path="/species" element={<Species />} />
          <Route path="/species/:slug" element={<SpeciesDetail />} />

          {/* Boats */}
          <Route path="/captains" element={<Navigate to="/about" replace />} />
          <Route path="/tour-boats" element={<TourBoats />} />
          <Route path="/tour-boats/:slug" element={<TourBoatDetail />} />

          {/* Content */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/trip-videos" element={<TripVideos />} />
          <Route path="/daily-catch" element={<DailyCatch />} />
          <Route path="/trip-preparations" element={<TripPreparations />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/santee-river-sportsmen" element={<SanteeRiverSportsmen />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Legal */}
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />

          {/* Legacy redirects (handled as 301 in _redirects, but catch here for SPA) */}
          <Route path="/book-your-trip" element={<Navigate to="/book" replace />} />
          <Route path="/manual-booking" element={<Navigate to="/book" replace />} />
          <Route path="/check-my-charter" element={<Navigate to="/check" replace />} />
          <Route path="/meet-the-crew" element={<Navigate to="/about" replace />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/contact-us/privacy-policy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/contact-us/terms-of-use" element={<Navigate to="/terms-of-use" replace />} />
          <Route path="/packages-and-prices" element={<Navigate to="/packages" replace />} />
          <Route path="/fishing-reservation" element={<Navigate to="/book" replace />} />
          <Route path="/shop" element={<Navigate to="/book" replace />} />
          <Route path="/checkout" element={<Navigate to="/book" replace />} />
          <Route path="/cart" element={<Navigate to="/book" replace />} />
          <Route path="/my-account" element={<Navigate to="/book" replace />} />
          <Route path="/captain-daily-report" element={<Navigate to="/daily-catch" replace />} />
          <Route path="/charter-survey" element={<Navigate to="/contact" replace />} />
          <Route path="/category/general" element={<Navigate to="/blog" replace />} />

          {/* Species legacy flat URLs */}
          <Route path="/blue-marlin-fishing" element={<Navigate to="/species/blue-marlin" replace />} />
          <Route path="/white-marlin-fishing" element={<Navigate to="/species/white-marlin" replace />} />
          <Route path="/dolphin-fishing" element={<Navigate to="/species/dolphin" replace />} />
          <Route path="/mahi-mahi-fishing" element={<Navigate to="/species/mahi-mahi" replace />} />
          <Route path="/grouper-fishing" element={<Navigate to="/species/grouper" replace />} />
          <Route path="/red-snapper-fishing" element={<Navigate to="/species/red-snapper" replace />} />
          <Route path="/sailfish-fishing" element={<Navigate to="/species/sailfish" replace />} />
          <Route path="/sea-bass-fishing" element={<Navigate to="/species/sea-bass" replace />} />
          <Route path="/tuna-fishing" element={<Navigate to="/species/tuna-charleston" replace />} />
          <Route path="/swordfish-fishing" element={<Navigate to="/species/swordfish" replace />} />
          <Route path="/shark-fishing" element={<Navigate to="/species/shark" replace />} />
          <Route path="/wahoo-fishing" element={<Navigate to="/species/wahoo" replace />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="captains" element={<AdminCaptains />} />
          <Route path="availability" element={<AdminAvailability />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
