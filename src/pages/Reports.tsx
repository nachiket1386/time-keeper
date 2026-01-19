import { useState } from 'react';
import { format } from 'date-fns';
import {
  Clock,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  TrendingUp,
  Filter,
  X,
  Download,
  Calendar as CalendarIcon,
  Search,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { attendanceRecords, employees } from '@/data/mockData';

type ReportTab = 'attendance' | 'arc' | 'overtime' | 'partial' | 'regularization' | 'comprehensive';

const reportTabs = [
  { id: 'attendance' as ReportTab, label: 'Attendance', icon: Clock },
  { id: 'arc' as ReportTab, label: 'ARC Summary', icon: FileSpreadsheet },
  { id: 'overtime' as ReportTab, label: 'Overtime', icon: Clock },
  { id: 'partial' as ReportTab, label: 'Partial Day', icon: FileText },
  { id: 'regularization' as ReportTab, label: 'Regularization', icon: ClipboardList },
  { id: 'comprehensive' as ReportTab, label: 'Comprehensive', icon: TrendingUp },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [epSearch, setEpSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState('all');
  const [overstay, setOverstay] = useState('all');
  const [records, setRecords] = useState('complete');

  // Filter records based on search
  const filteredRecords = attendanceRecords.filter((record) => {
    const employee = employees.find((e) => e.epNumber === record.epNumber);
    if (epSearch && employee) {
      const searchLower = epSearch.toLowerCase();
      if (!employee.epNumber.toLowerCase().includes(searchLower) && 
          !employee.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (status !== 'all' && record.status !== status) return false;
    return true;
  });

  const handleClear = () => {
    setEpSearch('');
    setFromDate(new Date());
    setToDate(new Date());
    setStatus('all');
    setOverstay('all');
    setRecords('complete');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Absent': 'bg-red-100 text-red-700 border-red-200',
      'Partial Day': 'bg-amber-100 text-amber-700 border-amber-200',
      'On Leave': 'bg-violet-100 text-violet-700 border-violet-200',
      'Holiday': 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return (
      <Badge variant="outline" className={cn('font-medium', styles[status] || '')}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Attendance Data"
        description="View and manage attendance records."
      />

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {reportTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'gap-2 transition-all',
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card hover:bg-muted'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Employee Number Search */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Employee Number</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search EP NO..."
                  value={epSearch}
                  onChange={(e) => setEpSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* From Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'dd-MM-yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'dd-MM-yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Partial Day">Partial Day</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overstay */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Overstay</Label>
              <Select value={overstay} onValueChange={setOverstay}>
                <SelectTrigger>
                  <SelectValue placeholder="All Overstay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Overstay</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Records */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Records</Label>
              <Select value={records} onValueChange={setRecords}>
                <SelectTrigger>
                  <SelectValue placeholder="Complete Only" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Only</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="all">All Records</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" onClick={handleClear} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
            <Button variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Count */}
      <p className="text-sm text-muted-foreground">
        {filteredRecords.length} records ({filteredRecords.length} shown)
      </p>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-primary-foreground font-semibold">EP NO</TableHead>
                <TableHead className="text-primary-foreground font-semibold">NAME</TableHead>
                <TableHead className="text-primary-foreground font-semibold">DATE</TableHead>
                <TableHead className="text-primary-foreground font-semibold">SHIFT</TableHead>
                <TableHead className="text-primary-foreground font-semibold">TIME PAIRS</TableHead>
                <TableHead className="text-primary-foreground font-semibold">HRS</TableHead>
                <TableHead className="text-primary-foreground font-semibold">OVERSTAY</TableHead>
                <TableHead className="text-primary-foreground font-semibold">STATUS</TableHead>
                <TableHead className="text-primary-foreground font-semibold">OT</TableHead>
                <TableHead className="text-primary-foreground font-semibold">OT DAYS</TableHead>
                <TableHead className="text-primary-foreground font-semibold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.slice(0, 20).map((record) => {
                  const employee = employees.find((e) => e.epNumber === record.epNumber);
                  return (
                    <TableRow key={`${record.epNumber}-${record.date}`} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.epNumber}</TableCell>
                      <TableCell>{employee?.name || '-'}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.shift}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {record.checkIn && record.checkOut 
                          ? `${record.checkIn} - ${record.checkOut}` 
                          : '-'}
                      </TableCell>
                      <TableCell>{record.workHours?.toFixed(1) || '-'}</TableCell>
                      <TableCell>
                        {record.overstay ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {record.overstay}h
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.overtime || '-'}</TableCell>
                      <TableCell>{record.mandays?.toFixed(1) || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}