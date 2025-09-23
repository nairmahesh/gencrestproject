import React from 'react'
interface AuthLayoutProps {
 children: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
 return (
  <div className='bg-background text-foreground overflow-hidden w-dvw h-dvh flex items-center justify-center'>{children}</div>
 )
}

export default AuthLayout