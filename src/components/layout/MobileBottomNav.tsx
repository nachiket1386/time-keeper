import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Reports', href: '/reports', icon: FileText },
  { title: 'Import', href: '/import', icon: Upload },
];

export function MobileBottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/reports') {
      return location.pathname.startsWith('/reports');
    }
    return location.pathname === href;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.filter((item) => item.href !== '/import' || user?.role === 'root' || user?.role === 'admin').map((item) => (
            <Link
              key={item.href}
              to={item.href === '/reports' ? '/reports/arc-summary' : item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          ))}

          {/* More Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
              'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
