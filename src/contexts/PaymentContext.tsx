import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MonthPayment, Payment, WeekPayment } from '../types';
import { generateWeeksForMonth, calculateWeekTotal } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { paymentsApi } from '../services/api';

// Initial state
interface PaymentState {
  currentMonth: number;
  currentYear: number;
  monthData: MonthPayment | null;
  isLoading: boolean;
  error: string | null;
  syncQueue: Payment[];
}

const initialState: PaymentState = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  monthData: null,
  isLoading: false,
  error: null,
  syncQueue: [],
};

// Action types
type PaymentAction =
  | { type: 'SET_MONTH'; payload: { month: number; year: number } }
  | { type: 'FETCH_PAYMENTS_START' }
  | { type: 'FETCH_PAYMENTS_SUCCESS'; payload: { monthData: MonthPayment } }
  | { type: 'FETCH_PAYMENTS_ERROR'; payload: { error: string } }
  | { type: 'ADD_PAYMENT'; payload: { weekIndex: number; dayIndex: number; payment: Payment } }
  | { type: 'UPDATE_PAYMENT'; payload: { weekIndex: number; dayIndex: number; paymentId: string; payment: Partial<Payment> } }
  | { type: 'DELETE_PAYMENT'; payload: { weekIndex: number; dayIndex: number; paymentId: string } }
  | { type: 'ADD_TO_SYNC_QUEUE'; payload: { payment: Payment } }
  | { type: 'REMOVE_FROM_SYNC_QUEUE'; payload: { paymentId: string } };

// Reducer function
const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SET_MONTH':
      return {
        ...state,
        currentMonth: action.payload.month,
        currentYear: action.payload.year,
        monthData: null, // Reset data when changing month
      };
    case 'FETCH_PAYMENTS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_PAYMENTS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        monthData: action.payload.monthData,
      };
    case 'FETCH_PAYMENTS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case 'ADD_PAYMENT': {
      if (!state.monthData) return state;

      const { weekIndex, dayIndex, payment } = action.payload;
      const updatedMonthData = { ...state.monthData };
      
      // Add payment to the specific day
      updatedMonthData.weeks[weekIndex].days[dayIndex].payments.push(payment);
      
      // Recalculate totals
      updatedMonthData.weeks[weekIndex] = calculateWeekTotal(updatedMonthData.weeks[weekIndex]);
      updatedMonthData.total = updatedMonthData.weeks.reduce((sum, week) => sum + week.total, 0);
      
      return {
        ...state,
        monthData: updatedMonthData,
      };
    }
    case 'UPDATE_PAYMENT': {
      if (!state.monthData) return state;

      const { weekIndex, dayIndex, paymentId, payment } = action.payload;
      const updatedMonthData = { ...state.monthData };
      
      // Find and update payment
      const dayPayments = updatedMonthData.weeks[weekIndex].days[dayIndex].payments;
      const paymentIndex = dayPayments.findIndex(p => p.id === paymentId);
      
      if (paymentIndex !== -1) {
        dayPayments[paymentIndex] = {
          ...dayPayments[paymentIndex],
          ...payment,
        };
      }
      
      // Recalculate totals
      updatedMonthData.weeks[weekIndex] = calculateWeekTotal(updatedMonthData.weeks[weekIndex]);
      updatedMonthData.total = updatedMonthData.weeks.reduce((sum, week) => sum + week.total, 0);
      
      return {
        ...state,
        monthData: updatedMonthData,
      };
    }
    case 'DELETE_PAYMENT': {
      if (!state.monthData) return state;

      const { weekIndex, dayIndex, paymentId } = action.payload;
      const updatedMonthData = { ...state.monthData };
      
      // Filter out the payment
      updatedMonthData.weeks[weekIndex].days[dayIndex].payments = 
        updatedMonthData.weeks[weekIndex].days[dayIndex].payments.filter(p => p.id !== paymentId);
      
      // Recalculate totals
      updatedMonthData.weeks[weekIndex] = calculateWeekTotal(updatedMonthData.weeks[weekIndex]);
      updatedMonthData.total = updatedMonthData.weeks.reduce((sum, week) => sum + week.total, 0);
      
      return {
        ...state,
        monthData: updatedMonthData,
      };
    }
    case 'ADD_TO_SYNC_QUEUE':
      return {
        ...state,
        syncQueue: [...state.syncQueue, action.payload.payment],
      };
    case 'REMOVE_FROM_SYNC_QUEUE':
      return {
        ...state,
        syncQueue: state.syncQueue.filter(p => p.id !== action.payload.paymentId),
      };
    default:
      return state;
  }
};

