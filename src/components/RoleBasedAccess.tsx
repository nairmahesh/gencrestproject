import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedAccessProps {
  allowedRoles?: string[];
  module?: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  module,
  action,
  children,
  fallback = null
}) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (module && action && !hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;