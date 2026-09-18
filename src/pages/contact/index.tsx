import { useResponsive } from '../../hooks/useResponsive';
import DesktopeView from './views/DesktopView';
import MobileContactView from './views/MobileContactView';

const ContactPage = () => {
  const { isMobile } = useResponsive();
  return <div>{isMobile ? <MobileContactView /> : <DesktopeView />}</div>;
};

export default ContactPage;
