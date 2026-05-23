export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  memberNumber: string;
  fullName: string;
  phone?: string;
  address?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  balance?: number;
}

export interface Deposit {
  id: string;
  amount: string;
  date: string;
  description?: string;
  memberId: string;
  member?: { id: string; fullName: string; memberNumber: string };
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: string;
  date: string;
  description?: string;
  memberId: string;
  member?: { id: string; fullName: string; memberNumber: string };
  createdAt: string;
}

export interface DueRecord {
  id: string;
  amount: string;
  dueDate: string;
  paidDate?: string;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  memberId: string;
  member?: { id: string; fullName: string; memberNumber: string };
  createdAt: string;
}

export interface DashboardSummary {
  members: {
    total: number;
    active: number;
  };
  financials: {
    totalDeposits: number;
    totalWithdrawals: number;
    netBalance: number;
    totalTransactions: number;
  };
  dues: {
    totalCollected: number;
    totalPending: number;
    overdueCount: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
