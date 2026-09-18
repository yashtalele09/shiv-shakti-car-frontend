import { useResponsive } from '../../hooks/useResponsive';
import MobileView from './views/MobileProfileView';
import DesktopView from './views/DesktopProfileView';

const ProfilePage = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};

export default ProfilePage;
