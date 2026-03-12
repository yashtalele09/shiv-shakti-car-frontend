import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/sign-up";
import SignIn from "./pages/auth/sign-in";
import Home from "./pages/Home/Index";
import MobileLayout from "./layout/MobailLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes (No Layout) */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Layout Routes */}
      <Route path="/" element={<MobileLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
