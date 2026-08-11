import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Upload,
  FileText,
  Clock,
  CalendarCheck,
  RefreshCw,
  KeyRound,
  Settings,
  Shield,
  History,
  Database,
  ChevronDown,
  ChevronRight,
  UserCog,
  FolderOpen,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Attendance',
    url: '/attendance',
    icon: ClipboardList,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Excel Import',
    url: '/excel-import',
    icon: Upload,
    roles: ['root', 'admin'],
  },
];

const reportsItems: NavItem[] = [
  {
    title: 'ARC Summary',
    url: '/reports/arc-summary',
    icon: FileText,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Overtime Report',
    url: '/reports/overtime',
    icon: Clock,
    roles: ['root', 'admin'],
  },
  {
    title: 'Partial Day Report',
    url: '/reports/partial-day',
    icon: CalendarCheck,
    roles: ['root', 'admin'],
  },
  {
    title: 'Regularization',
    url: '/reports/regularization',
    icon: RefreshCw,
    roles: ['root', 'admin'],
  },
];

const requestItems: NavItem[] = [
  {
    title: 'Overtime Requests',
    url: '/requests/overtime',
    icon: Clock,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Partial Day',
    url: '/requests/partial-day',
    icon: CalendarCheck,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Regularization',
    url: '/requests/regularization',
    icon: RefreshCw,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Access Requests',
    url: '/requests/access',
    icon: KeyRound,
    roles: ['admin', 'user1'],
  },
];

const managementItems: NavItem[] = [
  {
    title: 'Users',
    url: '/management/users',
    icon: Users,
    roles: ['root', 'admin'],
  },
  {
    title: 'Companies',
    url: '/management/companies',
    icon: Building2,
    roles: ['root'],
  },
  {
    title: 'Employees',
    url: '/management/employees',
    icon: UserCog,
    roles: ['root', 'admin'],
  },
  {
    title: 'Master Data',
    url: '/management/master-data',
    icon: FolderOpen,
    roles: ['root', 'admin'],
  },
];

const systemItems: NavItem[] = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    roles: ['root', 'admin', 'user1'],
  },
  {
    title: 'Audit Logs',
    url: '/audit-logs',
    icon: History,
    roles: ['root', 'admin'],
  },
  {
    title: 'Backup & Restore',
    url: '/backup',
    icon: Database,
    roles: ['root'],
  },
];

function NavSection({
  title,
  items,
  userRole,
}: {
  title: string;
  items: NavItem[];
  userRole: UserRole;
}) {
  const location = useLocation();
  const filteredItems = items.filter((item) => item.roles.includes(userRole));

  if (filteredItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    'transition-colors',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  )}
                >
                  <NavLink to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          {state !== 'collapsed' && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">AMS</span>
              <span className="text-xs text-sidebar-foreground/60">Attendance System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <NavSection title="Main" items={navItems} userRole={user.role} />
        <NavSection title="Reports" items={reportsItems} userRole={user.role} />
        <NavSection title="Requests" items={requestItems} userRole={user.role} />
        <NavSection title="Management" items={managementItems} userRole={user.role} />
        <NavSection title="System" items={systemItems} userRole={user.role} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {state !== 'collapsed' && (
            <div className="flex flex-1 flex-col truncate">
              <span className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</span>
              <span className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
