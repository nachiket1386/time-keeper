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
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Eye,
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

type SortDirection = 'asc' | 'desc' | null;

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [epSearch, setEpSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState('all');
  const [overstay, setOverstay] = useState('all');
  const [records, setRecords] = useState('complete');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aVal: any = a[sortColumn as keyof typeof a];
    let bVal: any = b[sortColumn as keyof typeof b];
    
    // Handle employee name lookup
    if (sortColumn === 'employeeName') {
      const empA = employees.find((e) => e.epNumber === a.epNumber);
      const empB = employees.find((e) => e.epNumber === b.epNumber);
      aVal = empA?.name || '';
      bVal = empB?.name || '';
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalRecords = sortedRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleClear = () => {
    setEpSearch('');
    setFromDate(new Date());
    setToDate(new Date());
    setStatus('all');
    setOverstay('all');
    setRecords('complete');
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-3.5 w-3.5" />;
    }
    return <ChevronDown className="h-3.5 w-3.5" />;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Present': 'bg-emerald-500 text-white hover:bg-emerald-500',
      'Absent': 'bg-red-500 text-white hover:bg-red-500',
      'Partial Day': 'bg-amber-400 text-amber-900 hover:bg-amber-400',
      'On Leave': 'bg-violet-500 text-white hover:bg-violet-500',
      'Holiday': 'bg-blue-500 text-white hover:bg-blue-500',
    };
    return (
      <Badge className={cn('font-medium text-xs px-2.5 py-0.5', styles[status] || '')}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in space-y-4 pb-6">
      <PageHeader
        title="Attendance Data"
        description="View and manage attendance records."
      />

      {/* Report Type Tabs - Pill Style */}
      <div className="flex flex-wrap gap-2">
        {reportTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={cn(
              'gap-2 rounded-full px-4 transition-all font-medium',
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card hover:bg-muted border-border'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filters Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Employee Number Search */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Employee Number</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search EP NO..."
                  value={epSearch}
                  onChange={(e) => {
                    setEpSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* From Date */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-9 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {fromDate ? format(fromDate, 'dd-MM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
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
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-9 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {toDate ? format(toDate, 'dd-MM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
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
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={(v) => { setStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
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
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Overstay</Label>
              <Select value={overstay} onValueChange={setOverstay}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Overstay" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Overstay</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Records */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Records</Label>
              <Select value={records} onValueChange={setRecords}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Complete Only" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="complete">Complete Only</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="all">All Records</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm" className="gap-2 h-8">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear} className="gap-2 h-8">
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Button size="sm" className="gap-2 h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Count */}
      <p className="text-sm text-muted-foreground">
        {totalRecords} records ({paginatedRecords.length} shown)
      </p>

      {/* Data Table - Excel Style */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary border-b-0">
                <TableHead 
                  className="text-primary-foreground font-semibold text-xs cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort('epNumber')}
                >
                  <div className="flex items-center gap-1">
                    EP NO {getSortIcon('epNumber')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-primary-foreground font-semibold text-xs cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort('employeeName')}
                >
                  <div className="flex items-center gap-1">
                    NAME {getSortIcon('employeeName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-primary-foreground font-semibold text-xs cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    DATE {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap">SHIFT</TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">TIME PAIRS</TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">HRS</TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">OVERSTAY</TableHead>
                <TableHead 
                  className="text-primary-foreground font-semibold text-xs cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    STATUS {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">OT</TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">OT DAYS</TableHead>
                <TableHead className="text-primary-foreground font-semibold text-xs whitespace-nowrap text-center">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record, index) => {
                  const employee = employees.find((e) => e.epNumber === record.epNumber);
                  const isEven = index % 2 === 0;
                  return (
                    <TableRow 
                      key={`${record.epNumber}-${record.date}`} 
                      className={cn(
                        'hover:bg-accent/50 transition-colors border-b border-border/50',
                        isEven ? 'bg-card' : 'bg-muted/30'
                      )}
                    >
                      <TableCell className="font-medium text-sm py-2.5">{record.epNumber}</TableCell>
                      <TableCell className="text-sm py-2.5">{employee?.name || '-'}</TableCell>
                      <TableCell className="text-sm py-2.5">{record.date}</TableCell>
                      <TableCell className="text-sm py-2.5">-</TableCell>
                      <TableCell className="font-mono text-xs py-2.5 text-center">
                        {record.punchIn && record.punchOut 
                          ? `${record.punchIn} - ${record.punchOut}` 
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm py-2.5 text-center">
                        {record.punchIn && record.punchOut ? '8.0' : '-'}
                      </TableCell>
                      <TableCell className="text-sm py-2.5 text-center">-</TableCell>
                      <TableCell className="py-2.5">{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-sm py-2.5 text-center">{record.overtime || '-'}</TableCell>
                      <TableCell className="text-sm py-2.5 text-center">{record.mandays?.toFixed(1) || '0.0'}</TableCell>
                      <TableCell className="py-2.5 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
              </span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-8 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">per page</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsUpDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 min-w-[80px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsUpDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
