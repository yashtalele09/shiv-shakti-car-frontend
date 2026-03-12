import { useResponsive } from "../../../hooks/useResponsive";
import MobileSignUpView from "./view/MobailSignUpView";

const SignUp = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileSignUpView /> : <h1>DesktopSignUp</h1>}</div>;
};

export default SignUp;
