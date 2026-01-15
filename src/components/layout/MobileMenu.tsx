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
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const reportsItems = [
  { title: 'ARC Summary', href: '/reports/arc-summary', icon: FileSpreadsheet },
  { title: 'Overtime Report', href: '/reports/overtime', icon: Clock },
  { title: 'Partial Day Report', href: '/reports/partial-day', icon: FileText },
  { title: 'Regularization', href: '/reports/regularization', icon: ClipboardList },
  { title: 'Comprehensive', href: '/reports/comprehensive', icon: FileText },
];

const managementItems = [
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Companies', href: '/companies', icon: Building2, rootOnly: true },
  { title: 'Employees', href: '/employees', icon: UserCog },
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

  const MenuItem = ({ href, icon: Icon, title }: { href: string; icon: any; title: string }) => (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        isActive(href)
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-muted'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1 font-medium">{title}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );

  return (
    <ScrollArea className="h-full py-4">
      {/* User Profile Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{user.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {user.role}
              </Badge>
              {user.company && (
                <span className="text-xs text-muted-foreground">{user.company}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => switchRole('root')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-colors',
              user.role === 'root' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            )}
          >
            <Users className="h-4 w-4" />
            Root
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-colors',
              user.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            )}
          >
            <Building2 className="h-4 w-4" />
            Admin
          </button>
          <button
            onClick={() => switchRole('user1')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-colors',
              user.role === 'user1' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            )}
          >
            <UserCog className="h-4 w-4" />
            User1
          </button>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Navigation */}
      <div className="px-4 space-y-1">
        <MenuItem href="/dashboard" icon={LayoutDashboard} title="Dashboard" />
        <MenuItem href="/attendance" icon={Clock} title="Attendance" />
        <MenuItem href="/import" icon={Upload} title="Import Data" />

        {/* Reports Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="reports" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted hover:no-underline">
              <FileText className="h-5 w-5" />
              <span className="flex-1 text-left font-medium">Reports</span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 space-y-1 pb-0">
              {reportsItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Management Accordion (Admin/Root only) */}
          {(user.role === 'root' || user.role === 'admin') && (
            <AccordionItem value="management" className="border-none">
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted hover:no-underline">
                <Users className="h-5 w-5" />
                <span className="flex-1 text-left font-medium">Management</span>
              </AccordionTrigger>
              <AccordionContent className="pl-6 space-y-1 pb-0">
                {managementItems
                  .filter((item) => !item.rootOnly || user.role === 'root')
                  .map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Audit Logs (Root only) */}
        {user.role === 'root' && (
          <MenuItem href="/audit-logs" icon={History} title="Audit Logs" />
        )}

        <MenuItem href="/settings" icon={Settings} title="Settings" />
      </div>

      <Separator className="my-4" />

      {/* Notifications */}
      <div className="px-4">
        <Link
          to="/notifications"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="flex-1 font-medium">Notifications</span>
          <Badge variant="destructive" className="text-xs">3</Badge>
        </Link>
      </div>

      <Separator className="my-4" />

      {/* Logout */}
      <div className="px-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </ScrollArea>
  );
}
