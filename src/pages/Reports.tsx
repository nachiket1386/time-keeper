import { useState, useMemo } from 'react';
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
  FilterX,
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

interface ColumnFilters {
  epNumber: string;
  name: string;
  date: string;
  shift: string;
  status: string;
  ot: string;
  otDays: string;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [overstay, setOverstay] = useState('all');
  const [records, setRecords] = useState('complete');
  
  // Column filters
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    epNumber: '',
    name: '',
    date: '',
    shift: '',
    status: '',
    ot: '',
    otDays: '',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get unique values for dropdown filters
  const uniqueStatuses = useMemo(() => 
    [...new Set(attendanceRecords.map(r => r.status))].sort(),
    []
  );

  // Filter records based on column filters
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const employee = employees.find((e) => e.epNumber === record.epNumber);
      
      // EP Number filter
      if (columnFilters.epNumber && !record.epNumber.toLowerCase().includes(columnFilters.epNumber.toLowerCase())) {
        return false;
      }
      
      // Name filter
      if (columnFilters.name && employee && !employee.name.toLowerCase().includes(columnFilters.name.toLowerCase())) {
        return false;
      }
      
      // Date filter
      if (columnFilters.date && !record.date.includes(columnFilters.date)) {
        return false;
      }
      
      // Status filter
      if (columnFilters.status && columnFilters.status !== 'all' && record.status !== columnFilters.status) {
        return false;
      }
      
      return true;
    });
  }, [columnFilters]);

  // Sort records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      
      let aVal: any = a[sortColumn as keyof typeof a];
      let bVal: any = b[sortColumn as keyof typeof b];
      
      // Handle employee name lookup
      if (sortColumn === 'name') {
        const empA = employees.find((e) => e.epNumber === a.epNumber);
        const empB = employees.find((e) => e.epNumber === b.epNumber);
        aVal = empA?.name || '';
        bVal = empB?.name || '';
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortColumn, sortDirection]);

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

  const handleColumnFilterChange = (column: keyof ColumnFilters, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setColumnFilters({
      epNumber: '',
      name: '',
      date: '',
      shift: '',
      status: '',
      ot: '',
      otDays: '',
    });
    setFromDate(new Date());
    setToDate(new Date());
    setOverstay('all');
    setRecords('complete');
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(columnFilters).some(v => v !== '' && v !== 'all');

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-3 w-3" />;
    }
    return <ChevronDown className="h-3 w-3" />;
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
      <Badge className={cn('font-medium text-[10px] px-1.5 py-0', styles[status] || '')}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in space-y-3 pb-6">
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
              'gap-1.5 rounded-full px-3 h-8 text-xs transition-all font-medium',
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card hover:bg-muted border-border'
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Compact Filters Row */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-end gap-3">
            {/* From Date */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[120px] justify-start text-left font-normal h-8 text-xs"
                  >
                    <CalendarIcon className="mr-1.5 h-3 w-3 text-muted-foreground" />
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
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[120px] justify-start text-left font-normal h-8 text-xs"
                  >
                    <CalendarIcon className="mr-1.5 h-3 w-3 text-muted-foreground" />
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

            {/* Overstay */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">Overstay</Label>
              <Select value={overstay} onValueChange={setOverstay}>
                <SelectTrigger className="h-8 w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Records */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">Records</Label>
              <Select value={records} onValueChange={setRecords}>
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button size="sm" className="gap-1.5 h-8 text-xs">
                <Filter className="h-3 w-3" />
                Apply
              </Button>
              {hasActiveFilters && (
                <Button size="sm" variant="outline" onClick={handleClearAllFilters} className="gap-1.5 h-8 text-xs">
                  <FilterX className="h-3 w-3" />
                  Clear All
                </Button>
              )}
              <Button size="sm" className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{totalRecords}</span> records found
          {hasActiveFilters && <span className="text-primary ml-1">(filtered)</span>}
        </p>
      </div>

      {/* Excel-Like Data Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            {/* Header Row with Sort */}
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90" onClick={() => handleSort('epNumber')}>
                  <div className="flex items-center gap-1">EP NO {getSortIcon('epNumber')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">NAME {getSortIcon('name')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">DATE {getSortIcon('date')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">SHIFT</th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">TIME PAIRS</th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">HRS</th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">OVERSTAY</th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">STATUS {getSortIcon('status')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">OT</th>
                <th className="border-r border-primary-foreground/20 px-2 py-2 text-center font-semibold whitespace-nowrap">OT DAYS</th>
                <th className="px-2 py-2 text-center font-semibold whitespace-nowrap">ACTIONS</th>
              </tr>
              {/* Filter Row */}
              <tr className="bg-muted/70 border-b border-border">
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.epNumber}
                    onChange={(e) => handleColumnFilterChange('epNumber', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.name}
                    onChange={(e) => handleColumnFilterChange('name', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.date}
                    onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.shift}
                    onChange={(e) => handleColumnFilterChange('shift', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="border-r border-border p-1"></td>
                <td className="border-r border-border p-1"></td>
                <td className="border-r border-border p-1"></td>
                <td className="border-r border-border p-1">
                  <Select value={columnFilters.status || 'all'} onValueChange={(v) => handleColumnFilterChange('status', v)}>
                    <SelectTrigger className="h-6 text-[10px] px-1.5 bg-background">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">All</SelectItem>
                      {uniqueStatuses.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.ot}
                    onChange={(e) => handleColumnFilterChange('ot', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="border-r border-border p-1">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.otDays}
                    onChange={(e) => handleColumnFilterChange('otDays', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background"
                  />
                </td>
                <td className="p-1"></td>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-muted-foreground">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => {
                  const employee = employees.find((e) => e.epNumber === record.epNumber);
                  const isEven = index % 2 === 0;
                  return (
                    <tr 
                      key={`${record.epNumber}-${record.date}`} 
                      className={cn(
                        'hover:bg-accent/50 transition-colors border-b border-border/50',
                        isEven ? 'bg-card' : 'bg-muted/20'
                      )}
                    >
                      <td className="border-r border-border/50 px-2 py-1.5 font-medium">{record.epNumber}</td>
                      <td className="border-r border-border/50 px-2 py-1.5">{employee?.name || '-'}</td>
                      <td className="border-r border-border/50 px-2 py-1.5">{record.date}</td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center">-</td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center font-mono">
                        {record.punchIn && record.punchOut 
                          ? `${record.punchIn}-${record.punchOut}` 
                          : '-'}
                      </td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center">
                        {record.punchIn && record.punchOut ? '8.0' : '-'}
                      </td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center">-</td>
                      <td className="border-r border-border/50 px-2 py-1.5">{getStatusBadge(record.status)}</td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center">{record.overtime || '-'}</td>
                      <td className="border-r border-border/50 px-2 py-1.5 text-center">{record.mandays?.toFixed(1) || '0.0'}</td>
                      <td className="px-2 py-1.5 text-center">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-5 px-1 text-[10px] font-medium text-primary"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border px-3 py-2 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                {startIndex + 1}-{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
              </span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-6 w-14 text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3" />
                <ChevronLeft className="h-3 w-3 -ml-1.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-[10px] px-2 min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3" />
                <ChevronRight className="h-3 w-3 -ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
