import { Outlet } from "react-router-dom";
import Header from "../components/mobail-components/mobail-header/Header";
import { useState } from "react";
import MobailBottomNav from "../components/mobail-components/MobailBottomNav";

const MobileLayout = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <Header expanded={expanded} />

      <main className="flex-1 bg-red-50">
        <Outlet context={{ expanded, setExpanded }} />
      </main>

      <MobailBottomNav expanded={expanded} />
    </div>
  );
};

export default MobileLayout;
