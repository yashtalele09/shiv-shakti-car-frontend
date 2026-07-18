import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/mobail-components/mobail-header/Header';
import { useEffect, useState } from 'react';
import MobailBottomNav from '../components/mobail-components/MobailBottomNav';
import MobailFooter from '../components/mobail-components/mobail-footer/MobailFooter';

const MobileLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const [expanded, setExpanded] = useState(!isHomePage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col">
      <Header expanded={expanded} isHomePage={isHomePage} />

      <main className="bg-[#FCF5F5] pb-20">
        <Outlet context={{ expanded, setExpanded }} />
      </main>

      {expanded && !isHomePage && <MobailFooter />}

      <MobailBottomNav expanded={expanded} />
    </div>
  );
};

export default MobileLayout;
