import { useResponsive } from '../../../hooks/useResponsive';
import MobileSignInView from './view/MobailSignInView';
import DesktopSignInView from './view/DesktopSignInView';

const SignIn = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileSignInView /> : <DesktopSignInView />}</div>;
};

export default SignIn;
