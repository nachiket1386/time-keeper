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
  { key: 'timePair1', label: 'IN - OUT', align: 'center' as const, isTimePair: true },
  { key: 'timePair2', label: 'IN - OUT', align: 'center' as const, isTimePair: true },
  { key: 'timePair3', label: 'IN - OUT', align: 'center' as const, isTimePair: true },
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
    return attendanceRecords.map((record, index) => {
      const employee = employees.find(e => e.epNumber === record.epNumber);
      
      // Shift codes: A, B, C, D, N (Night)
      const shiftCodes = ['A', 'B', 'C', 'D', 'N'];
      const shift = shiftCodes[index % shiftCodes.length];
      
      // Status values: P (Present), A (Absent), .05, -1, PH (Public Holiday), L (Leave)
      const statusValues = ['P', 'P', 'P', 'A', '.05', '-1', 'PH', 'L', 'P', 'P'];
      const status = statusValues[index % statusValues.length];
      
      // Generate realistic multiple punch data
      const generatePunches = () => {
        if (!record.punchIn || !record.punchOut || status === 'A' || status === 'PH' || status === 'L') {
          return { punch1: '', punch2: '', punch3: '', punch4: '', punch5: '', punch6: '' };
        }
        
        // Simulate different punch patterns based on index
        const pattern = index % 5;
        const isNightShift = shift === 'N';
        const nightSuffix = isNightShift ? ' (N)' : '';
        
        switch (pattern) {
          case 0: // Single in/out
            return {
              punch1: record.punchIn,
              punch2: record.punchOut + nightSuffix,
              punch3: '', punch4: '', punch5: '', punch6: ''
            };
          case 1: // Two pairs (lunch break)
            return {
              punch1: record.punchIn,
              punch2: '12:30',
              punch3: '13:00',
              punch4: record.punchOut + nightSuffix,
              punch5: '', punch6: ''
            };
          case 2: // Three pairs (two breaks)
            return {
              punch1: record.punchIn,
              punch2: '10:30',
              punch3: '10:45',
              punch4: '13:00',
              punch5: '13:30',
              punch6: record.punchOut + nightSuffix
            };
          case 3: // Only morning punches
            return {
              punch1: record.punchIn,
              punch2: '',
              punch3: record.punchOut + nightSuffix,
              punch4: '', punch5: '', punch6: ''
            };
          default: // Full day with break
            return {
              punch1: record.punchIn,
              punch2: '12:00',
              punch3: '12:45',
              punch4: record.punchOut + nightSuffix,
              punch5: '', punch6: ''
            };
        }
      };
      
      const punches = generatePunches();
      
      // Calculate hours worked from all punches
      let totalMins = 0;
      const punchPairs = [
        [punches.punch1, punches.punch2],
        [punches.punch3, punches.punch4],
        [punches.punch5, punches.punch6]
      ];
      
      punchPairs.forEach(([inPunch, outPunch]) => {
        if (inPunch && outPunch) {
          const cleanIn = inPunch.replace(' (N)', '');
          const cleanOut = outPunch.replace(' (N)', '');
          const [inH, inM] = cleanIn.split(':').map(Number);
          const [outH, outM] = cleanOut.split(':').map(Number);
          if (!isNaN(inH) && !isNaN(outH)) {
            let mins = (outH * 60 + outM) - (inH * 60 + inM);
            if (mins < 0) mins += 24 * 60; // Handle overnight
            totalMins += mins;
          }
        }
      });
      
      // Format HRS as HH:MM
      const hrsHH = Math.floor(totalMins / 60);
      const hrsMM = totalMins % 60;
      const hrs = totalMins > 0 ? `${hrsHH.toString().padStart(2, '0')}:${hrsMM.toString().padStart(2, '0')}` : '-';
      
      // Calculate overstay (anything over 8 hours = 480 mins) in HH:MM
      const overstayMins = totalMins > 480 ? totalMins - 480 : 0;
      const overstayHH = Math.floor(overstayMins / 60);
      const overstayMM = overstayMins % 60;
      const overstay = `${overstayHH.toString().padStart(2, '0')}:${overstayMM.toString().padStart(2, '0')}`;
      
      // OT in HH:MM format
      const otMins = (record.overtime || 0) * 60;
      const otHH = Math.floor(otMins / 60);
      const otMM = otMins % 60;
      const ot = `${otHH.toString().padStart(2, '0')}:${otMM.toString().padStart(2, '0')}`;
      
      // OT Days in HH:MM format (mandays * 8 hours)
      const otDaysMins = Math.round((record.mandays || 0) * 480);
      const otDaysHH = Math.floor(otDaysMins / 60);
      const otDaysMM = otDaysMins % 60;
      const otDays = `${otDaysHH.toString().padStart(2, '0')}:${otDaysMM.toString().padStart(2, '0')}`;
      
      // Create time pairs (IN-OUT format: 08:06-12:30 or 07:44-- for missing out)
      const formatTimePair = (inTime: string, outTime: string) => {
        if (!inTime && !outTime) return '--';
        const cleanIn = inTime ? inTime.replace(' (N)', '') : '--';
        const cleanOut = outTime ? outTime.replace(' (N)', '') : '--';
        return `${cleanIn}-${cleanOut}`;
      };

      const timePair1 = formatTimePair(punches.punch1, punches.punch2);
      const timePair2 = formatTimePair(punches.punch3, punches.punch4);
      const timePair3 = formatTimePair(punches.punch5, punches.punch6);

      // Format date as DD-MM-YYYY
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const parts = dateStr.split('-'); // Assuming YYYY-MM-DD format
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      return {
        epNumber: record.epNumber,
        employeeName: employee?.name || '-',
        date: formatDate(record.date),
        shift,
        timePair1,
        timePair2,
        timePair3,
        hrs,
        overstay,
        status,
        ot,
        otDays,
        actions: 'actions',
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

  // Get punch column styling
  const getPunchCellStyle = (colKey: string, value: string) => {
    const isPunchColumn = colKey.startsWith('punch');
    if (!isPunchColumn) return '';
    
    const column = attendanceColumns.find(c => c.key === colKey);
    const punchType = (column as { punchType?: string })?.punchType;
    
    if (!value || value === '-') return 'text-muted-foreground';
    
    // Check for night shift indicator
    const isNight = value.includes('(N)');
    
    if (punchType === 'in') {
      return cn(
        'font-medium',
        isNight ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-700 bg-emerald-50'
      );
    } else {
      return cn(
        'font-medium',
        isNight ? 'text-purple-600 bg-purple-50' : 'text-blue-700 bg-blue-50'
      );
    }
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
    // Time pair columns with IN/OUT color coding
    if (colKey.startsWith('timePair')) {
      if (!value || value === '-') {
        return <span className="text-muted-foreground">-</span>;
      }
      // Parse the time pair (format: "IN - OUT" or "IN / -" or "- / OUT")
      const parts = value.includes(' - ') ? value.split(' - ') : value.split(' / ');
      const inTime = parts[0]?.trim();
      const outTime = parts[1]?.trim();
      const isNight = value.includes('(N)');
      
      return (
        <div className="flex items-center justify-center gap-1">
          <span className={cn(
            'px-1.5 py-0.5 rounded text-xs font-medium',
            inTime && inTime !== '-' 
              ? (isNight ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-700 bg-emerald-50')
              : 'text-muted-foreground'
          )}>
            {inTime || '-'}
          </span>
          <span className="text-muted-foreground text-xs">-</span>
          <span className={cn(
            'px-1.5 py-0.5 rounded text-xs font-medium',
            outTime && outTime !== '-'
              ? (isNight || outTime.includes('(N)') ? 'text-purple-600 bg-purple-50' : 'text-blue-700 bg-blue-50')
              : 'text-muted-foreground'
          )}>
            {outTime || '-'}
          </span>
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
    <div className="animate-fade-in space-y-3 pb-6 relative">
      {/* Hide/Show Button - Positioned top right below navbar */}
      <Button 
        size="sm" 
        variant={isHeaderHidden ? "default" : "outline"}
        onClick={() => setIsHeaderHidden(!isHeaderHidden)} 
        className="absolute right-0 top-0 gap-1.5 h-8 text-xs z-10"
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
          {/* Show current tab when header is hidden */}
          {isHeaderHidden && (
            <span className="text-xs font-medium text-muted-foreground">
              {reportTabs.find(t => t.id === activeTab)?.label}
            </span>
          )}
          {hasActiveFilters && (
            <Button size="sm" variant="outline" onClick={clearAllFilters} className="gap-1.5 h-7 text-xs">
              <FilterX className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>
        {!isHeaderHidden && (
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
          </div>
        )}
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
                          {/* Search Input with Auto-Select */}
                          <div className="mb-3 space-y-2">
                            <Input
                              placeholder={`Search ${col.label.toLowerCase()}...`}
                              className="h-9 text-sm"
                              onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                // Filter visibility - find sibling chips container
                                const accordionContent = e.target.closest('[data-state]');
                                if (accordionContent) {
                                  accordionContent.querySelectorAll('[data-filter-value]').forEach((chip: Element) => {
                                    const value = chip.getAttribute('data-filter-value')?.toLowerCase() || '';
                                    (chip as HTMLElement).style.display = value.includes(searchTerm) ? '' : 'none';
                                  });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
                                  if (searchTerm) {
                                    // Auto-select all matching values
                                    const matchingValues = allVals.filter(v => 
                                      v.toLowerCase().includes(searchTerm)
                                    );
                                    if (matchingValues.length > 0) {
                                      const newSelected = new Set(filters[col.key]?.selectedValues || []);
                                      matchingValues.forEach(v => newSelected.add(v));
                                      updateFilter(col.key, { selectedValues: newSelected });
                                      (e.target as HTMLInputElement).value = '';
                                      // Reset visibility
                                      const accordionContent = (e.target as HTMLElement).closest('[data-state]');
                                      if (accordionContent) {
                                        accordionContent.querySelectorAll('[data-filter-value]').forEach((chip: Element) => {
                                          (chip as HTMLElement).style.display = '';
                                        });
                                      }
                                    }
                                  }
                                }
                              }}
                            />
                            <p className="text-[10px] text-muted-foreground">Press Enter to auto-select matching options</p>
                          </div>

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
                          <div className="accordion-content-wrapper flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {allVals.map((value) => {
                              const isSelected = filters[col.key]?.selectedValues.has(value);
                              return (
                                <button
                                  key={value}
                                  data-filter-value={value}
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
                    className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#1a4480] to-[#2c5aa0] text-white px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-base">{record.epNumber}</span>
                        {getStatusBadge(record.status)}
                      </div>
                      <span className="text-sm text-white/90 truncate block">{displayName}</span>
                    </div>
                    
                    {/* Card Body - Improved Layout */}
                    <div className="p-4 space-y-3">
                      {/* Date & Shift Row */}
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Date:</span>
                          <span className="text-sm font-medium">{recordAny.date || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Shift:</span>
                          <Badge variant="outline" className="text-xs font-semibold">
                            {recordAny.shift || '-'}
                          </Badge>
                        </div>
                      </div>

                      {/* Time Pairs Section */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Punch Times</span>
                        <div className="grid grid-cols-3 gap-2">
                          {['timePair1', 'timePair2', 'timePair3'].map((key, idx) => (
                            <div key={key} className="bg-muted/30 rounded-lg p-2 text-center">
                              <div className="text-[10px] text-muted-foreground mb-1">Pair {idx + 1}</div>
                              <div className="text-xs font-medium">{recordAny[key] || '-'}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hours & OT Section */}
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">HRS</div>
                          <div className="text-sm font-semibold text-emerald-600">{recordAny.hrs || '-'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">OVERSTAY</div>
                          <div className="text-sm font-semibold text-amber-600">{recordAny.overstay || '-'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">OT</div>
                          <div className="text-sm font-semibold text-blue-600">{recordAny.ot || '-'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground">OT DAYS</div>
                          <div className="text-sm font-semibold text-purple-600">{recordAny.otDays || '-'}</div>
                        </div>
                      </div>
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
