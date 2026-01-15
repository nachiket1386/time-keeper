import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const partialDayData = [
  { id: 1, epNumber: 'EP001', name: 'Amit Kumar', date: '2024-01-15', hoursWorked: 4, mandays: 0.5, reason: 'Medical appointment', status: 'approved' },
  { id: 2, epNumber: 'EP007', name: 'Kavita Rao', date: '2024-01-15', hoursWorked: 6, mandays: 0.75, reason: 'Personal emergency', status: 'pending' },
  { id: 3, epNumber: 'EP012', name: 'Sanjay Mehta', date: '2024-01-14', hoursWorked: 5, mandays: 0.625, reason: 'Family function', status: 'approved' },
  { id: 4, epNumber: 'EP008', name: 'Deepa Nair', date: '2024-01-14', hoursWorked: 3, mandays: 0.375, reason: 'Medical checkup', status: 'rejected' },
  { id: 5, epNumber: 'EP015', name: 'Manoj Tiwari', date: '2024-01-13', hoursWorked: 4, mandays: 0.5, reason: 'Bank work', status: 'approved' },
  { id: 6, epNumber: 'EP003', name: 'Ravi Verma', date: '2024-01-13', hoursWorked: 6, mandays: 0.75, reason: 'School function', status: 'pending' },
];

export default function PartialDayReport() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = partialDayData.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  const totalMandays = partialDayData.reduce((sum, r) => sum + r.mandays, 0);
  const totalHours = partialDayData.reduce((sum, r) => sum + r.hoursWorked, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partial Day Report"
        description="Track partial day attendance with manday calculations"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{partialDayData.length}</div>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{totalHours}h</div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalMandays.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Mandays</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {partialDayData.filter((r) => r.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Partial Day Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EP Number</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Hours Worked</TableHead>
                  <TableHead className="text-right">Mandays</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.epNumber}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-right">{row.hoursWorked}h</TableCell>
                    <TableCell className="text-right font-medium">{row.mandays}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{row.reason}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status as any} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
