
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Workspace } from '../types';
import { ChevronDown, Check, Building } from 'lucide-react';

const WorkspaceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state: authState, setWorkspace } = useAuth();
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (workspace: Workspace) => {
    setWorkspace(workspace);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between p-3 bg-app-card rounded-lg cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Building className="mr-2 text-primary" size={18} />
          <span className="font-medium">
            {authState.currentWorkspace?.name || 'Select Workspace'}
          </span>
        </div>
        <ChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full z-10 bg-app-card border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {authState.workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="p-3 hover:bg-app-lighter cursor-pointer flex items-center justify-between"
              onClick={() => handleSelect(workspace)}
            >
              <span>{workspace.name}</span>
              {authState.currentWorkspace?.id === workspace.id && (
                <Check size={18} className="text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;
