import { useState } from 'react';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceRecords, employees } from '@/data/mockData';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function Attendance() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter records based on user role
  let filteredRecords = attendanceRecords.filter((r) => {
    if (user?.role === 'user1' && user.assignedEmployees) {
      return user.assignedEmployees.includes(r.employeeId);
    }
    if (user?.companyId) {
      return r.companyId === user.companyId;
    }
    return true;
  });

  // Apply search filter
  if (search) {
    filteredRecords = filteredRecords.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.epNumber.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filteredRecords = filteredRecords.filter(
      (r) => r.status.toLowerCase().replace(/\s+/g, '') === statusFilter
    );
  }

  const columns: Column<typeof attendanceRecords[0]>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'epNumber', header: 'EP Number', sortable: true },
    { key: 'employeeName', header: 'Employee Name', sortable: true },
    { key: 'contractor', header: 'Contractor' },
    { key: 'punchIn', header: 'Punch In' },
    { key: 'punchOut', header: 'Punch Out' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'overtime', header: 'OT (hrs)', className: 'text-center' },
    { key: 'mandays', header: 'Mandays', className: 'text-center' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance Records"
        description="View and manage employee attendance data"
        breadcrumbs={[{ label: 'Attendance' }]}
        actions={
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or EP number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="partialday">Partial Day</SelectItem>
                <SelectItem value="onleave">On Leave</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        keyExtractor={(row) => row.id}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        pageSize={15}
      />
    </div>
  );
}
