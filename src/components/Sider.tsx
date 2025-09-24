// src/components/Sider.tsx
import { ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from './ui/Button';
import NavLinks from './NavLinks';
import { type RootState } from '../store/store';

interface SiderProps {
  siderOpen: boolean;
  setSiderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sider = ({ siderOpen, setSiderOpen }: SiderProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
console.log('user::',user)
  return (
    <aside
      className={`relative flex h-dvh flex-col bg-background border-r border-border transition-all duration-300 ease-in-out ${
        siderOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex h-16 items-center justify-end border-b border-border pr-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSiderOpen(!siderOpen)}
          className="bg-background hover:bg-secondary"
        >
          <ChevronLeft className={`transition-transform duration-300 ${!siderOpen && 'rotate-180'}`} />
        </Button>
      </div>

      <nav className="flex-1 p-2">
        {user?.role && <NavLinks userRole={user.role} siderOpen={siderOpen} />}
      </nav>

      <div className="border-t border-border p-4">
        {/* User Profile info can be added here */}
      </div>
    </aside>
  );
};

export default Sider;