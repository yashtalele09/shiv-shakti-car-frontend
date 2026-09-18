import { useResponsive } from '../../../hooks/useResponsive';
import MobileView from './view/MobailView';
import DesktopView from './view/DestopView';

const ForgetPassword = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};

export default ForgetPassword;
