// layout/DesktopLayout.tsx
import { Outlet } from 'react-router-dom';
import DesktopHeader from '../components/desktop-components/DesktopHeader';
import DesktopFooter from '../components/desktop-components/DesktopFooter';

const DesktopLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <DesktopHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <DesktopFooter />
    </div>
  );
};

export default DesktopLayout;
