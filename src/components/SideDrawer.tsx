
import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import WorkspaceSelector from './WorkspaceSelector';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  onClose,
  children 
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-app-dark z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">SellMaster</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-app-lighter"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <WorkspaceSelector />
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
