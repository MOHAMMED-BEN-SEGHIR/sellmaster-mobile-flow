
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, Workspace } from '../types';

// Initial state for auth context
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  currentWorkspace: null,
  workspaces: [],
};

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; workspaces: Workspace[] } }
  | { type: 'LOGOUT' }
  | { type: 'SET_WORKSPACE'; payload: { workspace: Workspace } }
  | { type: 'UPDATE_USER'; payload: { user: Partial<User> } };

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        workspaces: action.payload.workspaces,
        currentWorkspace: action.payload.workspaces[0] || null,
      };
    case 'LOGOUT':
      return initialState;
    case 'SET_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload.workspace,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload.user } : null,
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setWorkspace: (workspace: Workspace) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from storage on initial mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        // In a real app, we would load from SecureStore or similar
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const { user, token, workspaces } = JSON.parse(storedAuth);
          if (user && token) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token, workspaces },
            });
          }
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error);
      }
    };

    loadStoredAuth();
  }, []);

  // Save auth state to storage when it changes
  useEffect(() => {
    if (state.isAuthenticated && state.user && state.token) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: state.user,
          token: state.token,
          workspaces: state.workspaces,
        })
      );
    } else {
      localStorage.removeItem('auth');
    }
  }, [state.isAuthenticated, state.user, state.token, state.workspaces]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // This would be an API call in a real app
      // For demo, we'll mock a successful login
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        preferredCurrency: 'MAD',
        preferredLanguage: 'en',
      };

      const mockWorkspaces: Workspace[] = [
        { id: '1', name: 'Demo Company' },
        { id: '2', name: 'Another Organization' },
      ];

      const mockToken = 'jwt-token-would-be-here';

      // Dispatch login success
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: mockUser,
          token: mockToken,
          workspaces: mockWorkspaces,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Set current workspace
  const setWorkspace = (workspace: Workspace) => {
    dispatch({ type: 'SET_WORKSPACE', payload: { workspace } });
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: { user: userData } });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        setWorkspace,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
