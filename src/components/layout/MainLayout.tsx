import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TopNavbar } from './TopNavbar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import MyAttendance from '@/pages/MyAttendance';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const { pathname } = useLocation();

  if (loading || (isAuthenticated && !user)) return <p role="status" className="p-6">Loading account…</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const individualAttendance = user?.role === 'user2' && (pathname === '/dashboard' || pathname === '/attendance' || pathname.startsWith('/reports'));
  if (user?.role === 'user2' && !individualAttendance && pathname !== '/profile' && pathname !== '/settings') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: Top Navigation */}
      <div className="hidden lg:block">
        <TopNavbar />
      </div>

      {/* Mobile/Tablet: Compact Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="pb-20 lg:pb-6">
        <div className="p-4 lg:p-6">
          {individualAttendance ? <MyAttendance /> : children}
        </div>
      </main>

      {/* Mobile/Tablet: Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
