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
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground">
            3
          </span>
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
