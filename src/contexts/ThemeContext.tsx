
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeState } from '../types';

// Initial state
const initialState: ThemeState = {
  mode: 'dark', // Default to dark theme
};

// Action types
type ThemeAction = 
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_THEME' };

// Reducer function
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        mode: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        mode: state.mode === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
};

// Create context
interface ThemeContextType {
  theme: ThemeState;
  setTheme: (mode: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from storage on initial mount
  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          dispatch({
            type: 'SET_THEME',
            payload: storedTheme as 'light' | 'dark',
          });
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      }
    };

    loadStoredTheme();
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme.mode);
    
    // Apply theme to document
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.mode]);

  // Set theme
  const setTheme = (mode: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: mode });
  };

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
