import { useResponsive } from '../../hooks/useResponsive';
import MobileView from './views/MobileView';
import DesktopView from './views/DesktopView';

const ReviewsPage = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};

export default ReviewsPage;
