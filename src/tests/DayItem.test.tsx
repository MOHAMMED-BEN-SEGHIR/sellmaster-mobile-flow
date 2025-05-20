
import { calculateExpression } from '../utils/helpers';

describe('calculateExpression', () => {
  test('should handle simple addition', () => {
    expect(calculateExpression('10+15')).toBe(25);
  });
  
  test('should handle multiple additions', () => {
    expect(calculateExpression('10+15+20')).toBe(45);
  });
  
  test('should handle spaces', () => {
    expect(calculateExpression('10 + 15 + 20')).toBe(45);
  });
  
  test('should handle decimal numbers', () => {
    expect(calculateExpression('10.5+15.5')).toBe(26);
  });
  
  test('should return 0 for empty strings', () => {
    expect(calculateExpression('')).toBe(0);
  });
  
  test('should handle single number input', () => {
    expect(calculateExpression('100')).toBe(100);
  });
});
