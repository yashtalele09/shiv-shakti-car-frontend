import { useResponsive } from '../../hooks/useResponsive';
import MobileView from './view/MobileView';
import DesktopView from './view/DesktopView';

const VehicleDetails = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};

export default VehicleDetails;
