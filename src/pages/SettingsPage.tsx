
import React, { useState } from 'react';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';
import BottomNavigation from '../components/BottomNavigation';
import CurrencySelect from '../components/CurrencySelect';
import LanguageSelect from '../components/LanguageSelect';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, LogOut, Shield, Fingerprint } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state: authState, logout, updateUser } = useAuth();
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    if (authState.user) {
      updateUser({ preferredCurrency: currencyCode });
    }
  };
  
  const handleLanguageChange = (languageCode: string) => {
    if (authState.user) {
      updateUser({ preferredLanguage: languageCode });
    }
  };

  return (
    <div className="bg-app-dark min-h-screen pb-20">
      <Header 
        title="Settings" 
        onMenuToggle={toggleDrawer}
      />
      
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Countries
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Currencies
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Languages
              </a>
            </li>
          </ul>
        </nav>
      </SideDrawer>
      
      <main className="p-4">
        {/* User info */}
        <div className="bg-app-card p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {authState.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {authState.user?.name || 'User'}
              </h2>
              <p className="text-gray-400">
                {authState.user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Settings sections */}
        <div className="space-y-6">
          {/* Preferences section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Preferences</h3>
            
            <div className="bg-app-card rounded-lg divide-y divide-gray-700">
              {/* Theme toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  {theme.mode === 'dark' ? (
                    <Moon className="text-gray-400 mr-3" size={20} />
                  ) : (
                    <Sun className="text-gray-400 mr-3" size={20} />
                  )}
                  <span className="text-white">Theme</span>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative rounded-full w-12 h-6 transition-colors ${
                    theme.mode === 'dark' ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span 
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform transition-transform ${
                      theme.mode === 'dark' ? 'translate-x-6' : ''
                    }`} 
                  />
                </button>
              </div>
              
              {/* Currency selection */}
              <div className="p-4">
                <label className="block text-white mb-2">Currency</label>
                <CurrencySelect onChange={handleCurrencyChange} />
              </div>
              
              {/* Language selection */}
              <div className="p-4">
                <label className="block text-white mb-2">Language</label>
                <LanguageSelect onChange={handleLanguageChange} />
              </div>
            </div>
          </div>
          
          {/* Security section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Security</h3>
            
            <div className="bg-app-card rounded-lg divide-y divide-gray-700">
              {/* Biometric authentication */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Fingerprint className="text-gray-400 mr-3" size={20} />
                  <span className="text-white">Biometric Authentication</span>
                </div>
                <button 
                  className="relative rounded-full w-12 h-6 bg-gray-600"
                >
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full" />
                </button>
              </div>
              
              {/* Two-factor authentication */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="text-gray-400 mr-3" size={20} />
                  <span className="text-white">Two-Factor Authentication</span>
                </div>
                <button 
                  className="relative rounded-full w-12 h-6 bg-gray-600"
                >
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={logout}
            className="w-full p-4 rounded-lg bg-red-800 bg-opacity-30 text-red-400 flex items-center justify-center"
          >
            <LogOut className="mr-2" size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
