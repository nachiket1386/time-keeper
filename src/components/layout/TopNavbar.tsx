import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Upload,
  Settings,
  Bell,
  ChevronDown,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  UserCog,
  History,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { companies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const navTabs = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Import', href: '/import', icon: Upload },
];

const reportsItems = [
  { title: 'Attendance', href: '/attendance', icon: Clock },
  { title: 'ARC Summary', href: '/reports/arc-summary', icon: FileSpreadsheet },
  { title: 'Overtime', href: '/reports/overtime', icon: Clock },
  { title: 'Partial Day', href: '/reports/partial-day', icon: FileText },
  { title: 'Regularization', href: '/reports/regularization', icon: ClipboardList },
  { title: 'Comprehensive', href: '/reports/comprehensive', icon: TrendingUp },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog },
];

export function TopNavbar() {
  const { user, switchRole, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => location.pathname === href;
  const isActiveGroup = (items: { href: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.href));

  const TabLink = ({ href, icon: Icon, title }: { href: string; icon: any; title: string }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium',
              isActive(href)
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:block text-[10px]">{title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="sm:hidden">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="flex h-14 items-center px-4 gap-2">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden md:block">AMS</span>
        </Link>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          {navTabs.map((item) => (
            <TabLink key={item.href} {...item} />
          ))}

          {/* Reports Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium',
                  isActiveGroup(reportsItems)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:flex items-center gap-0.5 text-[10px]">
                  Reports <ChevronDown className="h-2.5 w-2.5" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {reportsItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link to={item.href} className={cn('flex items-center gap-2', isActive(item.href) && 'bg-accent')}>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Management Dropdown */}
          {(user.role === 'root' || user.role === 'admin') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium',
                    isActiveGroup(managementItems)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:flex items-center gap-0.5 text-[10px]">
                    Manage <ChevronDown className="h-2.5 w-2.5" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {managementItems
                  .filter((item) => !item.rootOnly || user.role === 'root')
                  .map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className={cn('flex items-center gap-2', isActive(item.href) && 'bg-accent')}>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                {user.role === 'root' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/audit-logs" className={cn('flex items-center gap-2', isActive('/audit-logs') && 'bg-accent')}>
                        <History className="h-4 w-4 text-muted-foreground" />
                        Audit Logs
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Company Selector (Root) */}
          {user.role === 'root' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden lg:inline text-xs">All</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">All Companies</DropdownMenuItem>
                {companies.map((company) => (
                  <DropdownMenuItem key={company.id} className="text-xs">{company.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 h-8 px-2 text-xs">
                <span className="capitalize">{user.role}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole('root')} className="text-xs">Root</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')} className="text-xs">Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('user1')} className="text-xs">User1</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-8 pl-1 pr-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-xs font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-xs">
                <Link to="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive text-xs">
                <LogOut className="mr-2 h-3 w-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}