import { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { companies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Attendance', href: '/attendance', icon: Clock },
];

const reportsItems = [
  { title: 'ARC Summary', href: '/reports/arc-summary', icon: FileSpreadsheet },
  { title: 'Overtime Report', href: '/reports/overtime', icon: Clock },
  { title: 'Partial Day Report', href: '/reports/partial-day', icon: FileText },
  { title: 'Regularization', href: '/reports/regularization', icon: ClipboardList },
  { title: 'Comprehensive', href: '/reports/comprehensive', icon: FileText },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2 },
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Clock className="h-6 w-6" />
          <span>AMS</span>
        </Link>

        {/* Main Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* Dashboard & Attendance */}
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    isActive(item.href) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}

            {/* Reports Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  isActiveGroup(reportsItems) && 'bg-accent text-accent-foreground'
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-1 p-2">
                  {reportsItems.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md p-3 text-sm hover:bg-accent',
                            isActive(item.href) && 'bg-accent'
                          )}
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Excel Import */}
            <NavigationMenuItem>
              <Link
                to="/import"
                className={cn(
                  'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive('/import') && 'bg-accent text-accent-foreground'
                )}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Link>
            </NavigationMenuItem>

            {/* Management Dropdown (Root/Admin only) */}
            {(user.role === 'root' || user.role === 'admin') && (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    isActiveGroup(managementItems) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Management
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-1 p-2">
                    {managementItems
                      .filter((item) => {
                        if (item.href === '/companies' && user.role !== 'root') return false;
                        return true;
                      })
                      .map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                'flex items-center gap-3 rounded-md p-3 text-sm hover:bg-accent',
                                isActive(item.href) && 'bg-accent'
                              )}
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            {/* Audit Logs (Root only) */}
            {user.role === 'root' && (
              <NavigationMenuItem>
                <Link
                  to="/audit-logs"
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/audit-logs') && 'bg-accent text-accent-foreground'
                  )}
                >
                  <History className="mr-2 h-4 w-4" />
                  Audit Logs
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Company Selector (Root only) */}
          {user.role === 'root' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden xl:inline">All Companies</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Companies</DropdownMenuItem>
                {companies.map((company) => (
                  <DropdownMenuItem key={company.id}>{company.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Company Badge (Admin/User1) */}
          {user.company && (
            <Badge variant="secondary" className="hidden md:inline-flex">
              {user.company}
            </Badge>
          )}

          {/* Role Switcher (Demo) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span className="capitalize">{user.role}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole('root')}>
                Root Administrator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')}>
                Company Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('user1')}>
                Supervisor (User1)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden xl:inline-block text-sm font-medium">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
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
