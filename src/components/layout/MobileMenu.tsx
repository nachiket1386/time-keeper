import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Settings,
  Building2,
  UserCog,
  History,
  LogOut,
  Bell,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';

const menuItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog },
  { title: 'Audit Logs', href: '/audit-logs', icon: History, rootOnly: true },
];

interface MobileMenuProps {
  onClose?: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { user, switchRole, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => location.pathname === href;

  const MenuItem = ({ href, icon: Icon, title, badge }: { href: string; icon: any; title: string; badge?: number }) => (
    <SheetClose asChild>
      <Link
        to={href}
        className={cn(
          'flex items-center justify-between py-3.5 px-4 rounded-xl transition-colors',
          isActive(href)
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted active:bg-muted'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant="destructive" className="h-5 min-w-5 text-[10px] px-1.5">
              {badge}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Link>
    </SheetClose>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* User Profile Card */}
      <div className="p-4 bg-primary/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{user.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs capitalize">
                {user.role}
              </Badge>
              {user.company && (
                <span className="text-xs text-muted-foreground truncate">{user.company}</span>
              )}
            </div>
          </div>
        </div>

        {/* Role Switch */}
        <div className="flex gap-2 mt-4">
          {['root', 'admin', 'user1'].map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role as 'root' | 'admin' | 'user1')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors',
                user.role === role 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-muted'
              )}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.href} {...item} />
        ))}

        {/* Management Section */}
        {(user.role === 'root' || user.role === 'admin') && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                Management
              </p>
            </div>
            {managementItems
              .filter((item) => !item.rootOnly || user.role === 'root')
              .map((item) => (
                <MenuItem key={item.href} {...item} />
              ))}
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-destructive hover:bg-destructive/10 active:bg-destructive/15 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
