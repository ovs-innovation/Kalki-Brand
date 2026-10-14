import React from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";

const DesktopSidebar = () => {
  return (
    <aside className="z-30 flex-shrink-0 hidden w-64 overflow-y-auto bg-white dark:bg-black border-r border-gray-200 dark:border-white/10 lg:block">
      <SidebarContent />
    </aside>
  );
};

export default DesktopSidebar;
