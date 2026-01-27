import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Settings,
  Building2,
  UserCog,
  History,
  LogOut,
  Bell,
  CheckCircle,
  ClipboardList,
  FileSpreadsheet,
  Download,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const menuItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Notifications', href: '/notifications', icon: Bell },
  { title: 'Users', href: '/users', icon: Users, adminOnly: true },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog, adminOnly: true },
  { title: 'Audit Logs', href: '/audit-logs', icon: History, rootOnly: true },
];

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (href: string) => location.pathname === href;

  const filteredItems = menuItems.filter((item) => {
    if (item.rootOnly && user.role !== 'root') return false;
    if (item.adminOnly && user.role === 'user1') return false;
    return true;
  });

  const MenuCard = ({ href, icon: Icon, title }: { href: string; icon: any; title: string }) => (
    <Link
      to={href}
      onClick={() => onOpenChange(false)}
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all min-h-[100px]',
        isActive(href)
          ? 'bg-primary/15 border-2 border-primary/30'
          : 'bg-muted/50 border-2 border-transparent hover:bg-muted active:scale-95'
      )}
    >
      <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
      <span className="text-sm font-medium text-center">{title}</span>
    </Link>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Menu</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {filteredItems.map((item) => (
            <MenuCard key={item.href} {...item} />
          ))}
          
          {/* Sign Out Card */}
          <button
            onClick={() => {
              logout();
              onOpenChange(false);
            }}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all min-h-[100px] bg-destructive/10 border-2 border-transparent hover:bg-destructive/15 active:scale-95"
          >
            <LogOut className="h-7 w-7 text-destructive" strokeWidth={1.5} />
            <span className="text-sm font-medium text-destructive">Sign Out</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
