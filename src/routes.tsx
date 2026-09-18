import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/auth/sign-up';
import SignIn from './pages/auth/sign-in';
import Home from './pages/Home';
import Vehicle from './pages/vehicle';
import Contact from './pages/contact';
import Profile from './pages/profile';
import VehicleDetails from './pages/vehicle-details';
import ReviewsPage from './pages/reviews';
import AnalyticsTracker from './components/AnalyticsTracker';
import ForgotPasswordFlow from './pages/auth/forget-password';
import Verification from './pages/verification';
import ResponsiveLayout from './layout/ResponsiveLayout';

const AppRoutes = () => {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-otp" element={<Verification />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />

        {/* Layout Routes */}
        <Route path="/" element={<ResponsiveLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicle" element={<Vehicle />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="vehicle-details" element={<VehicleDetails />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
