import { useResponsive } from '../../hooks/useResponsive';
import MobileView from './views/MobaileView';
import DesktopView from './views/DesktopView';

const VehicleDetails = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};

export default VehicleDetails;
