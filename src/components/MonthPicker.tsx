
import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  currentMonth: Date;
  onChange: (date: Date) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ currentMonth, onChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const previousMonth = () => {
    onChange(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    onChange(addMonths(currentMonth, 1));
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    onChange(newDate);
    setIsCalendarOpen(false);
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(newDate.getFullYear() + increment);
    onChange(newDate);
  };

  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-app-card rounded-lg p-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-app-lighter rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          onClick={toggleCalendar}
          className="text-xl font-bold mx-4"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </button>
        
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-app-lighter rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {isCalendarOpen && (
        <div className="absolute mt-2 w-full bg-app-card rounded-lg shadow-lg z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => handleYearChange(-1)}
              className="p-1 hover:bg-app-lighter rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="font-bold">{currentMonth.getFullYear()}</span>
            
            <button 
              onClick={() => handleYearChange(1)}
              className="p-1 hover:bg-app-lighter rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`p-2 rounded-md ${
                  index === currentMonth.getMonth() 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-app-lighter'
                }`}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
