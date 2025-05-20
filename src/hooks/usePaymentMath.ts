
import { calculateExpression } from '../utils/helpers';

/**
 * Custom hook for handling payment math calculations
 */
export const usePaymentMath = () => {
  /**
   * Parses a mathematical expression and returns the result
   * @param expression - The expression to parse (e.g., '10+15+20')
   * @returns The calculated result
   */
  const parseExpression = (expression: string): number => {
    return calculateExpression(expression);
  };
  
  /**
   * Validates if an expression only contains valid characters
   * @param expression - The expression to validate
   * @returns Boolean indicating if the expression is valid
   */
  const isValidExpression = (expression: string): boolean => {
    // Allow digits, plus signs, decimal points, and spaces
    const validPattern = /^[\d+.\s]*$/;
    return validPattern.test(expression);
  };
  
  return {
    parseExpression,
    isValidExpression
  };
};

export default usePaymentMath;
