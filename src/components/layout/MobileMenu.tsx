import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Upload,
  Settings,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  UserCog,
  History,
  LogOut,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const mainMenuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'bg-blue-500' },
  { title: 'Attendance', href: '/attendance', icon: Clock, color: 'bg-green-500' },
  { title: 'Import Data', href: '/import', icon: Upload, color: 'bg-purple-500' },
  { title: 'Settings', href: '/settings', icon: Settings, color: 'bg-gray-500' },
];

const reportsItems = [
  { title: 'ARC Summary', href: '/reports/arc-summary', icon: FileSpreadsheet, color: 'bg-orange-500' },
  { title: 'Overtime', href: '/reports/overtime', icon: Clock, color: 'bg-cyan-500' },
  { title: 'Partial Day', href: '/reports/partial-day', icon: FileText, color: 'bg-amber-500' },
  { title: 'Regularization', href: '/reports/regularization', icon: ClipboardList, color: 'bg-indigo-500' },
  { title: 'Comprehensive', href: '/reports/comprehensive', icon: TrendingUp, color: 'bg-pink-500' },
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

        {/* Main Navigation Grid */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Main Menu
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {mainMenuItems.map((item) => (
              <MenuCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Reports
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {reportsItems.map((item) => (
              <MenuCard key={item.href} {...item} />
            ))}
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

        {/* Notifications */}
        <Link
          to="/notifications"
          className="flex items-center gap-3 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:bg-muted transition-all"
        >
          <div className="p-3 rounded-xl bg-yellow-500">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <span className="flex-1 font-medium">Notifications</span>
          <Badge variant="destructive" className="text-xs">3</Badge>
        </Link>

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
