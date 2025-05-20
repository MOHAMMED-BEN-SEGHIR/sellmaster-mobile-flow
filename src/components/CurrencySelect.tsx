
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Currency } from '../types';
import { ChevronDown, Check } from 'lucide-react';

interface CurrencySelectProps {
  onChange: (currencyCode: string) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ onChange }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { state: authState, updateUser } = useAuth();
  
  // Hardcoded currencies for demo
  useEffect(() => {
    setCurrencies([
      { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
    ]);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (currencyCode: string) => {
    if (authState.user) {
      updateUser({ preferredCurrency: currencyCode });
      onChange(currencyCode);
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
            {authState.user?.preferredCurrency || 'MAD'}
          </span>
        </div>
        <ChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full z-10 bg-app-card border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="p-3 hover:bg-app-lighter cursor-pointer flex items-center justify-between"
              onClick={() => handleSelect(currency.code)}
            >
              <div className="flex items-center">
                <span className="mr-2">{currency.symbol}</span>
                <span>{currency.name}</span>
              </div>
              {authState.user?.preferredCurrency === currency.code && (
                <Check size={18} className="text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelect;
