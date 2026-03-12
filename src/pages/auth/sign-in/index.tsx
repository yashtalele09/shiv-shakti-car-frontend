import { useResponsive } from "../../../hooks/useResponsive";
import MobileSignInView from "./view/MobailSignInView";

const SignIn = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileSignInView /> : <h1>DesktopSignIn</h1>}</div>;
};

export default SignIn;