// Create context
interface PaymentContextType {
  state: PaymentState;
  setMonth: (month: number, year: number) => void;
  fetchPayments: () => Promise<void>;
  addPayment: (weekIndex: number, dayIndex: number, payment: Omit<Payment, 'id' | 'synced'>) => void;
  updatePayment: (weekIndex: number, dayIndex: number, paymentId: string, payment: Partial<Payment>) => void;
  deletePayment: (weekIndex: number, dayIndex: number, paymentId: string) => void;
  syncPayments: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Helper to generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Provider component
export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch payments when month changes or workspace changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.currentWorkspace) {
      fetchPayments();
    }
  }, [
    state.currentMonth,
    state.currentYear,
    authState.isAuthenticated,
    authState.currentWorkspace?.id
  ]);

  // Set month and year
  const setMonth = (month: number, year: number) => {
    dispatch({ 
      type: 'SET_MONTH', 
      payload: { month, year }
    });
  };

  // Fetch payments for the current month
  const fetchPayments = async () => {
    if (!authState.token || !authState.currentWorkspace) return;

    dispatch({ type: 'FETCH_PAYMENTS_START' });

    try {
      // In a real app, this would fetch from API
      // For demo, we'll generate mock data
      
      // Generate weeks for the month
      const weeks = generateWeeksForMonth(state.currentMonth, state.currentYear);
      
      // Calculate month total
      const monthTotal = weeks.reduce((sum, week) => sum + week.total, 0);
      
      // Create month data
      const monthData: MonthPayment = {
        month: state.currentMonth,
        year: state.currentYear,
        weeks,
        total: monthTotal,
      };
      
      dispatch({ 
        type: 'FETCH_PAYMENTS_SUCCESS', 
        payload: { monthData } 
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      dispatch({ 
        type: 'FETCH_PAYMENTS_ERROR', 
        payload: { error: 'Failed to fetch payments' } 
      });
    }
  };

  // Add a new payment
  const addPayment = (
    weekIndex: number,
    dayIndex: number,
    paymentData: Omit<Payment, 'id' | 'synced'>
  ) => {
    if (!authState.currentWorkspace) return;
    
    const payment: Payment = {
      ...paymentData,
      id: generateId(),
      synced: false,
    };

    // Add to local state
    dispatch({ 
      type: 'ADD_PAYMENT', 
      payload: { weekIndex, dayIndex, payment } 
    });

    // Add to sync queue
    dispatch({ 
      type: 'ADD_TO_SYNC_QUEUE', 
      payload: { payment } 
    });
  };

  // Update an existing payment
  const updatePayment = (
    weekIndex: number,
    dayIndex: number,
    paymentId: string,
    paymentUpdate: Partial<Payment>
  ) => {
    if (!authState.currentWorkspace) return;
    
    // Update in local state
    dispatch({ 
      type: 'UPDATE_PAYMENT', 
      payload: { weekIndex, dayIndex, paymentId, payment: paymentUpdate } 
    });

    // Find existing payment
    const day = state.monthData?.weeks[weekIndex]?.days[dayIndex];
    const payment = day?.payments.find(p => p.id === paymentId);

    if (payment) {
      const updatedPayment = { ...payment, ...paymentUpdate, synced: false };
      
      // Add to sync queue
      dispatch({ 
        type: 'ADD_TO_SYNC_QUEUE', 
        payload: { payment: updatedPayment } 
      });
    }
  };

  // Delete a payment
  const deletePayment = (
    weekIndex: number,
    dayIndex: number,
    paymentId: string
  ) => {
    if (!authState.currentWorkspace) return;
    
    // Delete from local state
    dispatch({ 
      type: 'DELETE_PAYMENT', 
      payload: { weekIndex, dayIndex, paymentId } 
    });

    // Add ID to sync queue for deletion
    // In a real app, you'd handle deletion in the sync process
  };

  // Synchronize payments with the backend
  const syncPayments = async () => {
    if (!authState.token || !state.syncQueue.length) return;

    try {
      // In a real app, this would sync with the API
      // For each payment in the queue
      for (const payment of state.syncQueue) {
        if (payment.id) {
          // If it has an ID, update it
          await paymentsApi.updatePayment(authState.token, payment.id, payment);
        } else {
          // Otherwise create it
          await paymentsApi.createPayment(authState.token, payment);
        }

        // Remove from sync queue
        dispatch({ 
          type: 'REMOVE_FROM_SYNC_QUEUE', 
          payload: { paymentId: payment.id || '' } 
        });
      }
      
      console.log('All payments synced successfully!');
    } catch (error) {
      console.error('Error syncing payments:', error);
      // In a real app, implement retry logic or notify user
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        state,
        setMonth,
        fetchPayments,
        addPayment,
        updatePayment,
        deletePayment,
        syncPayments,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook for using the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
