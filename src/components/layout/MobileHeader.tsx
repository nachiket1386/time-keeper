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
          size="sm"
          className="h-9 min-w-[3.25rem] gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 text-primary hover:bg-primary/15 hover:text-primary [&_svg]:size-5"
          asChild
        >
          <Link to="/notifications" aria-label="Notifications, 3 total">
            <Bell aria-hidden="true" />
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold leading-none text-destructive-foreground">
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
