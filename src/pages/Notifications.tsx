import { useState } from 'react';
import { Bell, Check, CheckCheck, Clock, FileText, Users, AlertCircle, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SwipeableCard } from '@/components/shared/SwipeableCard';
import { cn } from '@/lib/utils';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';

interface Notification {
  id: string;
  type: 'approval' | 'import' | 'system' | 'user';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval',
    title: 'Overtime Request Pending',
    message: '5 overtime requests are waiting for your approval',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'import',
    title: 'Import Completed',
    message: 'Attendance data for January 2024 has been imported successfully',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Backup Completed',
    message: 'Automatic backup was completed successfully at 2:00 AM',
    time: '8 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'user',
    title: 'New User Added',
    message: 'A new supervisor account has been created for your company',
    time: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'approval',
    title: 'Regularization Request',
    message: '3 regularization requests need your attention',
    time: '2 days ago',
    read: true,
  },
];

const typeConfig = {
  approval: { icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600' },
  import: { icon: FileText, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  system: { icon: AlertCircle, bg: 'bg-blue-100', color: 'text-blue-600' },
  user: { icon: Users, bg: 'bg-purple-100', color: 'text-purple-600' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const isMobile = useIsMobileOrTablet();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter((n) => !n.read);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const NotificationContent = ({ notification }: { notification: Notification }) => {
    const config = typeConfig[notification.type];
    const Icon = config.icon;

    return (
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={cn('p-3 rounded-2xl shrink-0', config.bg)}>
            <Icon className={cn('h-5 w-5', config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.time}
            </p>
          </div>
        </div>
      </CardContent>
    );
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Swipe Hint (mobile only) */}
      {isMobile && filteredNotifications.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          ← Swipe left to delete • Swipe right to mark as read →
        </p>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications to show</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            // Mobile: Use swipeable cards
            if (isMobile) {
              return (
                <SwipeableCard
                  key={notification.id}
                  leftActions={
                    !notification.read
                      ? [
                          {
                            icon: <Check className="h-5 w-5 text-white" />,
                            label: 'Read',
                            color: 'bg-emerald-500',
                            onClick: () => markAsRead(notification.id),
                          },
                        ]
                      : []
                  }
                  rightActions={[
                    {
                      icon: <Trash2 className="h-5 w-5 text-white" />,
                      label: 'Delete',
                      color: 'bg-destructive',
                      onClick: () => deleteNotification(notification.id),
                    },
                  ]}
                  className={cn(
                    'border',
                    !notification.read && 'border-l-4 border-l-primary'
                  )}
                >
                  <NotificationContent notification={notification} />
                </SwipeableCard>
              );
            }

            // Desktop: Regular cards with hover actions
            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all hover:shadow-md cursor-pointer group',
                  !notification.read && 'border-l-4 border-l-primary bg-primary/5'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={cn('p-3 rounded-2xl shrink-0', typeConfig[notification.type].bg)}>
                      {(() => {
                        const Icon = typeConfig[notification.type].icon;
                        return <Icon className={cn('h-5 w-5', typeConfig[notification.type].color)} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
