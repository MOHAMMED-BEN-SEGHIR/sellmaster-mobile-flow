
// User and Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  preferredCurrency: string;
  preferredLanguage: string;
}

export interface Workspace {
  id: string;
  name: string;
  logo?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
}

// Payment related types
export interface Payment {
  id?: string;
  date: string;
  amount: number;
  description?: string;
  currencyCode: string;
  workspaceId: string;
  synced: boolean;
}

export interface DayPayment {
  day: number;
  dayName?: string;
  payments: Payment[];
  total: number;
}

export interface WeekPayment {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DayPayment[];
  total: number;
}

export interface MonthPayment {
  month: number;
  year: number;
  weeks: WeekPayment[];
  total: number;
}

// Currency and localization
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Language {
  code: string;
  name: string;
}

// Theme and UI
export interface ThemeState {
  mode: 'light' | 'dark';
}

// API related
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: number;
}
