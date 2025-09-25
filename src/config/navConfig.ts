import { LayoutDashboard, Droplets, User, Users, Shield } from 'lucide-react';
import type { UserRole } from '../interfaces';

export interface NavLink {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const navLinks: NavLink[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['MDO', 'TSM', 'RBH', 'RMM', 'ZBH', 'HO', 'Admin', 'Finance', 'Sales'],
  },
  {
    path: '/mdo-journey',
    label: 'MDO Journey',
    icon: User,
    roles: ['MDO', 'TSM', 'RBH', 'RMM', 'ZBH', 'HO', 'Admin'],
  },
  {
    path: '/tsm-journey',
    label: 'TSM Journey',
    icon: Users,
    roles: ['TSM', 'RBH', 'RMM', 'ZBH', 'HO', 'Admin'],
  },
  {
    path: '/liquidation',
    label: 'Liquidation',
    icon: Droplets,
    roles: ['MDO', 'TSM', 'RBH', 'RMM', 'ZBH', 'HO', 'Admin', 'Finance'],
  },
  {
    path: '/admin/users',
    label: 'User Management',
    icon: Shield,
    roles: ['Admin'],
  },
];