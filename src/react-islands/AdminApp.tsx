import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminLogin from '../pages-legacy/admin/AdminLogin';
import AdminForgotPassword from '../pages-legacy/admin/AdminForgotPassword';
import AdminAuthCallback from '../pages-legacy/admin/AdminAuthCallback';
import AdminDashboard from '../pages-legacy/admin/AdminDashboard';
import AdminBookings from '../pages-legacy/admin/AdminBookings';
import AdminContacts from '../pages-legacy/admin/AdminContacts';
import AdminCaptains from '../pages-legacy/admin/AdminCaptains';
import AdminAvailability from '../pages-legacy/admin/AdminAvailability';
import AdminUsers from '../pages-legacy/admin/AdminUsers';

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/auth/callback" element={<AdminAuthCallback />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="captains" element={<AdminCaptains />} />
          <Route path="availability" element={<AdminAvailability />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
