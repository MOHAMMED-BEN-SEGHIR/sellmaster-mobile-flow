
import React, { useState } from 'react';
import { WeekPayment } from '../types';
import DayItem from './DayItem';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { format } from 'date-fns';

interface WeekAccordionProps {
  week: WeekPayment;
  onAddPayment: (dayIndex: number, amount: number, description?: string) => void;
  onUpdatePayment: (dayIndex: number, paymentId: string, amount: number, description?: string) => void;
  onDeletePayment: (dayIndex: number, paymentId: string) => void;
}

const WeekAccordion: React.FC<WeekAccordionProps> = ({
  week,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state: authState } = useAuth();

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  // Format dates
  const startDate = new Date(week.startDate);
  const endDate = new Date(week.endDate);
  const formattedDateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;

  return (
    <div className="mb-4 bg-app-card rounded-lg overflow-hidden">
      {/* Week header */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={toggleAccordion}
      >
        <div className="flex items-center">
          <Calendar className="text-accent-orange mr-2" />
          <span className="text-lg font-semibold">
            Week {week.weekNumber}
            <span className="ml-2 text-sm text-gray-400">{formattedDateRange}</span>
          </span>
        </div>
        
        <div className="flex items-center">
          {week.total > 0 && (
            <div className="mr-3 bg-accent-yellow text-black font-semibold px-3 py-1 rounded-full">
              {formatCurrency(week.total, authState.user?.preferredCurrency || 'MAD')}
            </div>
          )}
          
          {isExpanded ? (
            <ChevronUp className="text-gray-400" />
          ) : (
            <ChevronDown className="text-gray-400" />
          )}
        </div>
      </div>
      
      {/* Week content */}
      {isExpanded && (
        <div className="px-4 pb-4 accordion-animate">
          {week.days.map((day, index) => (
            <DayItem
              key={index}
              day={day.day}
              dayName={day.dayName || ''}
              payments={day.payments}
              total={day.total}
              onAddPayment={(amount, description) => 
                onAddPayment(index, amount, description)
              }
              onUpdatePayment={(paymentId, amount, description) => 
                onUpdatePayment(index, paymentId, amount, description)
              }
              onDeletePayment={(paymentId) => 
                onDeletePayment(index, paymentId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekAccordion;
