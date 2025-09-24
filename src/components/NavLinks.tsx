// src/components/NavLinks.tsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { navLinks } from '../config/navConfig';
import type { UserRole } from '../interfaces';

interface NavLinksProps {
  userRole: UserRole;
  siderOpen: boolean;
}

const NavLinks = ({ userRole, siderOpen }: NavLinksProps) => {
  const accessibleLinks = navLinks.filter(link => link.roles.includes(userRole));

  return (
    <ul className="space-y-2">
      {accessibleLinks.map(({ path, label, icon: Icon }) => (
        <li key={path}>
          <RouterNavLink
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 transition-all
              ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary-foreground hover:bg-secondary'
              }
              ${!siderOpen ? 'justify-center' : ''}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className={`truncate ${!siderOpen ? 'hidden' : ''}`}>{label}</span>
          </RouterNavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;