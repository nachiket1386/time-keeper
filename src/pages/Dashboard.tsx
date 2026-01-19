import { Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { companies } from '@/data/mockData';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceCalendar } from '@/components/dashboard/AttendanceCalendar';
import { ARCSummaryTable } from '@/components/dashboard/ARCSummaryTable';
import { StatusSummaryTable } from '@/components/dashboard/StatusSummaryTable';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}`}
        description={user?.role === 'root' ? 'System-wide overview' : `${user?.company} Dashboard`}
      />

      {/* Root-only: Companies Overview */}
      {user?.role === 'root' && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-medium">{company.name}</CardTitle>
                  </div>
                  <StatusBadge status={company.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-medium">{company.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-medium">{company.sector}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar + ARC Summary Side by Side on Desktop */}
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-[280px_1fr]">
        <AttendanceCalendar companyId={user?.companyId} />
        <ARCSummaryTable companyId={user?.companyId} />
      </div>

      {/* Status Summary Tables */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <StatusSummaryTable companyId={user?.companyId} type="overtime" />
        <StatusSummaryTable companyId={user?.companyId} type="regularization" />
        <StatusSummaryTable companyId={user?.companyId} type="partialday" />
      </div>
    </div>
  );
}
