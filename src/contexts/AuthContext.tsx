import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'root' | 'admin' | 'user1';

export interface User {
  id: string;
  name: string;
  username: string;
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
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users with credentials for demo
const mockCredentials: Array<{ username: string; password: string; user: User }> = [
  {
    username: 'root',
    password: 'root123',
    user: {
      id: 'root-001',
      name: 'System Administrator',
      username: 'root',
      role: 'root',
    },
  },
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 'admin-001',
      name: 'Rajesh Kumar',
      username: 'admin',
      role: 'admin',
      company: 'TechCorp Industries',
      companyId: 'company-001',
    },
  },
  {
    username: 'supervisor',
    password: 'user123',
    user: {
      id: 'user1-001',
      name: 'Priya Sharma',
      username: 'supervisor',
      role: 'user1',
      company: 'TechCorp Industries',
      companyId: 'company-001',
      accessFromDate: '2024-01-01',
      accessToDate: '2024-12-31',
      assignedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005'],
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find matching credentials
    const match = mockCredentials.find(
      cred => cred.username.toLowerCase() === username.toLowerCase() && cred.password === password
    );
    
    if (match) {
      setUser(match.user);
      return { success: true };
    }
    
    // Check if username exists but wrong password
    const usernameExists = mockCredentials.some(
      cred => cred.username.toLowerCase() === username.toLowerCase()
    );
    
    if (usernameExists) {
      return { success: false, error: 'Invalid password' };
    }
    
    return { success: false, error: 'User not found' };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const match = mockCredentials.find(cred => cred.user.role === role);
    if (match) {
      setUser(match.user);
    }
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
