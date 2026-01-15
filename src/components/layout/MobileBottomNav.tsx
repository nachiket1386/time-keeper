import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  FileText,
  Upload,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Attendance', href: '/attendance', icon: Clock },
  { title: 'Reports', href: '/reports', icon: FileText },
  { title: 'Import', href: '/import', icon: Upload },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/reports') {
      return location.pathname.startsWith('/reports');
    }
    return location.pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
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
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <MobileMenu />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
