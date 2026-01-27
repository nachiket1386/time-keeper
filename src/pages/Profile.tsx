import { User, Mail, Phone, Building2, Calendar, Shield, Edit, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const roleBadgeStyles = {
    root: 'bg-purple-100 text-purple-700 border-purple-200',
    admin: 'bg-blue-100 text-blue-700 border-blue-200',
    user1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const roleLabels = {
    root: 'Root Administrator',
    admin: 'Company Admin',
    user1: 'Supervisor',
  };

  const profileItems = [
    { icon: User, label: 'Full Name', value: user.name },
    { icon: Mail, label: 'Username', value: user.username },
    { icon: Building2, label: 'Company', value: user.company || 'All Companies' },
    { icon: Shield, label: 'Role', value: roleLabels[user.role], badge: true },
    ...(user.accessFromDate
      ? [
          {
            icon: Calendar,
            label: 'Access Period',
            value: `${user.accessFromDate} to ${user.accessToDate}`,
          },
        ]
      : []),
  ];

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground text-sm">{user.username}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            {profileItems.map((item, index) => (
              <div key={index}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-muted">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    {item.badge ? (
                      <Badge className={roleBadgeStyles[user.role]}>{item.value}</Badge>
                    ) : (
                      <p className="font-medium truncate">{item.value}</p>
                    )}
                  </div>
                </div>
                {index < profileItems.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Employees (for User1) */}
      {user.role === 'user1' && user.assignedEmployees && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Assigned Employees</h2>
            <div className="flex flex-wrap gap-2">
              {user.assignedEmployees.map((ep) => (
                <Badge key={ep} variant="secondary" className="text-sm py-1.5 px-3">
                  {ep}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">45</p>
            <p className="text-xs text-muted-foreground">Days Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">28</p>
            <p className="text-xs text-muted-foreground">Approvals Made</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">12</p>
            <p className="text-xs text-muted-foreground">Reports Generated</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
