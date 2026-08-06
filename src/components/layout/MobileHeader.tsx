import { Bell, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function MobileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
        <Clock className="h-5 w-5" />
        <span>AMS</span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {user.company && (
          <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
            {user.company}
          </Badge>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary border border-primary/10 overflow-visible"
          asChild
        >
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
            <span className="pointer-events-none absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-card">
              3
            </span>
          </Link>
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
