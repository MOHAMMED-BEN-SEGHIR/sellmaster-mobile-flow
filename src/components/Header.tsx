
import React, { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title,
  onMenuToggle,
  onSettingsClick
}) => {
  const { theme, toggleTheme } = useTheme();
  const { state: authState } = useAuth();
  
  return (
    <header className="flex items-center justify-between p-4 bg-app-dark">
      <div className="flex items-center">
        <button 
          onClick={onMenuToggle}
          className="mr-4 text-primary"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      
      {onSettingsClick && (
        <button 
          onClick={onSettingsClick}
          className="p-2 rounded-full bg-app-lighter"
        >
          <Settings size={20} className="text-primary" />
        </button>
      )}
    </header>
  );
};

export default Header;
