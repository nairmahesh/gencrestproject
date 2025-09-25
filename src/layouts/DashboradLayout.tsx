import { useState } from "react";
import type React from "react";
import Sider from "../components/Sider";
import Header from "../components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [siderOpen, setSiderOpen] = useState(true);

  return (
    <div className="flex h-dvh w-dvw overflow-hidden bg-secondary">
      <Sider siderOpen={siderOpen} setSiderOpen={setSiderOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;