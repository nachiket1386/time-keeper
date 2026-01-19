import { useState, useMemo } from 'react';
import {
  Clock,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  FilterX,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  timePairs: string;
  hrs: string;
  overstay: string;
  status: string;
  ot: string;
  otDays: string;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  
  // Column filters
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    epNumber: '',
    name: '',
    date: '',
    shift: '',
    timePairs: '',
    hrs: '',
    overstay: '',
    status: '',
    ot: '',
    otDays: '',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
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
      
      if (columnFilters.epNumber && !record.epNumber.toLowerCase().includes(columnFilters.epNumber.toLowerCase())) {
        return false;
      }
      
      if (columnFilters.name && employee && !employee.name.toLowerCase().includes(columnFilters.name.toLowerCase())) {
        return false;
      }
      
      if (columnFilters.date && !record.date.includes(columnFilters.date)) {
        return false;
      }
      
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
      timePairs: '',
      hrs: '',
      overstay: '',
      status: '',
      ot: '',
      otDays: '',
    });
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
      <Badge className={cn('font-medium text-[10px] px-1.5 py-0 whitespace-nowrap', styles[status] || '')}>
        {status}
      </Badge>
    );
  };

  // Cell with tooltip for overflow
  const CellWithTooltip = ({ content, className }: { content: string; className?: string }) => (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("block truncate max-w-full", className)}>
            {content}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover border shadow-lg z-50 max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="animate-fade-in space-y-3 pb-6">
      <PageHeader
        title="Attendance Data"
        description="View and manage attendance records."
      />

      {/* Report Type Tabs + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
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
                'gap-1.5 rounded-full px-3 h-7 text-xs transition-all font-medium',
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card hover:bg-muted border-border'
              )}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button size="sm" variant="outline" onClick={handleClearAllFilters} className="gap-1.5 h-7 text-xs">
              <FilterX className="h-3 w-3" />
              Clear Filters
            </Button>
          )}
          <Button size="sm" className="gap-1.5 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Records Count */}
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{totalRecords}</span> records
        {hasActiveFilters && <span className="text-primary ml-1">(filtered)</span>}
      </p>

      {/* Excel-Like Data Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[1000px]">
            {/* Header Row with Sort */}
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90 w-[100px]" onClick={() => handleSort('epNumber')}>
                  <div className="flex items-center gap-1">EP NO {getSortIcon('epNumber')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90 w-[120px]" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">NAME {getSortIcon('name')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90 w-[90px]" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">DATE {getSortIcon('date')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[60px]">SHIFT</th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[100px]">TIME PAIRS</th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[50px]">HRS</th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[70px]">OVERSTAY</th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90 w-[80px]" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">STATUS {getSortIcon('status')}</div>
                </th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[50px]">OT</th>
                <th className="border-r border-primary-foreground/20 px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[60px]">OT DAYS</th>
                <th className="px-2 py-1.5 text-center font-semibold whitespace-nowrap w-[60px]">ACTIONS</th>
              </tr>
              {/* Filter Row */}
              <tr className="bg-muted/50 border-b border-border">
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.epNumber}
                    onChange={(e) => handleColumnFilterChange('epNumber', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.name}
                    onChange={(e) => handleColumnFilterChange('name', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.date}
                    onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.shift}
                    onChange={(e) => handleColumnFilterChange('shift', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="border-r border-border/70 p-0.5"></td>
                <td className="border-r border-border/70 p-0.5"></td>
                <td className="border-r border-border/70 p-0.5"></td>
                <td className="border-r border-border/70 p-0.5">
                  <Select value={columnFilters.status || 'all'} onValueChange={(v) => handleColumnFilterChange('status', v)}>
                    <SelectTrigger className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm">
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
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.ot}
                    onChange={(e) => handleColumnFilterChange('ot', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="border-r border-border/70 p-0.5">
                  <Input
                    placeholder="Filter..."
                    value={columnFilters.otDays}
                    onChange={(e) => handleColumnFilterChange('otDays', e.target.value)}
                    className="h-6 text-[10px] px-1.5 bg-background border-border/50 rounded-sm"
                  />
                </td>
                <td className="p-0.5"></td>
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
                  const timePair = record.punchIn && record.punchOut 
                    ? `${record.punchIn}-${record.punchOut}` 
                    : '-';
                  
                  return (
                    <tr 
                      key={`${record.epNumber}-${record.date}`} 
                      className={cn(
                        'hover:bg-accent/50 transition-colors border-b border-border/30',
                        isEven ? 'bg-card' : 'bg-muted/20'
                      )}
                    >
                      <td className="border-r border-border/30 px-2 py-1 font-medium whitespace-nowrap">
                        <CellWithTooltip content={record.epNumber} />
                      </td>
                      <td className="border-r border-border/30 px-2 py-1 whitespace-nowrap">
                        <CellWithTooltip content={employee?.name || '-'} />
                      </td>
                      <td className="border-r border-border/30 px-2 py-1 whitespace-nowrap">{record.date}</td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">-</td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-mono cursor-default">{timePair}</span>
                            </TooltipTrigger>
                            {timePair !== '-' && (
                              <TooltipContent side="top" className="bg-popover border shadow-lg z-50">
                                <div className="text-xs p-1">
                                  <div>In: {record.punchIn}</div>
                                  <div>Out: {record.punchOut}</div>
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">
                        {record.punchIn && record.punchOut ? '8.0' : '-'}
                      </td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">-</td>
                      <td className="border-r border-border/30 px-2 py-1 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">{record.overtime || '-'}</td>
                      <td className="border-r border-border/30 px-2 py-1 text-center whitespace-nowrap">{record.mandays?.toFixed(1) || '0.0'}</td>
                      <td className="px-2 py-1 text-center whitespace-nowrap">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-5 px-1 text-[10px] font-medium text-primary p-0"
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
          <div className="flex items-center justify-between border-t border-border px-3 py-1.5 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                {startIndex + 1}-{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
              </span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-5 w-12 text-[10px] px-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3" />
                <ChevronLeft className="h-3 w-3 -ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-[10px] px-1.5">
                {currentPage}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3" />
                <ChevronRight className="h-3 w-3 -ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
