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
  Check,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  CalendarOff,

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
import {
  overtimeColumns,
  overtimeData,
  regularizationColumns,
  regularizationData,
  partialDayColumns,
  partialDayReportData,
  weekOffColumns,
  weekOffData,
} from '@/data/reportData';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';

type ReportTab = 'attendance' | 'arc' | 'overtime' | 'partial' | 'regularization' | 'weekoff' | 'comprehensive';

const reportTabs = [
  { id: 'attendance' as ReportTab, label: 'Attendance', icon: Clock, color: 'emerald' },
  { id: 'arc' as ReportTab, label: 'ARC Summary', icon: FileSpreadsheet, color: 'rose' },
  { id: 'overtime' as ReportTab, label: 'Overtime', icon: Clock, color: 'amber' },
  { id: 'partial' as ReportTab, label: 'Partial Day', icon: FileText, color: 'sky' },
  { id: 'regularization' as ReportTab, label: 'Regularization', icon: ClipboardList, color: 'violet' },
  { id: 'weekoff' as ReportTab, label: 'Week-Off', icon: CalendarOff, color: 'sky' },
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

// Column definitions per report type.
// Excel-like compact fixed pixel widths; the grid scrolls horizontally inside its own container.
const attendanceColumns = [
  { key: 'epNumber', label: 'EP NO', align: 'left' as const, width: 'w-[104px] min-w-[104px]' },
  { key: 'employeeName', label: 'NAME', align: 'left' as const, width: 'w-[132px] min-w-[132px]' },
  { key: 'date', label: 'DATE', align: 'center' as const, width: 'w-[86px] min-w-[86px]' },
  { key: 'shift', label: 'SHIFT', align: 'center' as const, width: 'w-[54px] min-w-[54px]' },
  { key: 'timePairs', label: 'IN - OUT', align: 'center' as const, width: 'w-[220px] min-w-[220px]' },
  { key: 'hrs', label: 'HRS', align: 'center' as const, width: 'w-[58px] min-w-[58px]' },
  { key: 'overstay', label: 'OVERSTAY', align: 'center' as const, width: 'w-[74px] min-w-[74px]' },
  { key: 'status', label: 'STATUS', align: 'center' as const, width: 'w-[78px] min-w-[78px]' },
  { key: 'ot', label: 'OT', align: 'center' as const, width: 'w-[52px] min-w-[52px]' },
  { key: 'otDays', label: 'OT DAYS', align: 'center' as const, width: 'w-[68px] min-w-[68px]' },
  { key: 'actions', label: 'ACTIONS', align: 'center' as const, width: 'w-[72px] min-w-[72px]' },
];

const arcSummaryColumns = [
  { key: 'epNumber', label: 'EP NO', align: 'left' as const, width: 'w-[104px] min-w-[104px]' },
  { key: 'name', label: 'NAME', align: 'left' as const, width: 'w-[132px] min-w-[132px]' },
  { key: 'date', label: 'DATE', align: 'center' as const, width: 'w-[86px] min-w-[86px]' },
  { key: 'contractor', label: 'CONTRACTOR', align: 'left' as const, width: 'w-[140px] min-w-[140px]' },
  { key: 'trade', label: 'TRADE', align: 'center' as const, width: 'w-[92px] min-w-[92px]' },
  { key: 'contract', label: 'CONTRACT', align: 'center' as const, width: 'w-[88px] min-w-[88px]' },
  { key: 'status', label: 'STATUS', align: 'center' as const, width: 'w-[86px] min-w-[86px]' },
  { key: 'mandays', label: 'MANDAYS', align: 'center' as const, width: 'w-[76px] min-w-[76px]' },
  { key: 'regularHr', label: 'REG HR', align: 'center' as const, width: 'w-[70px] min-w-[70px]' },
  { key: 'ot', label: 'OT', align: 'center' as const, width: 'w-[52px] min-w-[52px]' },
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

      // Combine all time pairs into single field with | separator
      const timePairsList = [timePair1, timePair2, timePair3].filter(tp => tp !== '--');
      const timePairs = timePairsList.length > 0 ? timePairsList.join(' | ') : '--';

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
        timePairs,
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

  // Filter records (column filters)
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
  }, [enrichedRecords, filters, columns]);



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
      'P': 'bg-emerald-500 text-white',
      'Absent': 'bg-red-500 text-white',
      'A': 'bg-red-500 text-white',
      'Partial Day': 'bg-amber-400 text-amber-900',
      '.05': 'bg-amber-400 text-amber-900',
      '-1': 'bg-orange-500 text-white',
      'On Leave': 'bg-violet-500 text-white',
      'L': 'bg-violet-500 text-white',
      'Holiday': 'bg-blue-500 text-white',
      'PH': 'bg-blue-500 text-white',
    };
    return (
      <Badge className={cn('font-medium text-[10px] px-1.5 py-0 whitespace-nowrap', styles[status] || 'bg-gray-400 text-white')}>
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
    // IN / OUT punch pairs — wraps instead of forcing horizontal scroll
    if (colKey === 'timePairs' || colKey.startsWith('timePair')) {
      if (!value || value === '-' || value === '--') {
        return <span className="text-muted-foreground">-</span>;
      }
      const pairs = value.split('|').map((p) => p.trim()).filter(Boolean);
      return (
        <div className="flex flex-wrap items-center justify-center gap-1">
          {pairs.map((pair, i) => {
            const [inTime, outTime] = pair.split('-').map((p) => p.trim());
            return (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 rounded-md bg-muted/60 px-1 py-0.5 text-[11px] font-medium leading-none"
              >
                <span className={inTime && inTime !== '--' ? 'text-red-600' : 'text-muted-foreground'}>
                  {inTime || '--'}
                </span>
                <span className="text-muted-foreground">›</span>
                <span className={outTime && outTime !== '--' ? 'text-emerald-600' : 'text-muted-foreground'}>
                  {outTime || '--'}
                </span>
              </span>
            );
          })}
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
    <div className="animate-fade-in w-full max-w-full space-y-4 overflow-x-hidden pb-6">
      {/* ---------- Header ---------- */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <h1 className="truncate font-heading text-base font-bold tracking-tight text-foreground sm:text-2xl">
              {headerContent.title}
            </h1>
            {!isHeaderHidden && (
              <p className="line-clamp-2 text-[11px] text-muted-foreground sm:text-sm">
                {headerContent.description}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant={isHeaderHidden ? 'default' : 'outline'}
            onClick={() => setIsHeaderHidden(!isHeaderHidden)}
            className="h-9 w-9 shrink-0 gap-2 rounded-xl p-0 text-sm font-semibold sm:h-9 sm:w-auto sm:px-4"
            title={isHeaderHidden ? 'Show tabs & actions' : 'Hide tabs & actions'}
          >
            {isHeaderHidden ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            <span className="hidden sm:inline">{isHeaderHidden ? 'Show tabs' : 'Hide tabs'}</span>
          </Button>
        </div>

        {/* Report type tabs — single segmented track */}
        {!isHeaderHidden && (
          <div className="no-scrollbar -mx-1 mt-3 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1 sm:mx-0 sm:mt-5">
            {reportTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'flex-none whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all sm:px-5 sm:py-2.5 sm:text-sm',
                    isActive
                      ? 'bg-primary font-semibold text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-card hover:text-primary'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>


      {/* ---------- Toolbar ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            {totalRecords} records
            {hasActiveFilters && <span className="ml-1 text-primary">(filtered)</span>}
          </Badge>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clearAllFilters();
              }}
              className="h-8 gap-1.5 rounded-full text-xs"
            >
              <FilterX className="h-3 w-3" />

              Clear All
            </Button>
          )}
        </div>


        {!isHeaderHidden && (
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-none">
            <Button
              size="sm"
              className="h-8 flex-1 gap-1.5 rounded-full bg-foreground px-3 text-[11px] text-background hover:bg-foreground/90 sm:flex-none sm:px-4 sm:text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Delete {activeTab === 'arc' ? 'ARC' : reportTabs.find((t) => t.id === activeTab)?.label}
              </span>
            </Button>
            {activeTab === 'attendance' && (
              <Button size="sm" variant="destructive" className="h-8 flex-1 gap-1.5 rounded-full px-3 text-[11px] sm:flex-none sm:px-4 sm:text-xs">
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Delete All</span>
              </Button>
            )}
          </div>
        )}
      </div>


      {/* ---------- Data ---------- */}
      {isMobile ? (
        <div className="space-y-3">
          {/* Mobile Filter Sheet */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 w-full gap-2 rounded-xl text-sm font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filters & Sort
                {hasActiveFilters && (
                  <Badge className="ml-1 h-5 bg-primary px-2 text-xs text-primary-foreground">
                    {Object.entries(filters).filter(([key, filter]) => {
                      const allVals = uniqueValues[key] || [];
                      return filter.selectedValues.size < allVals.length;
                    }).length + (sortColumn ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
              <SheetHeader className="border-b border-border bg-muted/30 px-4 py-3">
                <SheetTitle className="flex items-center justify-between">
                  <span className="text-base font-semibold">Filters & Sort</span>
                  {hasActiveFilters && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        clearAllFilters();
                        setMobileFilterOpen(false);
                      }}
                      className="h-8 gap-1.5 text-destructive"
                    >
                      <FilterX className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>

              {/* Sort */}
              <div className="border-b border-border bg-background px-4 py-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">SORT BY</div>
                <div className="flex flex-wrap gap-2">
                  {columns.filter((c) => c.key !== 'actions').slice(0, 6).map((col) => (
                    <Button
                      key={col.key}
                      size="sm"
                      variant={sortColumn === col.key ? 'default' : 'outline'}
                      className="h-8 gap-1.5 rounded-full px-3 text-xs"
                      onClick={() => {
                        if (sortColumn === col.key) {
                          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                        } else {
                          handleSort(col.key, 'asc');
                        }
                      }}
                    >
                      {col.label}
                      {sortColumn === col.key &&
                        (sortDirection === 'asc' ? (
                          <ArrowUpAZ className="h-3 w-3" />
                        ) : (
                          <ArrowDownAZ className="h-3 w-3" />
                        ))}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <ScrollArea className="h-[calc(85vh-190px)]">
                <Accordion type="single" collapsible className="px-4">
                  {columns.filter((c) => c.key !== 'actions').map((col) => {
                    const allVals = uniqueValues[col.key] || [];
                    const selectedCount = filters[col.key]?.selectedValues.size || 0;
                    const isFiltered = selectedCount < allVals.length && selectedCount > 0;

                    return (
                      <AccordionItem key={col.key} value={col.key} className="border-b border-border/50">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{col.label}</span>
                            {isFiltered && (
                              <Badge variant="secondary" className="h-5 bg-primary/10 px-1.5 text-[10px] text-primary">
                                {selectedCount}/{allVals.length}
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="mb-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 flex-1 text-xs"
                              onClick={() => updateFilter(col.key, { selectedValues: new Set(allVals) })}
                            >
                              Select All
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 flex-1 text-xs"
                              onClick={() => updateFilter(col.key, { selectedValues: new Set() })}
                            >
                              Clear All
                            </Button>
                          </div>

                          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                            {allVals.map((value) => {
                              const isSelected = filters[col.key]?.selectedValues.has(value);
                              return (
                                <button
                                  key={value}
                                  className={cn(
                                    'flex max-w-full items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                                    isSelected
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                                  )}
                                  onClick={() => {
                                    const newSelected = new Set(filters[col.key]?.selectedValues || []);
                                    if (isSelected) newSelected.delete(value);
                                    else newSelected.add(value);
                                    updateFilter(col.key, { selectedValues: newSelected });
                                  }}
                                >
                                  {isSelected && <Check className="h-3 w-3 shrink-0" />}
                                  <span className="truncate">{value || '(Blank)'}</span>
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

              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4">
                <Button className="h-11 w-full text-sm font-medium" onClick={() => setMobileFilterOpen(false)}>
                  Apply Filters ({totalRecords} results)
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {paginatedRecords.length === 0 ? (
              <Card className="p-8 text-center text-sm text-muted-foreground md:col-span-2">No records found</Card>
            ) : (
              paginatedRecords.map((record, index) => {
                const recordAny = record as Record<string, string>;
                const displayName = recordAny.employeeName || recordAny.name || '-';
                const detailCols = columns.filter(
                  (c) => !['epNumber', 'employeeName', 'name', 'status', 'actions', 'timePairs'].includes(c.key)
                );
                const hasPunches = 'timePairs' in recordAny;

                return (
                  <Card
                    key={`${record.epNumber}-${recordAny.date}-${index}`}
                    className="overflow-hidden rounded-2xl border-border shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] px-4 py-3 text-white">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{record.epNumber}</div>
                        <div className="truncate text-xs text-white/85">{displayName}</div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(recordAny.status)}</div>
                    </div>

                    <div className="space-y-3 p-4">
                      {hasPunches && (
                        <div>
                          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Punch Times
                          </div>
                          {renderCell(record, 'timePairs')}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
                        {detailCols.map((col) => (
                          <div key={col.key} className="min-w-0 text-center">
                            <div className="truncate text-[10px] uppercase text-muted-foreground">{col.label}</div>
                            <div className="truncate text-xs font-semibold text-foreground" title={recordAny[col.key]}>
                              {recordAny[col.key] || '-'}
                            </div>
                          </div>
                        ))}
                      </div>

                      {columns.some((c) => c.key === 'actions') && (
                        <div className="flex justify-end gap-1 border-t border-border/60 pt-2">
                          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                            <FileText className="h-3.5 w-3.5" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Mobile Pagination */}
          <Card className="rounded-2xl p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {totalRecords === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm font-medium">
                  {currentPage}/{Math.max(totalPages, 1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Desktop — Excel-like spreadsheet grid: sticky header, sticky row gutter, horizontal scroll */
        <Card className="w-full max-w-full overflow-hidden rounded-lg border-border shadow-sm">
          <div className="max-h-[calc(100vh-300px)] w-full overflow-auto">
            <table className="w-max min-w-full border-separate border-spacing-0 text-[11px] leading-tight">
              <thead>
                <tr>
                  <th className="sticky left-0 top-0 z-30 w-[36px] min-w-[36px] border-b border-r border-white/20 bg-[hsl(var(--grid-header))] px-1 py-1 text-center text-[10px] font-semibold text-white/80">
                    #
                  </th>
                  {columns.map((col) => {
                    const isSorted = sortColumn === col.key;
                    return (
                      <th
                        key={col.key}
                        className={cn(
                          'sticky top-0 z-20 h-7 border-b border-r border-white/15 bg-[hsl(var(--grid-header))] px-1.5 py-1 font-semibold uppercase tracking-wide text-white',
                          col.width,
                          col.align === 'center' ? 'text-center' : 'text-left',
                          isSorted && 'bg-primary'
                        )}
                      >
                        <div className={cn('flex min-w-0 items-center gap-1', col.align === 'center' && 'justify-center')}>
                          <span className="truncate text-[10px]">{col.label}</span>
                          {isSorted &&
                            (sortDirection === 'asc' ? (
                              <ArrowUpAZ className="h-3 w-3 shrink-0 text-yellow-300" />
                            ) : (
                              <ArrowDownAZ className="h-3 w-3 shrink-0 text-yellow-300" />
                            ))}
                          {col.key !== 'actions' && (
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
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-muted-foreground">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record, index) => {
                    const recordAny = record as Record<string, string>;
                    const zebra = index % 2 === 0 ? 'bg-card' : 'bg-muted/40';
                    return (
                      <tr key={`${record.epNumber}-${recordAny.date}-${index}`} className="group">
                        <td
                          className={cn(
                            'sticky left-0 z-10 w-[36px] min-w-[36px] border-b border-r border-border px-1 py-0.5 text-center text-[10px] font-medium text-muted-foreground',
                            zebra,
                            'group-hover:bg-primary/10'
                          )}
                        >
                          {startIndex + index + 1}
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            title={col.key === 'timePairs' ? recordAny[col.key] : undefined}
                            className={cn(
                              'h-[26px] border-b border-r border-border px-1.5 py-0.5 align-middle tabular-nums transition-colors',
                              zebra,
                              'group-hover:bg-primary/5',
                              col.width,
                              col.align === 'center' ? 'text-center' : 'text-left',
                              col.key === 'epNumber' && 'font-medium',
                              sortColumn === col.key && 'bg-primary/[0.04]'
                            )}
                          >
                            {['status', 'actions', 'timePairs'].includes(col.key) ? (
                              renderCell(record, col.key)
                            ) : (
                              <span className="block truncate" title={recordAny[col.key]}>
                                {recordAny[col.key] || '-'}
                              </span>
                            )}
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                {totalRecords === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords}
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-7 w-16 px-2 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <ChevronLeft className="-ml-2 h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-1.5 text-[11px] font-medium">
                {currentPage}/{Math.max(totalPages, 1)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <ChevronRight className="-ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

