import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/auth/sign-up';
import SignIn from './pages/auth/sign-in';
import Home from './pages/Home/Index';
import MobileLayout from './layout/MobailLayout';
import Vehicle from './pages/vehicle';
import Contact from './pages/contact';
import Profile from './pages/profile';
import VehicleDetails from './pages/vehicle-details';
import ReviewsPage from './pages/reviews';
import AnalyticsTracker from './components/AnalyticsTracker';
import MobileOtpView from './pages/verification';

const AppRoutes = () => {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Layout Routes */}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicle" element={<Vehicle />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="vehicle-details" element={<VehicleDetails />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="verify-otp" element={<MobileOtpView />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
