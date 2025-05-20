
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../types';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageSelectProps {
  onChange: (languageCode: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onChange }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { state: authState, updateUser } = useAuth();
  
  // Hardcoded languages for demo
  useEffect(() => {
    setLanguages([
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      { code: 'es', name: 'Spanish' },
      { code: 'ar', name: 'Arabic' },
    ]);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (languageCode: string) => {
    if (authState.user) {
      updateUser({ preferredLanguage: languageCode });
      onChange(languageCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between p-3 bg-app-card rounded-lg cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <span className="font-medium">
            {languages.find(l => l.code === authState.user?.preferredLanguage)?.name || 'English'}
          </span>
        </div>
        <ChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full z-10 bg-app-card border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {languages.map((language) => (
            <div
              key={language.code}
              className="p-3 hover:bg-app-lighter cursor-pointer flex items-center justify-between"
              onClick={() => handleSelect(language.code)}
            >
              <span>{language.name}</span>
              {authState.user?.preferredLanguage === language.code && (
                <Check size={18} className="text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;
