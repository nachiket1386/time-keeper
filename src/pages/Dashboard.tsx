import { Users, UserCheck, UserX, Clock, FileText, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardStats, attendanceRecords, overtimeRequests, auditLogs, companies } from '@/data/mockData';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AttendanceCalendar } from '@/components/dashboard/AttendanceCalendar';
import { ARCSummaryTable } from '@/components/dashboard/ARCSummaryTable';
import { StatusSummaryTable } from '@/components/dashboard/StatusSummaryTable';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = getDashboardStats(user?.companyId);

  const recentAttendance = attendanceRecords
    .filter(r => !user?.companyId || r.companyId === user.companyId)
    .slice(0, 5);

  const pendingRequests = overtimeRequests
    .filter(r => r.status === 'pending' && (!user?.companyId || r.companyId === user.companyId))
    .slice(0, 5);

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}`}
        description={user?.role === 'root' ? 'System-wide overview' : `${user?.company} Dashboard`}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          subtitle={`${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance`}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingOT + stats.pendingRegularization}
          subtitle="OT & Regularization"
          icon={Clock}
          variant="warning"
        />
      </div>

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

      {/* Attendance Calendar */}
      <AttendanceCalendar companyId={user?.companyId} />

      {/* ARC Summary Table */}
      <ARCSummaryTable companyId={user?.companyId} />

      {/* Status Summary Tables */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <StatusSummaryTable companyId={user?.companyId} type="overtime" />
        <StatusSummaryTable companyId={user?.companyId} type="regularization" />
        <StatusSummaryTable companyId={user?.companyId} type="partialday" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/attendance">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{record.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 ml-2">
                    {record.punchIn && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {record.punchIn} - {record.punchOut || '--:--'}
                      </span>
                    )}
                    <StatusBadge status={record.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        {(user?.role === 'root' || user?.role === 'admin') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/requests/overtime">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Clock className="h-10 w-10 mb-2 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/30 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{request.employeeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.hours} hours OT - {request.date}
                        </p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Reject
                        </Button>
                        <Button size="sm" className="h-7 text-xs">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {(user?.role === 'root' || user?.role === 'admin') && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/audit-logs">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right ml-12 sm:ml-0">
                      <p className="text-xs font-medium">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
