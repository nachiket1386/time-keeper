import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TopNavbar } from './TopNavbar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
          {children}
        </div>
      </main>

      {/* Mobile/Tablet: Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
