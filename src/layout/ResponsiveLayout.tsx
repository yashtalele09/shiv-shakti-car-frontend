// layout/ResponsiveLayout.tsx
import { useResponsive } from '../hooks/useResponsive';
import MobileLayout from './MobailLayout';
import DesktopLayout from './DesktopLayout';

const ResponsiveLayout = () => {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default ResponsiveLayout;
