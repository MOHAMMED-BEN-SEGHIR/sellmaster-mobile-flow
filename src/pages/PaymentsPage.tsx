
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';
import BottomNavigation from '../components/BottomNavigation';
import MonthPicker from '../components/MonthPicker';
import WeekAccordion from '../components/WeekAccordion';
import { toast } from "@/hooks/use-toast";
import { usePayment } from '../contexts/PaymentContext';
import { useAuth } from '../contexts/AuthContext';
import { generateId } from '../utils/helpers';

const PaymentsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { state: authState } = useAuth();
  const { 
    state: paymentState, 
    setMonth, 
    fetchPayments, 
    addPayment, 
    updatePayment, 
    deletePayment 
  } = usePayment();

  // Handle month change from month picker
  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
    setMonth(date.getMonth(), date.getFullYear());
  };

  // Toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Add payment handler
  const handleAddPayment = (weekIndex: number, dayIndex: number, amount: number, description?: string) => {
    if (!authState.currentWorkspace) return;
    
    const day = paymentState.monthData?.weeks[weekIndex].days[dayIndex];
    if (!day) return;
    
    const date = `${paymentState.currentYear}-${(paymentState.currentMonth + 1).toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
    
    addPayment(weekIndex, dayIndex, {
      date,
      amount,
      description,
      currencyCode: authState.user?.preferredCurrency || 'MAD',
      workspaceId: authState.currentWorkspace.id,
    });
    
    // Use the shadcn/ui toast
    toast({
      title: "Success",
      description: "Payment added successfully",
      variant: "default", 
    });
  };

  // Update payment handler
  const handleUpdatePayment = (weekIndex: number, dayIndex: number, paymentId: string, amount: number, description?: string) => {
    updatePayment(weekIndex, dayIndex, paymentId, { amount, description });
    
    // Use the shadcn/ui toast
    toast({
      title: "Success",
      description: "Payment updated successfully",
      variant: "default",
    });
  };

  // Delete payment handler
  const handleDeletePayment = (weekIndex: number, dayIndex: number, paymentId: string) => {
    deletePayment(weekIndex, dayIndex, paymentId);
    
    // Use the shadcn/ui toast
    toast({
      title: "Info",
      description: "Payment deleted successfully",
      variant: "default",
    });
  };
  
  return (
    <div className="bg-app-dark min-h-screen pb-20">
      <Header 
        title="Payment Tracker" 
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
      
      <div className="p-4">
        {/* Month Picker */}
        <MonthPicker 
          currentMonth={currentDate} 
          onChange={handleMonthChange} 
        />
        
        {/* Month summary */}
        <div className="mt-4 p-4 bg-app-teal rounded-lg text-center">
          <p className="text-xl font-bold mb-2">
            Month Total
          </p>
          {paymentState.isLoading ? (
            <div className="animate-pulse h-8 w-32 bg-gray-600 rounded mx-auto"></div>
          ) : (
            <p className="text-3xl font-bold">
              {(paymentState.monthData?.total || 0).toFixed(2)} {authState.user?.preferredCurrency}
            </p>
          )}
        </div>
        
        {/* Calendar grid for current month */}
        <div className="mt-6 bg-app-card rounded-lg p-4">
          <div className="calendar-grid mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
            
            {/* This would be the days grid */}
            {/* Just showing the skeleton here for demo */}
            {Array.from({ length: 31 }, (_, i) => (
              <div 
                key={i} 
                className={`calendar-day ${
                  i + 1 === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() && 
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? 'today' 
                    : ''
                } ${
                  i < 28 ? 'active' : 'inactive'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Weeks accordions */}
        <div className="mt-6">
          {paymentState.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="animate-pulse bg-app-card p-4 rounded-lg">
                  <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            paymentState.monthData?.weeks.map((week, weekIndex) => (
              <WeekAccordion 
                key={weekIndex}
                week={week}
                onAddPayment={(dayIndex, amount, description) => 
                  handleAddPayment(weekIndex, dayIndex, amount, description)
                }
                onUpdatePayment={(dayIndex, paymentId, amount, description) => 
                  handleUpdatePayment(weekIndex, dayIndex, paymentId, amount, description)
                }
                onDeletePayment={(dayIndex, paymentId) => 
                  handleDeletePayment(weekIndex, dayIndex, paymentId)
                }
              />
            ))
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default PaymentsPage;
