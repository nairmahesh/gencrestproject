import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Bell, LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui/Button';
import Logo from './Logo';
import { useLogout } from '../hooks/useLogout';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { handleLogout } = useLogout();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Logo />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <div className="flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-secondary-foreground" />
            <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-secondary-foreground">{user?.role}</p>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-danger" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;