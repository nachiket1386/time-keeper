import { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FilterX,
  ArrowUpAZ,
  ArrowDownAZ,
  Filter,
  X,
  Check,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeft,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { attendanceRecords, employees } from '@/data/mockData';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';

type ReportTab = 'attendance' | 'arc' | 'overtime' | 'partial' | 'regularization' | 'comprehensive';

const reportTabs = [
  { id: 'attendance' as ReportTab, label: 'Attendance', icon: Clock, color: 'emerald' },
  { id: 'arc' as ReportTab, label: 'ARC Summary', icon: FileSpreadsheet, color: 'rose' },
  { id: 'overtime' as ReportTab, label: 'Overtime', icon: Clock, color: 'amber' },
  { id: 'partial' as ReportTab, label: 'Partial Day', icon: FileText, color: 'sky' },
  { id: 'regularization' as ReportTab, label: 'Regularization', icon: ClipboardList, color: 'violet' },
  { id: 'comprehensive' as ReportTab, label: 'Comprehensive', icon: TrendingUp, color: 'slate' },
];

const getTabStyles = (color: string, isActive: boolean) => {
  const styles: Record<string, { active: string; inactive: string; icon: string }> = {
    emerald: {
      active: 'bg-emerald-100 border-emerald-400 text-emerald-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200',
      icon: 'text-emerald-600',
    },
    rose: {
      active: 'bg-rose-100 border-rose-400 text-rose-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200',
      icon: 'text-rose-500',
    },
    amber: {
      active: 'bg-amber-100 border-amber-400 text-amber-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200',
      icon: 'text-amber-500',
    },
    sky: {
      active: 'bg-sky-100 border-sky-400 text-sky-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-sky-50 hover:border-sky-200',
      icon: 'text-sky-500',
    },
    violet: {
      active: 'bg-violet-100 border-violet-400 text-violet-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-200',
      icon: 'text-violet-500',
    },
    slate: {
      active: 'bg-slate-200 border-slate-400 text-slate-700',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50 hover:border-slate-200',
      icon: 'text-slate-600',
    },
  };
  return styles[color] || styles.slate;
};

type SortDirection = 'asc' | 'desc' | null;

interface ColumnFilter {
  selectedValues: Set<string>;
}

interface FilterDropdownProps {
  column: string;
  label: string;
  allValues: string[];
  filter: ColumnFilter;
  onFilterChange: (filter: ColumnFilter) => void;
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (direction: 'asc' | 'desc') => void;
  onClearSort: () => void;
}

function FilterDropdown({ 
  column, 
  label,
  allValues, 
  filter, 
  onFilterChange, 
  sortColumn, 
  sortDirection, 
  onSort,
  onClearSort 
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set(filter.selectedValues));
  
  const filteredValues = allValues.filter(v => 
    v.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const allSelected = filteredValues.length > 0 && filteredValues.every(v => tempSelected.has(v));
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(tempSelected);
      filteredValues.forEach(v => newSelected.add(v));
      setTempSelected(newSelected);
    } else {
      const newSelected = new Set(tempSelected);
      filteredValues.forEach(v => newSelected.delete(v));
      setTempSelected(newSelected);
    }
  };
  
  const handleValueToggle = (value: string, checked: boolean) => {
    const newSelected = new Set(tempSelected);
    if (checked) {
      newSelected.add(value);
    } else {
      newSelected.delete(value);
    }
    setTempSelected(newSelected);
  };
  
  const handleOk = () => {
    onFilterChange({ selectedValues: tempSelected });
    setOpen(false);
  };
  
  const handleCancel = () => {
    setTempSelected(new Set(filter.selectedValues));
    setSearchText('');
    setOpen(false);
  };
  
  const handleClearFilter = () => {
    const allSet = new Set(allValues);
    setTempSelected(allSet);
    onFilterChange({ selectedValues: allSet });
  };
  
  const isFiltered = filter.selectedValues.size < allValues.length && filter.selectedValues.size > 0;
  const isSorted = sortColumn === column;
  
  useEffect(() => {
    if (open) {
      setTempSelected(new Set(filter.selectedValues));
      setSearchText('');
    }
  }, [open, filter.selectedValues]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          "flex items-center gap-0.5 ml-1 p-0.5 rounded hover:bg-white/20",
          (isFiltered || isSorted) && "text-yellow-300"
        )}>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-0 bg-popover border shadow-lg z-50" 
        align="start"
        sideOffset={2}
      >
        <div className="p-2 space-y-1 border-b border-border">
          <button 
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs hover:bg-muted rounded text-left"
            onClick={() => { onSort('asc'); setOpen(false); }}
          >
            <ArrowUpAZ className="h-3.5 w-3.5" />
            Sort A to Z
          </button>
          <button 
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs hover:bg-muted rounded text-left"
            onClick={() => { onSort('desc'); setOpen(false); }}
          >
            <ArrowDownAZ className="h-3.5 w-3.5" />
            Sort Z to A
          </button>
          {(isFiltered || isSorted) && (
            <button 
              className="flex items-center gap-2 w-full px-2 py-1.5 text-xs hover:bg-muted rounded text-left text-muted-foreground"
              onClick={() => { handleClearFilter(); onClearSort(); }}
            >
              <FilterX className="h-3.5 w-3.5" />
              Clear Filter from "{label}"
            </button>
          )}
        </div>
        
        <div className="p-2 border-b border-border">
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-7 text-xs"
          />
        </div>
        
        <div className="p-2 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 px-1 py-1 text-xs cursor-pointer hover:bg-muted rounded">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="h-3.5 w-3.5"
            />
            (Select All)
          </label>
          {filteredValues.map((value) => (
            <label 
              key={value} 
              className="flex items-center gap-2 px-1 py-1 text-xs cursor-pointer hover:bg-muted rounded"
            >
              <Checkbox 
                checked={tempSelected.has(value)}
                onCheckedChange={(checked) => handleValueToggle(value, checked as boolean)}
                className="h-3.5 w-3.5"
              />
              {value || '(Blank)'}
            </label>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 p-2 border-t border-border bg-muted/30">
          <Button size="sm" variant="outline" className="h-7 text-xs px-3" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs px-3" onClick={handleOk}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Column definitions per report type
const attendanceColumns = [
  { key: 'epNumber', label: 'EP NO', align: 'left' as const },
  { key: 'employeeName', label: 'NAME', align: 'left' as const },
  { key: 'date', label: 'DATE', align: 'center' as const },
  { key: 'shift', label: 'SHIFT', align: 'center' as const },
  { key: 'timePairs', label: 'TIME PAIRS', align: 'center' as const },
  { key: 'hrs', label: 'HRS', align: 'center' as const },
  { key: 'overstay', label: 'OVERSTAY', align: 'center' as const },
  { key: 'status', label: 'STATUS', align: 'center' as const },
  { key: 'ot', label: 'OT', align: 'center' as const },
  { key: 'otDays', label: 'OT DAYS', align: 'center' as const },
  { key: 'actions', label: 'ACTIONS', align: 'center' as const },
];

const arcSummaryColumns = [
  { key: 'epNumber', label: 'EP NO', align: 'left' as const },
  { key: 'name', label: 'NAME', align: 'center' as const },
  { key: 'date', label: 'DATE', align: 'center' as const },
  { key: 'contractor', label: 'CONTRACTOR', align: 'center' as const },
  { key: 'trade', label: 'TRADE', align: 'center' as const },
  { key: 'contract', label: 'CONTRACT', align: 'center' as const },
  { key: 'mandays', label: 'MANDAYS', align: 'center' as const },
  { key: 'regularHr', label: 'REGULAR HR', align: 'center' as const },
  { key: 'ot', label: 'OT', align: 'center' as const },
];

// Dummy ARC Summary data
const arcSummaryData = [
  { epNumber: 'EP-2024-001', name: 'Amit Patel', date: '2026-01-21', contractor: 'ABC Contractors', trade: 'Electrician', contract: 'CON-001', mandays: '1.0', regularHr: '8.0', ot: '2', status: 'Present' },
  { epNumber: 'EP-2024-002', name: 'Suresh Kumar', date: '2026-01-21', contractor: 'XYZ Services', trade: 'Welder', contract: 'CON-002', mandays: '1.0', regularHr: '8.0', ot: '0', status: 'Present' },
  { epNumber: 'EP-2024-003', name: 'Ramesh Singh', date: '2026-01-21', contractor: 'ABC Contractors', trade: 'Fitter', contract: 'CON-001', mandays: '0.5', regularHr: '4.0', ot: '0', status: 'Partial Day' },
  { epNumber: 'EP-2024-004', name: 'Vijay Sharma', date: '2026-01-21', contractor: 'DEF Industries', trade: 'Rigger', contract: 'CON-003', mandays: '0.0', regularHr: '0.0', ot: '0', status: 'Absent' },
  { epNumber: 'EP-2024-005', name: 'Manoj Gupta', date: '2026-01-21', contractor: 'XYZ Services', trade: 'Electrician', contract: 'CON-002', mandays: '1.0', regularHr: '8.0', ot: '1', status: 'Present' },
  { epNumber: 'EP-2024-006', name: 'Anil Verma', date: '2026-01-21', contractor: 'ABC Contractors', trade: 'Welder', contract: 'CON-001', mandays: '1.0', regularHr: '8.0', ot: '3', status: 'Present' },
  { epNumber: 'EP-2024-007', name: 'Sanjay Yadav', date: '2026-01-21', contractor: 'GHI Corp', trade: 'Painter', contract: 'CON-004', mandays: '1.0', regularHr: '8.0', ot: '0', status: 'Present' },
  { epNumber: 'EP-2024-008', name: 'Deepak Joshi', date: '2026-01-21', contractor: 'DEF Industries', trade: 'Fitter', contract: 'CON-003', mandays: '0.0', regularHr: '0.0', ot: '0', status: 'Absent' },
  { epNumber: 'EP-2024-009', name: 'Rohit Mishra', date: '2026-01-21', contractor: 'XYZ Services', trade: 'Rigger', contract: 'CON-002', mandays: '1.0', regularHr: '8.0', ot: '2', status: 'Present' },
  { epNumber: 'EP-2024-010', name: 'Karan Malhotra', date: '2026-01-21', contractor: 'ABC Contractors', trade: 'Electrician', contract: 'CON-001', mandays: '0.5', regularHr: '4.0', ot: '0', status: 'Partial Day' },
  { epNumber: 'EP-2024-011', name: 'Nitin Agarwal', date: '2026-01-20', contractor: 'GHI Corp', trade: 'Welder', contract: 'CON-004', mandays: '1.0', regularHr: '8.0', ot: '1', status: 'Present' },
  { epNumber: 'EP-2024-012', name: 'Prakash Reddy', date: '2026-01-20', contractor: 'DEF Industries', trade: 'Painter', contract: 'CON-003', mandays: '1.0', regularHr: '8.0', ot: '0', status: 'Present' },
  { epNumber: 'EP-2024-013', name: 'Santosh Nair', date: '2026-01-20', contractor: 'ABC Contractors', trade: 'Fitter', contract: 'CON-001', mandays: '1.0', regularHr: '8.0', ot: '2', status: 'Present' },
  { epNumber: 'EP-2024-014', name: 'Arvind Das', date: '2026-01-20', contractor: 'XYZ Services', trade: 'Rigger', contract: 'CON-002', mandays: '0.0', regularHr: '0.0', ot: '0', status: 'Absent' },
  { epNumber: 'EP-2024-015', name: 'Mukesh Pandey', date: '2026-01-20', contractor: 'GHI Corp', trade: 'Electrician', contract: 'CON-004', mandays: '1.0', regularHr: '8.0', ot: '0', status: 'Present' },
];

export default function Reports() {
  const isMobile = useIsMobileOrTablet();
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  // Get columns based on active tab
  const columns = useMemo(() => {
    if (activeTab === 'arc') {
      return arcSummaryColumns;
    }
    return attendanceColumns;
  }, [activeTab]);

  // Build enriched records with all displayable values
  const enrichedRecords = useMemo(() => {
    if (activeTab === 'arc') {
      return arcSummaryData;
    }
    return attendanceRecords.map(record => {
      const employee = employees.find(e => e.epNumber === record.epNumber);
      // Calculate hours worked
      let hrs = '-';
      if (record.punchIn && record.punchOut) {
        const [inH, inM] = record.punchIn.split(':').map(Number);
        const [outH, outM] = record.punchOut.split(':').map(Number);
        const totalMins = (outH * 60 + outM) - (inH * 60 + inM);
        hrs = (totalMins / 60).toFixed(1);
      }
      // Calculate overstay (hours beyond 8)
      const overstay = hrs !== '-' && parseFloat(hrs) > 8 ? (parseFloat(hrs) - 8).toFixed(1) : '0.0';
      
      return {
        epNumber: record.epNumber,
        employeeName: employee?.name || '-',
        date: record.date,
        shift: 'General', // Default shift
        timePairs: record.punchIn && record.punchOut ? `${record.punchIn} - ${record.punchOut}` : '-',
        hrs,
        overstay,
        status: record.status,
        ot: record.overtime?.toString() || '0',
        otDays: record.mandays?.toFixed(1) || '0.0',
        actions: 'actions', // Placeholder for actions column
      };
    });
  }, [activeTab]);

  // Get unique values for each column
  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    columns.forEach(col => {
      values[col.key] = [...new Set(enrichedRecords.map(r => r[col.key as keyof typeof r]))].sort();
    });
    return values;
  }, [enrichedRecords]);

  // Column filters - initialize with all values selected
  const [filters, setFilters] = useState<Record<string, ColumnFilter>>(() => {
    const initial: Record<string, ColumnFilter> = {};
    columns.forEach(col => {
      initial[col.key] = { selectedValues: new Set(uniqueValues[col.key] || []) };
    });
    return initial;
  });

  // Reset filters when tab or columns change
  useEffect(() => {
    const reset: Record<string, ColumnFilter> = {};
    columns.forEach(col => {
      reset[col.key] = { selectedValues: new Set(uniqueValues[col.key] || []) };
    });
    setFilters(reset);
    setSortColumn(null);
    setSortDirection(null);
    setCurrentPage(1);
  }, [activeTab, columns, uniqueValues]);

  const updateFilter = (column: string, filter: ColumnFilter) => {
    setFilters(prev => ({ ...prev, [column]: filter }));
    setCurrentPage(1);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleClearSort = (column: string) => {
    if (sortColumn === column) {
      setSortColumn(null);
      setSortDirection(null);
    }
  };

  const clearAllFilters = () => {
    const reset: Record<string, ColumnFilter> = {};
    columns.forEach(col => {
      reset[col.key] = { selectedValues: new Set(uniqueValues[col.key] || []) };
    });
    setFilters(reset);
    setSortColumn(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return enrichedRecords.filter(record => {
      for (const col of columns) {
        const filter = filters[col.key];
        if (filter && !filter.selectedValues.has(record[col.key as keyof typeof record])) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedRecords, filters]);

  // Sort records
  const sortedRecords = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredRecords;
    
    return [...filteredRecords].sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a] || '';
      const bVal = b[sortColumn as keyof typeof b] || '';
      
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

  const hasActiveFilters = Object.entries(filters).some(([key, filter]) => {
    const allVals = uniqueValues[key] || [];
    return filter.selectedValues.size < allVals.length;
  }) || sortColumn !== null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Present': 'bg-emerald-500 text-white',
      'Absent': 'bg-red-500 text-white',
      'Partial Day': 'bg-amber-400 text-amber-900',
      'On Leave': 'bg-violet-500 text-white',
      'Holiday': 'bg-blue-500 text-white',
    };
    return (
      <Badge className={cn('font-medium text-[10px] px-1.5 py-0 whitespace-nowrap', styles[status] || '')}>
        {status}
      </Badge>
    );
  };

  const renderCell = (record: typeof enrichedRecords[0], colKey: string) => {
    const value = record[colKey as keyof typeof record];
    if (colKey === 'status') {
      return getStatusBadge(value);
    }
    if (colKey === 'actions') {
      return (
        <div className="flex items-center justify-center gap-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    }
    return value;
  };

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'arc':
        return { title: 'ARC Summary', description: 'Attendance Record Card summary by contractor with manday calculations.' };
      case 'overtime':
        return { title: 'Overtime Report', description: 'View and manage overtime records and approvals.' };
      case 'partial':
        return { title: 'Partial Day Report', description: 'View and manage partial day attendance records.' };
      case 'regularization':
        return { title: 'Regularization Report', description: 'View and manage attendance regularization requests.' };
      case 'comprehensive':
        return { title: 'Comprehensive Report', description: 'Complete attendance data with all metrics combined.' };
      default:
        return { title: 'Attendance Data', description: 'View and manage attendance records.' };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="animate-fade-in space-y-3 pb-6">
      {/* Collapsible Header Section */}
      {!isHeaderHidden && (
        <>
          <PageHeader
            title={headerContent.title}
            description={headerContent.description}
          />

          {/* Report Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {reportTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              const tabStyles = getTabStyles(tab.color, isActive);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                    isActive ? tabStyles.active : tabStyles.inactive
                  )}
                >
                  <IconComponent className={cn('h-4 w-4', tabStyles.icon)} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Actions Bar - Always visible */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Toggle Header Button */}
          <Button 
            size="sm" 
            variant={isHeaderHidden ? "default" : "outline"}
            onClick={() => setIsHeaderHidden(!isHeaderHidden)} 
            className="gap-1.5 h-7 text-xs"
            title={isHeaderHidden ? "Show Header & Tabs" : "Hide Header & Tabs"}
          >
            {isHeaderHidden ? (
              <>
                <PanelLeft className="h-3 w-3" />
                <span className="hidden sm:inline">Show</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="h-3 w-3" />
                <span className="hidden sm:inline">Hide</span>
              </>
            )}
          </Button>
          {/* Show current tab when header is hidden */}
          {isHeaderHidden && (
            <span className="text-xs font-medium text-muted-foreground">
              {reportTabs.find(t => t.id === activeTab)?.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Delete Buttons */}
          <Button 
            size="sm" 
            className="gap-1.5 h-8 text-xs bg-foreground hover:bg-foreground/90 text-background rounded-full px-4"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete {activeTab === 'arc' ? 'ARC Summary' : reportTabs.find(t => t.id === activeTab)?.label} Data
          </Button>
          {activeTab === 'attendance' && (
            <Button 
              size="sm" 
              variant="destructive"
              className="gap-1.5 h-8 text-xs rounded-full px-4"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete All Reports
            </Button>
          )}
          {hasActiveFilters && (
            <Button size="sm" variant="outline" onClick={clearAllFilters} className="gap-1.5 h-7 text-xs">
              <FilterX className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Records Count */}
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{totalRecords}</span> records
        {hasActiveFilters && <span className="text-primary ml-1">(filtered)</span>}
      </p>

      {/* Mobile/Tablet Card View */}
      {isMobile ? (
        <div className="space-y-3">
      {/* Mobile Filter Button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2 h-10 text-sm font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filters & Sort
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-primary text-primary-foreground h-5 px-2 text-xs">
                    {Object.entries(filters).filter(([key, filter]) => {
                      const allVals = uniqueValues[key] || [];
                      return filter.selectedValues.size < allVals.length;
                    }).length + (sortColumn ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl p-0">
              <SheetHeader className="px-4 py-3 border-b border-border bg-muted/30">
                <SheetTitle className="flex items-center justify-between">
                  <span className="text-base font-semibold">Filters & Sort</span>
                  {hasActiveFilters && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }} 
                      className="text-destructive gap-1.5 h-8"
                    >
                      <FilterX className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              {/* Sort Section */}
              <div className="px-4 py-3 border-b border-border bg-background">
                <div className="text-xs font-medium text-muted-foreground mb-2">SORT BY</div>
                <div className="flex flex-wrap gap-2">
                  {columns.slice(0, 6).map((col) => (
                    <Button
                      key={col.key}
                      size="sm"
                      variant={sortColumn === col.key ? "default" : "outline"}
                      className={cn(
                        "h-8 px-3 text-xs gap-1.5 rounded-full",
                        sortColumn === col.key && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        if (sortColumn === col.key) {
                          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                        } else {
                          handleSort(col.key, 'asc');
                        }
                      }}
                    >
                      {col.label}
                      {sortColumn === col.key && (
                        sortDirection === 'asc' ? <ArrowUpAZ className="h-3 w-3" /> : <ArrowDownAZ className="h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filter Section with Accordion */}
              <ScrollArea className="h-[calc(80vh-180px)]">
                <Accordion type="single" collapsible className="px-4">
                  {columns.map((col) => {
                    const allVals = uniqueValues[col.key] || [];
                    const selectedCount = filters[col.key]?.selectedValues.size || 0;
                    const isFiltered = selectedCount < allVals.length && selectedCount > 0;
                    
                    return (
                      <AccordionItem key={col.key} value={col.key} className="border-b border-border/50">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{col.label}</span>
                            {isFiltered && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
                                {selectedCount}/{allVals.length}
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          {/* Quick Actions */}
                          <div className="flex gap-2 mb-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs flex-1"
                              onClick={() => {
                                updateFilter(col.key, { selectedValues: new Set(allVals) });
                              }}
                            >
                              Select All
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs flex-1"
                              onClick={() => {
                                updateFilter(col.key, { selectedValues: new Set() });
                              }}
                            >
                              Clear All
                            </Button>
                          </div>
                          
                          {/* Filter Chips */}
                          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {allVals.map((value) => {
                              const isSelected = filters[col.key]?.selectedValues.has(value);
                              return (
                                <button
                                  key={value}
                                  className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                                    isSelected 
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                                  )}
                                  onClick={() => {
                                    const newSelected = new Set(filters[col.key]?.selectedValues || []);
                                    if (isSelected) {
                                      newSelected.delete(value);
                                    } else {
                                      newSelected.add(value);
                                    }
                                    updateFilter(col.key, { selectedValues: newSelected });
                                  }}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                  {value || '(Blank)'}
                                </button>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </ScrollArea>

              {/* Apply Button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
                <Button 
                  className="w-full h-11 text-sm font-medium"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply Filters ({totalRecords} results)
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-3">
            {paginatedRecords.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No records found
              </Card>
            ) : (
              paginatedRecords.map((record, index) => {
                const recordAny = record as Record<string, string>;
                const displayName = recordAny.employeeName || recordAny.name || '-';
                return (
                  <Card 
                    key={`${record.epNumber}-${record.date}-${index}`} 
                    className="overflow-hidden border-l-4 border-l-primary"
                  >
                    {/* Card Header */}
                    <div className="bg-[#1a4480] text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{record.epNumber}</span>
                        <span className="text-white/80 text-xs">•</span>
                        <span className="text-sm truncate max-w-[150px]">{displayName}</span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    
                    {/* Card Body - Dynamic Grid Layout */}
                    <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {columns.slice(2).map((col) => (
                        <div key={col.key} className="flex justify-between items-center">
                          <span className="text-muted-foreground text-xs">{col.label}</span>
                          <span className="font-medium text-xs">{recordAny[col.key] || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Mobile Pagination */}
          {totalPages >= 1 && (
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {startIndex + 1}-{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
                </span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /><ChevronLeft className="h-4 w-4 -ml-2.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2 font-medium">{currentPage}/{totalPages}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
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
                    <ChevronRight className="h-4 w-4" /><ChevronRight className="h-4 w-4 -ml-2.5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#1a4480] text-white">
                  {columns.map((col, idx) => (
                    <th 
                      key={col.key}
                      className={cn(
                        "px-2 py-2 font-semibold whitespace-nowrap",
                        idx < columns.length - 1 && "border-r border-white/20",
                        col.align === 'center' && "text-center",
                        col.align === 'left' && "text-left"
                      )}
                    >
                      <div className={cn(
                        "flex items-center",
                        col.align === 'center' && "justify-center"
                      )}>
                        {col.label}
                        <FilterDropdown
                          column={col.key}
                          label={col.label}
                          allValues={uniqueValues[col.key] || []}
                          filter={filters[col.key] || { selectedValues: new Set() }}
                          onFilterChange={(f) => updateFilter(col.key, f)}
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          onSort={(dir) => handleSort(col.key, dir)}
                          onClearSort={() => handleClearSort(col.key)}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <tr 
                        key={`${record.epNumber}-${record.date}-${index}`} 
                        className={cn(
                          'hover:bg-blue-50 transition-colors border-b border-border/30',
                          isEven ? 'bg-white' : 'bg-slate-50'
                        )}
                      >
                        {columns.map((col, idx) => (
                          <td 
                            key={col.key}
                            className={cn(
                              "px-2 py-1.5 whitespace-nowrap",
                              idx < columns.length - 1 && "border-r border-border/50",
                              col.align === 'center' && "text-center",
                              col.key === 'epNumber' && "font-medium"
                            )}
                          >
                            {renderCell(record, col.key)}
                          </td>
                        ))}
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
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-3 w-3" /><ChevronLeft className="h-3 w-3 -ml-2" />
                </Button>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-[10px] px-1.5">{currentPage}/{totalPages}</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-3 w-3" /><ChevronRight className="h-3 w-3 -ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
