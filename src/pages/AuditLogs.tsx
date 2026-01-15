import { useState } from 'react';
import { Search, Filter, Download, Eye, User, Database, Upload, Shield, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const auditLogs = [
  { id: 1, action: 'User Login', user: 'root@ams.com', userRole: 'root', category: 'auth', ip: '192.168.1.100', timestamp: '2024-01-15 09:30:45', details: 'Successful login from Chrome on Windows' },
  { id: 2, action: 'Attendance Import', user: 'admin@techcorp.com', userRole: 'admin', category: 'import', ip: '192.168.1.105', timestamp: '2024-01-15 09:25:12', details: 'Imported 1250 attendance records from attendance_jan.xlsx' },
  { id: 3, action: 'User Created', user: 'root@ams.com', userRole: 'root', category: 'user', ip: '192.168.1.100', timestamp: '2024-01-15 09:20:00', details: 'Created new user: supervisor@techcorp.com with role User1' },
  { id: 4, action: 'Overtime Approved', user: 'admin@techcorp.com', userRole: 'admin', category: 'approval', ip: '192.168.1.105', timestamp: '2024-01-15 09:15:30', details: 'Approved overtime request #45 for employee EP001 (2.5 hours)' },
  { id: 5, action: 'Company Updated', user: 'root@ams.com', userRole: 'root', category: 'company', ip: '192.168.1.100', timestamp: '2024-01-15 09:10:22', details: 'Updated company settings for TechCorp Industries' },
  { id: 6, action: 'Report Exported', user: 'admin@globaltech.com', userRole: 'admin', category: 'export', ip: '192.168.1.110', timestamp: '2024-01-15 09:05:18', details: 'Exported ARC Summary report for January 2024' },
  { id: 7, action: 'Password Changed', user: 'supervisor@techcorp.com', userRole: 'user1', category: 'security', ip: '192.168.1.115', timestamp: '2024-01-15 08:55:40', details: 'User changed their password' },
  { id: 8, action: 'Backup Created', user: 'root@ams.com', userRole: 'root', category: 'backup', ip: '192.168.1.100', timestamp: '2024-01-15 02:00:00', details: 'Automatic scheduled backup completed successfully' },
  { id: 9, action: 'Regularization Rejected', user: 'admin@techcorp.com', userRole: 'admin', category: 'approval', ip: '192.168.1.105', timestamp: '2024-01-14 17:45:10', details: 'Rejected regularization request #23 for employee EP004' },
  { id: 10, action: 'Employee Deleted', user: 'admin@techcorp.com', userRole: 'admin', category: 'employee', ip: '192.168.1.105', timestamp: '2024-01-14 16:30:55', details: 'Deleted employee EP099 from the system' },
];

const categoryIcons: Record<string, any> = {
  auth: Shield,
  import: Upload,
  user: User,
  approval: Clock,
  company: Database,
  export: Download,
  security: Shield,
  backup: Database,
  employee: User,
};

const categoryColors: Record<string, string> = {
  auth: 'bg-green-100 text-green-700 border-green-200',
  import: 'bg-blue-100 text-blue-700 border-blue-200',
  user: 'bg-purple-100 text-purple-700 border-purple-200',
  approval: 'bg-amber-100 text-amber-700 border-amber-200',
  company: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  export: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  security: 'bg-red-100 text-red-700 border-red-200',
  backup: 'bg-gray-100 text-gray-700 border-gray-200',
  employee: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities and user actions (Root access only)"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-sm text-muted-foreground">Total Logs (Today)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {auditLogs.filter((l) => l.category === 'auth').length}
            </div>
            <p className="text-sm text-muted-foreground">Login Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {auditLogs.filter((l) => l.category === 'import' || l.category === 'export').length}
            </div>
            <p className="text-sm text-muted-foreground">Data Operations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {auditLogs.filter((l) => l.category === 'approval').length}
            </div>
            <p className="text-sm text-muted-foreground">Approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="user">User Management</SelectItem>
                  <SelectItem value="approval">Approvals</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input type="date" />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const Icon = categoryIcons[log.category] || Shield;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{log.user}</p>
                          <p className="text-xs text-muted-foreground capitalize">{log.userRole}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[log.category]}>
                          <Icon className="h-3 w-3 mr-1" />
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium capitalize">{selectedLog.userRole}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <Badge className={categoryColors[selectedLog.category]}>
                    {selectedLog.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">IP Address</Label>
                  <p className="font-medium">{selectedLog.ip}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Details</Label>
                <p className="mt-1 p-3 rounded-lg bg-muted text-sm">{selectedLog.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
