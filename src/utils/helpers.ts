
import { format, getWeek, getWeeksInMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { WeekPayment, DayPayment, Payment } from '../types';

/**
 * Calculate the sum from an expression like "10+15+20"
 * @param expression - The math expression to parse
 * @returns The calculated sum or 0 if invalid
 */
export const calculateExpression = (expression: string): number => {
  if (!expression) return 0;
  
  try {
    // Remove all spaces
    const cleanExpression = expression.replace(/\s/g, '');
    
    // Split by + and sum all values
    return cleanExpression
      .split('+')
      .map(part => parseFloat(part.trim()))
      .filter(num => !isNaN(num))
      .reduce((sum, num) => sum + num, 0);
  } catch (error) {
    console.error('Error calculating expression:', error);
    return 0;
  }
};

/**
 * Get currency symbol from currency code
 * @param currencyCode - The currency code (e.g., USD, EUR, MAD)
 * @returns The currency symbol
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencies: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    MAD: 'MAD',
    CAD: 'C$',
    AUD: 'A$',
    INR: '₹',
    RUB: '₽',
  };

  return currencies[currencyCode] || currencyCode;
};

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${amount.toFixed(2)} ${symbol}`;
};

/**
 * Generate week data for a given month and year
 * @param month - Month (0-11)
 * @param year - Year
 * @returns Array of week data objects
 */
export const generateWeeksForMonth = (month: number, year: number): WeekPayment[] => {
  const date = new Date(year, month);
  const weeksCount = getWeeksInMonth(date);
  const weeks: WeekPayment[] = [];

  for (let i = 0; i < weeksCount; i++) {
    const firstDayOfMonth = new Date(year, month, 1);
    let weekStartDate = startOfWeek(firstDayOfMonth);
    
    // Adjust to get the correct week
    if (i > 0) {
      weekStartDate = addDays(weekStartDate, i * 7);
    }
    
    const weekEndDate = endOfWeek(weekStartDate);
    const weekNumber = getWeek(weekStartDate);

    const days: DayPayment[] = [];
    for (let j = 0; j < 7; j++) {
      const day = addDays(weekStartDate, j);
      days.push({
        day: day.getDate(),
        dayName: format(day, 'EEEE'),
        payments: [],
        total: 0
      });
    }

    weeks.push({
      weekNumber,
      startDate: format(weekStartDate, 'yyyy-MM-dd'),
      endDate: format(weekEndDate, 'yyyy-MM-dd'),
      days,
      total: 0
    });
  }

  return weeks;
};

/**
 * Calculate totals for a week based on day payments
 * @param week - The week data to recalculate
 * @returns Updated week with recalculated totals
 */
export const calculateWeekTotal = (week: WeekPayment): WeekPayment => {
  const updatedWeek = { ...week };
  
  // Calculate total for each day
  updatedWeek.days = updatedWeek.days.map(day => {
    const dayTotal = day.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return { ...day, total: dayTotal };
  });
  
  // Calculate week total from days
  updatedWeek.total = updatedWeek.days.reduce((sum, day) => sum + day.total, 0);
  
  return updatedWeek;
};

/**
 * Generate a unique ID for new items
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
