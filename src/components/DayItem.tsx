import React, { useState } from 'react';
import { Payment } from '../types';
import { calculateExpression, formatCurrency } from '../utils/helpers';
import { PlusCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DayItemProps {
  day: number;
  dayName: string;
  payments: Payment[];
  total: number;
  onAddPayment: (amount: number, description?: string) => void;
  onUpdatePayment: (paymentId: string, amount: number, description?: string) => void;
  onDeletePayment: (paymentId: string) => void;
  isHighlighted?: boolean;
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  dayName,
  payments,
  total,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
  isHighlighted = false,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const { state: authState } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleAddPayment = () => {
    if (!inputValue) return;
    
    const amount = calculateExpression(inputValue);
    onAddPayment(amount, showDescription ? description : undefined);
    
    // Reset fields
    setInputValue('');
    setDescription('');
    setShowDescription(false);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div className={`p-4 rounded-lg mb-2 ${isHighlighted ? 'bg-app-lighter' : 'bg-app-card'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">{day}</span>
          <span className="ml-3 text-lg text-gray-300">{dayName}</span>
        </div>
        
        {total > 0 && (
          <div className="bg-accent-yellow text-black font-semibold px-3 py-1 rounded-full">
            {formatCurrency(total, authState.user?.preferredCurrency || 'MAD')}
          </div>
        )}
      </div>
      
      {/* Existing payments */}
      {payments.map((payment) => (
        <div key={payment.id} className="mb-3 p-3 bg-app-lighter rounded-lg">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={payment.amount}
              onChange={(e) => onUpdatePayment(payment.id!, parseFloat(e.target.value), payment.description)}
              className="bg-transparent border-none text-white w-full focus:outline-none"
            />
            <button 
              onClick={() => onDeletePayment(payment.id!)}
              className="p-1 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
          
          {payment.description && (
            <div className="mt-2 text-sm text-gray-400 break-words">
              {payment.description}
            </div>
          )}
        </div>
      ))}
      
      {/* New payment input */}
      <div className="mt-3">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="10+15"
            className="bg-app-lighter text-white px-3 py-2 rounded-lg flex-grow mr-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button 
            onClick={handleAddPayment}
            disabled={!inputValue}
            className={`p-2 rounded-lg ${
              inputValue ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            Add
          </button>
        </div>
        
        {/* Description toggle button */}
        <div className="mt-2 flex justify-between">
          <button 
            onClick={toggleDescription}
            className="flex items-center text-primary text-sm"
          >
            <PlusCircle size={16} className="mr-1" />
            {showDescription ? 'Hide Description' : '+ Description'}
          </button>
        </div>
        
        {/* Description textarea */}
        {showDescription && (
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add description..."
            className="mt-2 w-full bg-app-lighter text-white px-3 py-2 rounded-lg h-20 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}
      </div>
    </div>
  );
};

export default DayItem;
