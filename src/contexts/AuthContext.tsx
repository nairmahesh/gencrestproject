import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ROLE_HIERARCHY, getRoleByCode } from '../types/hierarchy';

interface AuthUser {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  territory?: string;
  region?: string;
  zone?: string;
  state?: string;
  reportsTo?: string;
  isActive: boolean;
  joinDate: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (module: string, action: string) => boolean;
  canApprove: (submitterRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users with credentials
const USERS: Record<string, AuthUser> = {
  'mdo': {
    id: 'U001',
    employeeCode: 'MDO001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gencrest.com',
    phone: '+91 98765 43210',
    role: 'MDO',
    territory: 'North Delhi',
    region: 'Delhi NCR',
    zone: 'North Zone',
    state: 'Delhi',
    reportsTo: 'TSM',
    isActive: true,
    joinDate: '2023-01-15'
  },
  'tsm': {
    id: 'U002',
    employeeCode: 'TSM001',
    name: 'Priya Sharma',
    email: 'priya.sharma@gencrest.com',
    phone: '+91 87654 32109',
    role: 'TSM',
    territory: 'Delhi Territory',
    region: 'Delhi NCR',
    zone: 'North Zone',
    state: 'Delhi',
    reportsTo: 'RBH',
    isActive: true,
    joinDate: '2022-06-10'
  },
  'rbh': {
    id: 'U003',
    employeeCode: 'RBH001',
    name: 'Amit Patel',
    email: 'amit.patel@gencrest.com',
    phone: '+91 76543 21098',
    role: 'RBH',
    region: 'Delhi NCR',
    zone: 'North Zone',
    state: 'Delhi',
    reportsTo: 'RMM',
    isActive: true,
    joinDate: '2021-03-20'
  },
  'rmm': {
    id: 'U004',
    employeeCode: 'RMM001',
    name: 'Sunita Gupta',
    email: 'sunita.gupta@gencrest.com',
    phone: '+91 65432 10987',
    role: 'RMM',
    region: 'North Region',
    zone: 'North Zone',
    reportsTo: 'MH',
    isActive: true,
    joinDate: '2020-08-15'
  },
  'zbh': {
    id: 'U005',
    employeeCode: 'ZBH001',
    name: 'Vikram Singh',
    email: 'vikram.singh@gencrest.com',
    phone: '+91 54321 09876',
    role: 'ZBH',
    zone: 'North Zone',
    reportsTo: 'VP_SM',
    isActive: true,
    joinDate: '2019-11-05'
  },
  'mh': {
    id: 'U006',
    employeeCode: 'MH001',
    name: 'Asad Ahmed',
    email: 'asad.ahmed@gencrest.com',
    phone: '+91 43210 98765',
    role: 'MH',
    reportsTo: 'VP_SM',
    isActive: true,
    joinDate: '2018-04-12'
  },
  'vp': {
    id: 'U007',
    employeeCode: 'VP001',
    name: 'Navdeep Mehta',
    email: 'navdeep.mehta@gencrest.com',
    phone: '+91 21098 76543',
    role: 'VP_SM',
    reportsTo: 'MD',
    isActive: true,
    joinDate: '2017-01-08'
  },
  'md': {
    id: 'U008',
    employeeCode: 'MD001',
    name: 'Ravi Agarwal',
    email: 'ravi.agarwal@gencrest.com',
    phone: '+91 32109 87654',
    role: 'MD',
    reportsTo: undefined,
    isActive: true,
    joinDate: '2015-01-01'
  },
  'chro': {
    id: 'U009',
    employeeCode: 'CHRO001',
    name: 'Meera Joshi',
    email: 'meera.joshi@gencrest.com',
    phone: '+91 10987 65432',
    role: 'CHRO',
    reportsTo: 'MD',
    isActive: true,
    joinDate: '2016-09-15'
  },
  'cfo': {
    id: 'U010',
    employeeCode: 'CFO001',
    name: 'Ashok Bansal',
    email: 'ashok.bansal@gencrest.com',
    phone: '+91 09876 54321',
    role: 'CFO',
    reportsTo: 'MD',
    isActive: true,
    joinDate: '2016-12-01'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - username and password should match
    const normalizedUsername = username.toLowerCase();
    const normalizedPassword = password.toLowerCase();
    
    if (USERS[normalizedUsername] && normalizedUsername === normalizedPassword) {
      const authUser = USERS[normalizedUsername];
      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    
    const roleData = getRoleByCode(user.role);
    if (!roleData) return false;

    // Check if user has permission for this module and action
    const modulePermission = roleData.permissions.find(p => p.module === module || p.module === 'all');
    return modulePermission?.actions.includes(action as any) || false;
  };

  const canApprove = (submitterRole: string): boolean => {
    if (!user) return false;
    
    const roleData = getRoleByCode(user.role);
    return roleData?.canApprove.includes(submitterRole) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasPermission,
      canApprove
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};