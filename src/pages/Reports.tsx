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
import { useIsMobile } from '@/hooks/use-mobile';

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

// Column definitions
const columns = [
  { key: 'epNumber', label: 'EP NO', align: 'left' as const },
  { key: 'employeeName', label: 'EP NAME', align: 'center' as const },
  { key: 'shift', label: 'SHIFT', align: 'center' as const },
  { key: 'date', label: 'PUNCHDATE', align: 'center' as const },
  { key: 'punch1', label: 'PUNCH1', align: 'center' as const },
  { key: 'punch2', label: 'PUNCH2 OUT', align: 'center' as const },
  { key: 'hrs', label: 'HRS', align: 'center' as const },
  { key: 'overstay', label: 'OVERSTAY', align: 'center' as const },
  { key: 'status', label: 'STATUS', align: 'left' as const },
  { key: 'ot', label: 'OT', align: 'center' as const },
  { key: 'otDays', label: 'OT DAYS', align: 'center' as const },
];

export default function Reports() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  // Toggle navbar visibility
  useEffect(() => {
    const navbar = document.querySelector('header.sticky');
    if (navbar) {
      if (isNavbarHidden) {
        navbar.classList.add('!hidden');
      } else {
        navbar.classList.remove('!hidden');
      }
    }
    return () => {
      // Cleanup: show navbar when leaving the page
      const navbarEl = document.querySelector('header.sticky');
      if (navbarEl) {
        navbarEl.classList.remove('!hidden');
      }
    };
  }, [isNavbarHidden]);

  // Build enriched records with all displayable values
  const enrichedRecords = useMemo(() => {
    return attendanceRecords.map(record => {
      const employee = employees.find(e => e.epNumber === record.epNumber);
      return {
        epNumber: record.epNumber,
        employeeName: employee?.name || '-',
        shift: record.punchIn && record.punchOut ? `${record.punchIn}-${record.punchOut}` : '-',
        date: record.date,
        punch1: record.punchIn || '-',
        punch2: record.punchOut || '-',
        hrs: record.punchIn && record.punchOut ? '8.0' : '-',
        overstay: '-',
        status: record.status,
        ot: record.overtime?.toString() || '-',
        otDays: record.mandays?.toFixed(1) || '0.0',
      };
    });
  }, []);

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

  // Update filters when uniqueValues change
  useEffect(() => {
    setFilters(prev => {
      const updated: Record<string, ColumnFilter> = {};
      columns.forEach(col => {
        if (prev[col.key]) {
          updated[col.key] = prev[col.key];
        } else {
          updated[col.key] = { selectedValues: new Set(uniqueValues[col.key] || []) };
        }
      });
      return updated;
    });
  }, [uniqueValues]);

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
    return value;
  };

  return (
    <div className="animate-fade-in space-y-3 pb-6">
      <PageHeader
        title="Attendance Data"
        description="View and manage attendance records."
      />

      {/* Report Type Tabs + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {reportTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
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
                <IconComponent className="h-3 w-3" />
                {tab.label}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Navbar Button */}
          <Button 
            size="sm" 
            variant={isNavbarHidden ? "default" : "outline"}
            onClick={() => setIsNavbarHidden(!isNavbarHidden)} 
            className="gap-1.5 h-7 text-xs"
            title={isNavbarHidden ? "Show Navigation" : "Hide Navigation"}
          >
            {isNavbarHidden ? (
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
          {hasActiveFilters && (
            <Button size="sm" variant="outline" onClick={clearAllFilters} className="gap-1.5 h-7 text-xs">
              <FilterX className="h-3 w-3" />
              Clear All
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
              paginatedRecords.map((record, index) => (
                <Card 
                  key={`${record.epNumber}-${record.date}-${index}`} 
                  className="overflow-hidden border-l-4 border-l-primary"
                >
                  {/* Card Header */}
                  <div className="bg-[#1a4480] text-white px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{record.epNumber}</span>
                      <span className="text-white/80 text-xs">•</span>
                      <span className="text-sm truncate max-w-[150px]">{record.employeeName}</span>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  
                  {/* Card Body - Grid Layout */}
                  <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Date</span>
                      <span className="font-medium text-xs">{record.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Shift</span>
                      <span className="font-medium text-xs">{record.shift}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Punch In</span>
                      <span className="font-medium text-xs text-emerald-600">{record.punch1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Punch Out</span>
                      <span className="font-medium text-xs text-red-600">{record.punch2}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Hours</span>
                      <span className="font-medium text-xs">{record.hrs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Overstay</span>
                      <span className="font-medium text-xs">{record.overstay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">OT</span>
                      <span className="font-medium text-xs text-primary">{record.ot}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">OT Days</span>
                      <span className="font-medium text-xs">{record.otDays}</span>
                    </div>
                  </div>
                </Card>
              ))
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
