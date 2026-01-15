import { useState } from 'react';
import { Download, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

const regularizationData = [
  { id: 1, epNumber: 'EP001', name: 'Amit Kumar', date: '2024-01-15', originalIn: '09:45', originalOut: '18:00', correctedIn: '08:30', correctedOut: '18:00', reason: 'Biometric not working', status: 'pending' },
  { id: 2, epNumber: 'EP002', name: 'Sunita Devi', date: '2024-01-15', originalIn: '10:00', originalOut: '17:30', correctedIn: '09:00', correctedOut: '18:30', reason: 'Forgot to punch', status: 'approved' },
  { id: 3, epNumber: 'EP005', name: 'Vikram Joshi', date: '2024-01-14', originalIn: '08:30', originalOut: '16:00', correctedIn: '08:30', correctedOut: '18:00', reason: 'System error', status: 'pending' },
  { id: 4, epNumber: 'EP008', name: 'Deepa Nair', date: '2024-01-14', originalIn: '09:00', originalOut: '17:00', correctedIn: '08:00', correctedOut: '17:00', reason: 'Card malfunction', status: 'rejected' },
  { id: 5, epNumber: 'EP012', name: 'Sanjay Mehta', date: '2024-01-13', originalIn: '00:00', originalOut: '00:00', correctedIn: '09:00', correctedOut: '18:00', reason: 'No punch recorded', status: 'approved' },
];

export default function RegularizationReport() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = regularizationData.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  const canApprove = user?.role === 'root' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regularization Report"
        description="Punch time correction requests with before/after comparison"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{regularizationData.length}</div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {regularizationData.filter((r) => r.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {regularizationData.filter((r) => r.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {regularizationData.filter((r) => r.status === 'rejected').length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
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
          <CardTitle>Regularization Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EP Number</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Original Time</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Corrected Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  {canApprove && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.epNumber}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">In:</span> {row.originalIn}
                        <br />
                        <span className="text-muted-foreground">Out:</span> {row.originalOut}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-primary">
                        <span className="text-muted-foreground">In:</span> {row.correctedIn}
                        <br />
                        <span className="text-muted-foreground">Out:</span> {row.correctedOut}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{row.reason}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status as any} />
                    </TableCell>
                    {canApprove && (
                      <TableCell>
                        {row.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
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
