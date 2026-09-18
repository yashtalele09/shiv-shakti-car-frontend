import { useResponsive } from '../../hooks/useResponsive';
import MobileOtpView from './view/MobailOtpView';
import DesktopOtpView from './view/DesktopOtpView';

const Verification = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileOtpView /> : <DesktopOtpView />}</div>;
};

export default Verification;
