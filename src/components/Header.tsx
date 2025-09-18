import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { api } from '../services/api';
interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}
interface User{
  name:string
  role:string
  email:string
  assignedRegions:string[];
}
const Header: React.FC<HeaderProps> = ({ onMenuClick,sidebarOpen }) => {
  const [user,setUser]=useState<User|null>(null);
  async function handleLogout(){
    api.logout();
    window.location.href = '/login';
  }
  useEffect(()=>{
    if(localStorage.getItem('user')){
      setUser(JSON.parse(localStorage.getItem('user')!));
    }
  },[])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {!sidebarOpen && <button
            title='Menu'
            onClick={onMenuClick}
            className=" p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>}
          <div className="hidden sm:flex items-center ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900" title="Notifications">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          {/* 🔹 Use user data here */}
          {user  && (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role} - {user?.assignedRegions[0]}</p>
              </div>
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.split(' ')?.map(n => n[0])?.join('')}
                </span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;