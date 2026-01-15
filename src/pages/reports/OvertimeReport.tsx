import { useState } from 'react';
import { Download, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const overtimeRequests = [
  { id: 1, epNumber: 'EP001', name: 'Amit Kumar', date: '2024-01-15', hours: 2.5, reason: 'Project deadline', status: 'pending', contractor: 'ABC Contractors' },
  { id: 2, epNumber: 'EP002', name: 'Sunita Devi', date: '2024-01-15', hours: 3, reason: 'Urgent maintenance', status: 'approved', contractor: 'XYZ Services' },
  { id: 3, epNumber: 'EP003', name: 'Ravi Verma', date: '2024-01-14', hours: 2, reason: 'Client meeting prep', status: 'pending', contractor: 'ABC Contractors' },
  { id: 4, epNumber: 'EP004', name: 'Meena Singh', date: '2024-01-14', hours: 4, reason: 'Production requirement', status: 'rejected', contractor: 'PQR Industries' },
  { id: 5, epNumber: 'EP005', name: 'Vikram Joshi', date: '2024-01-13', hours: 1.5, reason: 'Documentation work', status: 'approved', contractor: 'LMN Works' },
  { id: 6, epNumber: 'EP006', name: 'Anjali Gupta', date: '2024-01-13', hours: 3, reason: 'System upgrade', status: 'pending', contractor: 'DEF Engineering' },
];

export default function OvertimeReport() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof overtimeRequests[0] | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  const filteredRequests = overtimeRequests.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  const stats = {
    total: overtimeRequests.length,
    pending: overtimeRequests.filter((r) => r.status === 'pending').length,
    approved: overtimeRequests.filter((r) => r.status === 'approved').length,
    rejected: overtimeRequests.filter((r) => r.status === 'rejected').length,
  };

  const handleAction = (request: typeof overtimeRequests[0], action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setRemarks('');
  };

  const confirmAction = () => {
    // Handle approve/reject logic
    setSelectedRequest(null);
    setActionType(null);
  };

  const canApprove = user?.role === 'root' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overtime Report"
        description="Track and manage overtime requests with approval workflow"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overtime Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EP Number</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Status</TableHead>
                  {canApprove && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.epNumber}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.hours}h
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                    <TableCell>{request.contractor}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status as any} />
                    </TableCell>
                    {canApprove && (
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAction(request, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleAction(request, 'reject')}
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

      {/* Approval Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Overtime Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.name} - {selectedRequest?.hours} hours on {selectedRequest?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Reason for overtime:</p>
              <p className="text-sm text-muted-foreground">{selectedRequest?.reason}</p>
            </div>
            <div className="space-y-2">
              <Label>Remarks (Optional)</Label>
              <Textarea
                placeholder="Add any remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={confirmAction}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
