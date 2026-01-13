import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'root' | 'admin' | 'user1';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  companyId?: string;
  accessFromDate?: string;
  accessToDate?: string;
  assignedEmployees?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  root: {
    id: 'root-001',
    name: 'System Administrator',
    email: 'root@ams.com',
    role: 'root',
  },
  admin: {
    id: 'admin-001',
    name: 'Rajesh Kumar',
    email: 'admin@techcorp.com',
    role: 'admin',
    company: 'TechCorp Industries',
    companyId: 'company-001',
  },
  user1: {
    id: 'user1-001',
    name: 'Priya Sharma',
    email: 'priya@techcorp.com',
    role: 'user1',
    company: 'TechCorp Industries',
    companyId: 'company-001',
    accessFromDate: '2024-01-01',
    accessToDate: '2024-12-31',
    assignedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005'],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === 'demo123') {
      setUser(mockUsers[role]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
