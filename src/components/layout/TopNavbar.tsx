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
  UserCog,
  History,
  LogOut,
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

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog },
];

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Import', href: '/import', icon: Upload },
  { title: 'Reports', href: '/reports', icon: FileText },
];

export function TopNavbar() {
   const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');
  const isActiveGroup = (items: { href: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.href));

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-2 lg:gap-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden md:block tracking-tight">AMS</span>
          </Link>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.filter((item) => item.href !== '/import' || user.role === 'root' || user.role === 'admin').map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.title}</span>
              </Link>
            ))}

            {/* Management Dropdown */}
            {(user.role === 'root' || user.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all',
                      isActiveGroup(managementItems)
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden lg:inline">Manage</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 bg-card/95 backdrop-blur-md border border-border/60 shadow-xl z-50">
                  {managementItems
                    .filter((item) => !item.rootOnly || user.role === 'root')
                    .map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 py-2.5 cursor-pointer rounded-md',
                            isActive(item.href) && 'bg-accent/50'
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
                            'flex items-center gap-3 py-2.5 cursor-pointer rounded-md',
                            isActive('/audit-logs') && 'bg-accent/50'
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
        </div>

        {/* Right: Context & User Controls */}
        <div className="flex items-center gap-1 lg:gap-3">
          {/* Company / Role Context */}
          <div className="hidden xl:flex flex-col items-end border-r border-border/60 pr-4">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider text-right truncate max-w-[160px]">
              {user.role === 'root' ? 'All Companies' : user.company || 'No Company'}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role === 'root' ? 'System Administrator' : user.role}
            </span>
          </div>

          {/* Company Selector (Root) */}
          {user.role === 'root' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm">All Companies</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-card/95 backdrop-blur-md border border-border/60 shadow-xl z-50">
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Companies</DropdownMenuItem>
                {companies.map((company) => (
                  <DropdownMenuItem key={company.id}>{company.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <span className="capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {user.role === 'user2' ? 'Individual (User2)' : user.role}
          </span>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary border border-primary/10 shadow-sm overflow-visible"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              <span className="pointer-events-none absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-card">
                3
              </span>
            </Link>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-1.5 pr-3 text-foreground hover:bg-muted/60 rounded-full h-10">
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium leading-tight">{user.name.split(' ')[0]}</span>
                  {user.company && <span className="text-[10px] text-muted-foreground leading-tight">{user.company}</span>}
                </div>
                <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border border-border/60 shadow-xl z-50">
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
