import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import BookCharter from './pages/BookCharter';
import CheckCharter from './pages/CheckCharter';
import About from './pages/About';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCaptains from './pages/admin/AdminCaptains';
import AdminAvailability from './pages/admin/AdminAvailability';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookCharter />} />
          <Route path="/check" element={<CheckCharter />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="captains" element={<AdminCaptains />} />
          <Route path="availability" element={<AdminAvailability />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
