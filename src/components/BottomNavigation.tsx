
import React from 'react';
import { Home, CheckCircle, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-app-dark border-t border-gray-800 flex justify-around items-center p-3 z-10">
      <Link 
        to="/" 
        className={`flex flex-col items-center ${
          isActive('/') ? 'text-primary' : 'text-gray-400'
        }`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Dashboard</span>
      </Link>
      
      <Link 
        to="/payments"
        className={`flex flex-col items-center ${
          isActive('/payments') ? 'text-primary' : 'text-gray-400'
        }`}
      >
        <div className="relative">
          <CheckCircle size={24} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full"></div>
        </div>
        <span className="text-xs mt-1">Payments</span>
      </Link>
      
      <Link 
        to="/settings"
        className={`flex flex-col items-center ${
          isActive('/settings') ? 'text-primary' : 'text-gray-400'
        }`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
