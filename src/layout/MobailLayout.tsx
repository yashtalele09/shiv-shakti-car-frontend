import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/mobail-components/mobail-header/Header';
import { useState } from 'react';
import MobailBottomNav from '../components/mobail-components/MobailBottomNav';

const MobileLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const [expanded, setExpanded] = useState(!isHomePage); // ← true on all non-home pages

  return (
    <div className="flex flex-col">
      <Header expanded={expanded} isHomePage={isHomePage} />

      <main className="flex-1 bg-[#FCF5F5]">
        <Outlet context={{ expanded, setExpanded }} />
      </main>

      <MobailBottomNav expanded={expanded} />
    </div>
  );
};

export default MobileLayout;
