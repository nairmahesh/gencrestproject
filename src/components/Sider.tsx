// src/components/Sider.tsx
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface SiderProps {
  siderOpen: boolean;
  setSiderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sider = ({ siderOpen, setSiderOpen }: SiderProps) => {
  return (
    <aside
      className={`relative flex h-dvh flex-col bg-background border-r border-border transition-all duration-300 ease-in-out ${
        siderOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Collapse Button */}
      <div className="flex h-16 items-center justify-end border-b border-border pr-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSiderOpen(!siderOpen)}
          className="bg-background hover:bg-secondary"
        >
          <ChevronLeft
            className={`transition-transform duration-300 ${
              !siderOpen && 'rotate-180'
            }`}
          />
        </Button>
      </div>

      {/* Navigation Links Placeholder */}
      <nav className="flex-1 p-4">
        {/* TODO: Add Navigation Links here */}
        <p className="text-sm text-secondary-foreground">Navigation</p>
      </nav>

      {/* User Profile Section Placeholder */}
      <div className="border-t border-border p-4">
         {/* TODO: Add User Profile info here */}
         <p className="text-sm text-secondary-foreground">User Profile</p>
      </div>
    </aside>
  );
};

export default Sider;