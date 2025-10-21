export interface User {
  uid: string;
  name: string;
  username: string;
  email?: string;
}

export interface LoginResponse {
  spreadsheet: User;
  token: string;
}

export interface Transaction {
  uid: string;
  type: 'revenue' | 'expense';
  amount: number;
  description: string;
  month: number;
  year: number;
  date: number;
  paymentOption?: string;
  category?: string;
  fixed?: boolean;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface Abstract {
  uid: string;
  name: string;
  mount: number;
  year: number;
  budgets: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  actual: {
    revenue: number;
    expenses: number;
    balance: number;
  };
  planned: {
    revenue: number;
    expenses: number;
  };
  variance: {
    revenue: number;
    expenses: number;
  };
  trends: {
    revenue: 'up' | 'down' | 'stable';
    expenses: 'up' | 'down' | 'stable';
  };
  projections: {
    revenue: number;
    expenses: number;
  };
}

export interface AbstractWithAnalytics {
  abstract: Abstract;
  analytics: Analytics;
}

export interface Category {
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOption {
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  uid: string;
  amount: number;
  description: string;
  month: number;
  year: number;
  date: number;
  paymentOption?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  uid: string;
  amount: number;
  description: string;
  month: number;
  year: number;
  date: number;
  category?: string;
  paymentOption?: string;
  fixed: boolean;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}
