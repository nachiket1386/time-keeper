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
import { cn } from '@/lib/utils';

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

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-lg">
      <div className="flex h-14 items-center px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 mr-8">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white hidden md:block">AMS</span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center h-full">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-2 px-5 h-full text-sm font-medium transition-colors border-b-2',
              isActive('/dashboard')
                ? 'text-white border-white bg-white/10'
                : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Import */}
          <Link
            to="/import"
            className={cn(
              'flex items-center gap-2 px-5 h-full text-sm font-medium transition-colors border-b-2',
              isActive('/import')
                ? 'text-white border-white bg-white/10'
                : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
            )}
          >
            <Upload className="h-4 w-4" />
            Import
          </Link>

          {/* Reports Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2 px-5 h-14 text-sm font-medium transition-colors border-b-2',
                  isActiveGroup(reportsItems)
                    ? 'text-white border-white bg-white/10'
                    : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
                )}
              >
                <FileText className="h-4 w-4" />
                Reports
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border shadow-xl z-50">
              {reportsItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link 
                    to={item.href} 
                    className={cn(
                      'flex items-center gap-3 py-2.5 cursor-pointer',
                      isActive(item.href) && 'bg-accent'
                    )}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span>{item.title}</span>
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
                    'flex items-center gap-2 px-5 h-14 text-sm font-medium transition-colors border-b-2',
                    isActiveGroup(managementItems)
                      ? 'text-white border-white bg-white/10'
                      : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
                  )}
                >
                  <Users className="h-4 w-4" />
                  Manage
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-card border shadow-xl z-50">
                {managementItems
                  .filter((item) => !item.rootOnly || user.role === 'root')
                  .map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        to={item.href} 
                        className={cn(
                          'flex items-center gap-3 py-2.5 cursor-pointer',
                          isActive(item.href) && 'bg-accent'
                        )}
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                {user.role === 'root' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/audit-logs" 
                        className={cn(
                          'flex items-center gap-3 py-2.5 cursor-pointer',
                          isActive('/audit-logs') && 'bg-accent'
                        )}
                      >
                        <History className="h-4 w-4 text-primary" />
                        <span>Audit Logs</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Company Selector (Root) */}
          {user.role === 'root' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white/80 hover:text-white hover:bg-white/10">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm">All Companies</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-card border shadow-xl z-50">
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Companies</DropdownMenuItem>
                {companies.map((company) => (
                  <DropdownMenuItem key={company.id}>{company.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Role Badge */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-white/80 hover:text-white hover:bg-white/10 text-sm">
                <span className="capitalize px-2 py-0.5 bg-white/20 rounded text-xs font-medium">{user.role}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border shadow-xl z-50">
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole('root')}>Root Administrator</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')}>Company Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('user1')}>Supervisor (User1)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-white/80 hover:text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3 text-white hover:bg-white/10">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  {user.company && <span className="text-[10px] text-white/60">{user.company}</span>}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border shadow-xl z-50">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}