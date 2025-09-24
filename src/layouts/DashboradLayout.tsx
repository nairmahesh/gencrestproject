import type React from "react"
import Sider from "../components/Sider"
interface DashboardLayoutProps {
  children: React.ReactNode
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="w-dvw h-dvh overflow-hidden flex">
      <Sider />
      {children}
    </div>
  )
}

export default DashboardLayout