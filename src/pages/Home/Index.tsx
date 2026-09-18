import { useResponsive } from '../../hooks/useResponsive';
import MobileHomeView from './view/MobileHomeVIew';
import DesktopHomeView from './view/DesktopHomeView';

const Home = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileHomeView /> : <DesktopHomeView />}</div>;
};

export default Home;
