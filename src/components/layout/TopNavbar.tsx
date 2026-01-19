import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Upload,
  Settings,
  ChevronDown,
  Building2,
  UserCog,
  History,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/50 shadow-sm">
      <div className="flex h-12 items-center px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 mr-6">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg text-primary">AMS</span>
        </Link>

        {/* Centered Navigation */}
        <nav className="flex-1 flex items-center justify-center gap-1">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all',
              isActive('/dashboard')
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Import */}
          <Link
            to="/import"
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all',
              isActive('/import')
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Upload className="h-4 w-4" />
            Upload Data
          </Link>

          {/* Reports */}
          <Link
            to="/reports"
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all',
              isActive('/reports')
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <FileText className="h-4 w-4" />
            Data
          </Link>

          {/* Management Dropdown */}
          {(user.role === 'root' || user.role === 'admin') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all',
                    isActiveGroup(managementItems)
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 bg-card border shadow-xl z-50">
                {managementItems
                  .filter((item) => !item.rootOnly || user.role === 'root')
                  .map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        to={item.href} 
                        className={cn(
                          'flex items-center gap-3 cursor-pointer',
                          isActive(item.href) && 'bg-accent'
                        )}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
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
                          'flex items-center gap-3 cursor-pointer',
                          isActive('/audit-logs') && 'bg-accent'
                        )}
                      >
                        <History className="h-4 w-4 text-muted-foreground" />
                        <span>Audit Logs</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Right Side - User */}
        <div className="flex items-center gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 hover:bg-muted">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border shadow-xl z-50">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole('root')}>Switch to Root</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')}>Switch to Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('user1')}>Switch to User1</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Icon */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}