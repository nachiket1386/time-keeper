import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Settings,
  Building2,
  UserCog,
  History,
  LogOut,
  Bell,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const menuItems = [
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Notifications', href: '/notifications', icon: Bell, hasBadge: true },
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

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => location.pathname === href;

  const filteredItems = menuItems.filter((item) => {
    if (item.rootOnly && user.role !== 'root') return false;
    if (item.adminOnly && user.role !== 'root' && user.role !== 'admin') return false;
    return true;
  });

  const CARD_WIDTH = 'w-full';

  const MenuCard = ({ href, icon: Icon, title, hasBadge }: { href: string; icon: any; title: string; hasBadge?: boolean }) => (
    <Link
      to={href}
      onClick={() => onOpenChange(false)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl transition-all min-h-[90px]',
        CARD_WIDTH,
        isActive(href)
          ? 'bg-primary/15 border-2 border-primary/30 shadow-sm'
          : 'bg-muted/60 border-2 border-transparent hover:bg-muted hover:border-border active:scale-95'
      )}
    >
      <Icon className={cn("h-6 w-6", isActive(href) ? "text-primary" : "text-muted-foreground")} strokeWidth={1.5} />
      <span className={cn("text-xs font-medium text-center", isActive(href) ? "text-primary" : "text-foreground")}>{title}</span>
      {hasBadge && (
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-[10px]">
          3
        </Badge>
      )}
    </Link>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 top-auto bottom-16 translate-y-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom rounded-3xl w-[calc(100%-1.5rem)]">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold truncate">{user.name}</DialogTitle>
              <p className="text-xs text-muted-foreground capitalize">{user.role} {user.company && `• ${user.company}`}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-wrap justify-center gap-2.5 mt-3">
          {filteredItems.map((item) => (
            <MenuCard key={item.href} {...item} />
          ))}

          {/* Sign Out Card */}
          <button
            onClick={() => {
              logout();
              onOpenChange(false);
            }}
            className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl transition-all min-h-[90px] w-[calc((100%-1.25rem)/3)] bg-destructive/10 border-2 border-transparent hover:bg-destructive/15 active:scale-95"
          >
            <LogOut className="h-6 w-6 text-destructive" strokeWidth={1.5} />
            <span className="text-xs font-medium text-destructive">Sign Out</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
