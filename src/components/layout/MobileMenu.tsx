import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Settings,
  Building2,
  UserCog,
  History,
  LogOut,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SheetClose } from '@/components/ui/sheet';

const quickAccessItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog },
  { title: 'Audit Logs', href: '/audit-logs', icon: History, rootOnly: true },
];

export function MobileMenu() {
  const { user, switchRole, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => location.pathname === href;

  const MenuCard = ({ href, icon: Icon, title, badge }: { href: string; icon: any; title: string; badge?: number }) => (
    <SheetClose asChild>
      <Link
        to={href}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all',
          isActive(href)
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-card border border-border hover:border-primary/30 hover:shadow-md active:scale-95'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">{title}</span>
        {badge && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 text-[10px] px-1.5">
            {badge}
          </Badge>
        )}
      </Link>
    </SheetClose>
  );

  return (
    <div className="p-4 space-y-5">
      {/* User Profile */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role} {user.company && `• ${user.company}`}</p>
        </div>
      </div>

      {/* Role Switch */}
      <div className="grid grid-cols-3 gap-2">
        {['root', 'admin', 'user1'].map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role as 'root' | 'admin' | 'user1')}
            className={cn(
              'py-2.5 rounded-xl text-xs font-medium transition-all',
              user.role === role 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card border border-border hover:bg-muted active:scale-95'
            )}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Quick Access
        </p>
        <div className="grid grid-cols-4 gap-3">
          {quickAccessItems.map((item) => (
            <MenuCard key={item.href} {...item} />
          ))}
        </div>
      </div>

      {/* Management Cards */}
      {(user.role === 'root' || user.role === 'admin') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Management
          </p>
          <div className="grid grid-cols-4 gap-3">
            {managementItems
              .filter((item) => !item.rootOnly || user.role === 'root')
              .map((item) => (
                <MenuCard key={item.href} {...item} />
              ))}
          </div>
        </div>
      )}

      {/* Sign Out */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-destructive bg-destructive/10 hover:bg-destructive/15 active:scale-[0.98] transition-all"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
