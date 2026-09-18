import { useResponsive } from '../../../hooks/useResponsive';
import MobileSignUpView from './view/MobailSignUpView';
import DesktopSignUpView from './view/DesktopSignUpView';

const SignUp = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileSignUpView /> : <DesktopSignUpView />}</div>;
};

export default SignUp;
