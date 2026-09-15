import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export type UserRole = 'root' | 'admin' | 'user1' | 'user2';

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
  assignedEmployeeCodes?: string[];
  employeeId?: string;
  employeeCode?: string;
  employeeName?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Synthetic-email convention so users can log in with just a username.
const USERNAME_DOMAIN = 'app.local';
const toEmail = (username: string) => `${username.trim().toLowerCase()}@${USERNAME_DOMAIN}`;

async function loadProfile(userId: string): Promise<User | null> {
  const [{ data: profile }, { data: roles }, { data: linkedEmployee }, { data: supervisedEmployees }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, username, full_name, company_id, companies(name)')
      .eq('id', userId)
      .maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', userId),
    supabase.from('employees')
      .select('id, employee_code, full_name, company_id, user_id')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.from('employees')
      .select('id, employee_code')
      .eq('supervisor_id', userId),
  ]);

  if (!profile) return null;

  // Highest-privilege role wins: root > admin > user1 > user2
  const roleSet = new Set((roles ?? []).map((r) => r.role as UserRole));
  const role: UserRole = roleSet.has('root')
    ? 'root'
    : roleSet.has('admin')
      ? 'admin'
      : roleSet.has('user1')
        ? 'user1'
        : 'user2';

  const assignedEmployeeRows = role === 'user1' ? supervisedEmployees ?? [] : [];
  const assignedEmployees = role === 'user2' && linkedEmployee
    ? [linkedEmployee.id]
    : assignedEmployeeRows.map((employee: { id: string }) => employee.id);
  const assignedEmployeeCodes = role === 'user2' && linkedEmployee
    ? [linkedEmployee.employee_code]
    : assignedEmployeeRows.map((employee: { employee_code: string }) => employee.employee_code);

  return {
    id: profile.id,
    name: profile.full_name || profile.username,
    username: profile.username,
    role,
    company: (profile as any).companies?.name,
    companyId: profile.company_id ?? linkedEmployee?.company_id ?? undefined,
    assignedEmployees,
    assignedEmployeeCodes,
    employeeId: linkedEmployee?.id,
    employeeCode: linkedEmployee?.employee_code,
    employeeName: linkedEmployee?.full_name,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Register listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer DB fetch to avoid deadlocking the auth callback
        setTimeout(() => {
          loadProfile(newSession.user.id).then(setUser);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // 2) Then check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        loadProfile(existing.user.id).then((u) => {
          setUser(u);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(username),
      password,
    });
    if (error) {
      return {
        success: false,
        error: error.message.includes('Invalid login')
          ? 'Invalid username or password'
          : error.message,
      };
    }
    return { success: true };
  };

  const signup = async (username: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email: toEmail(username),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username.trim().toLowerCase(),
          full_name: fullName,
        },
      },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Username already taken' };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // No-op kept for backwards compatibility with existing pages
  const switchRole = (_role: UserRole) => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        loading,
        login,
        signup,
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
