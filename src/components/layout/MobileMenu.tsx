import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Settings,
  Building2,
  UserCog,
  History,
  LogOut,
  Bell,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Items that are shown in the bottom navbar (to exclude from More menu)
const bottomNavItems = ['/dashboard', '/attendance', '/reports', '/import'];

// Additional menu items NOT in bottom navbar
const additionalMenuItems = [
  { title: 'Settings', href: '/settings', icon: Settings, color: 'bg-slate-500' },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users, color: 'bg-teal-500' },
  { title: 'Companies', href: '/companies', icon: Building2, color: 'bg-red-500', rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog, color: 'bg-emerald-500' },
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

  const MenuCard = ({ href, icon: Icon, title, color }: { href: string; icon: any; title: string; color: string }) => (
    <Link
      to={href}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 border-2',
        isActive(href)
          ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
          : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:shadow-md'
      )}
    >
      <div className={cn(
        'p-3 rounded-xl',
        isActive(href) ? 'bg-primary-foreground/20' : color
      )}>
        <Icon className={cn('h-6 w-6', isActive(href) ? 'text-primary-foreground' : 'text-white')} />
      </div>
      <span className={cn(
        'text-xs font-medium text-center leading-tight',
        isActive(href) ? 'text-primary-foreground' : 'text-foreground'
      )}>{title}</span>
    </Link>
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-lg">{user.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary border-primary/20">
                {user.role}
              </Badge>
              {user.company && (
                <span className="text-xs text-muted-foreground">{user.company}</span>
              )}
            </div>
          </div>
        </div>

        {/* Role Switch */}
        <div className="grid grid-cols-3 gap-2">
          {['root', 'admin', 'user1'].map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role as 'root' | 'admin' | 'user1')}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all border-2',
                user.role === role 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'bg-card border-border hover:border-primary/50 hover:bg-muted'
              )}
            >
              {role === 'root' && <Users className="h-4 w-4" />}
              {role === 'admin' && <Building2 className="h-4 w-4" />}
              {role === 'user1' && <UserCog className="h-4 w-4" />}
              <span className="capitalize">{role}</span>
            </button>
          ))}
        </div>

        <Separator />

        {/* Additional Menu Items (NOT in bottom navbar) */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Quick Access
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {additionalMenuItems.map((item) => (
              <MenuCard key={item.href} {...item} />
            ))}
            {/* Notifications */}
            <Link
              to="/notifications"
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 border-2 relative',
                isActive('/notifications')
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                  : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:shadow-md'
              )}
            >
              <div className={cn(
                'p-3 rounded-xl',
                isActive('/notifications') ? 'bg-primary-foreground/20' : 'bg-amber-500'
              )}>
                <Bell className={cn('h-6 w-6', isActive('/notifications') ? 'text-primary-foreground' : 'text-white')} />
              </div>
              <span className={cn(
                'text-xs font-medium text-center leading-tight',
                isActive('/notifications') ? 'text-primary-foreground' : 'text-foreground'
              )}>Notifications</span>
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 text-[10px] px-1.5">3</Badge>
            </Link>
          </div>
        </div>

        {/* Management Grid (Admin/Root only) */}
        {(user.role === 'root' || user.role === 'admin') && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Management
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {managementItems
                .filter((item) => !item.rootOnly || user.role === 'root')
                .map((item) => (
                  <MenuCard key={item.href} {...item} />
                ))}
              {user.role === 'root' && (
                <MenuCard 
                  href="/audit-logs" 
                  icon={History} 
                  title="Audit Logs" 
                  color="bg-slate-600" 
                />
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 p-4 rounded-xl w-full bg-destructive/5 border-2 border-destructive/20 text-destructive hover:bg-destructive/10 transition-all"
        >
          <div className="p-3 rounded-xl bg-destructive/20">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </ScrollArea>
  );
}