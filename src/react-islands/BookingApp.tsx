import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookCalendar from '../pages-legacy/BookCalendar';
import BookThanks from '../pages-legacy/BookThanks';

export default function BookingApp() {
  return (
    <BrowserRouter basename="/book">
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<BookCalendar />} />
        <Route path="/thanks/:refCode" element={<BookThanks />} />
      </Routes>
    </BrowserRouter>
  );
}
