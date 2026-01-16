import { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceRecords, employees, contractors } from '@/data/mockData';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = { key: string; direction: SortDirection };

// Status color configuration
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  'Present': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  'Absent': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  'Partial Day': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  'On Leave': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  'Holiday': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
};

// Column definitions
const columns = [
  { key: 'date', header: 'Date', width: 'w-24', sortable: true, filterable: true },
  { key: 'epNumber', header: 'EP Number', width: 'w-28', sortable: true, filterable: true },
  { key: 'employeeName', header: 'Employee Name', width: 'w-40', sortable: true, filterable: true },
  { key: 'contractor', header: 'Contractor', width: 'w-36', sortable: true, filterable: true },
  { key: 'department', header: 'Department', width: 'w-28', sortable: true, filterable: true },
  { key: 'punchIn', header: 'Punch In', width: 'w-20', sortable: true },
  { key: 'punchOut', header: 'Punch Out', width: 'w-20', sortable: true },
  { key: 'status', header: 'Status', width: 'w-24', sortable: true, filterable: true },
  { key: 'overtime', header: 'OT (hrs)', width: 'w-20', sortable: true, className: 'text-center' },
  { key: 'mandays', header: 'Mandays', width: 'w-20', sortable: true, className: 'text-center' },
];

export default function Attendance() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const baseRecords = attendanceRecords.filter((r) => {
      if (user?.role === 'user1' && user.assignedEmployees) {
        return user.assignedEmployees.includes(r.employeeId);
      }
      if (user?.companyId) {
        return r.companyId === user.companyId;
      }
      return true;
    });

    return {
      date: [...new Set(baseRecords.map(r => r.date))].sort().reverse().slice(0, 30),
      epNumber: [...new Set(baseRecords.map(r => r.epNumber))].sort(),
      employeeName: [...new Set(baseRecords.map(r => r.employeeName))].sort(),
      contractor: [...new Set(baseRecords.map(r => r.contractor))].sort(),
      department: [...new Set(baseRecords.map(r => r.department))].sort(),
      status: ['Present', 'Absent', 'Partial Day', 'On Leave', 'Holiday'],
    };
  }, [user]);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let records = attendanceRecords.filter((r) => {
      if (user?.role === 'user1' && user.assignedEmployees) {
        return user.assignedEmployees.includes(r.employeeId);
      }
      if (user?.companyId) {
        return r.companyId === user.companyId;
      }
      return true;
    });

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(searchLower) ||
          r.epNumber.toLowerCase().includes(searchLower) ||
          r.contractor.toLowerCase().includes(searchLower)
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        records = records.filter((r) => values.includes(String(r[key as keyof typeof r])));
      }
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      records = [...records].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || '');
        const bStr = String(bVal || '');
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }

    return records;
  }, [user, search, columnFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key 
        ? prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
        : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    setColumnFilters(prev => {
      const current = prev[key] || [];
      if (checked) {
        return { ...prev, [key]: [...current, value] };
      } else {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
    });
    setCurrentPage(1);
  };

  const clearFilter = (key: string) => {
    setColumnFilters(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setSearch('');
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(columnFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance Records"
        description="View and manage employee attendance data"
        breadcrumbs={[{ label: 'Attendance' }]}
        actions={
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Quick Search & Stats */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Quick search by name, EP, or contractor..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{paginatedRecords.length}</span> of{' '}
                <span className="font-semibold text-foreground">{filteredRecords.length}</span> records
              </span>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-destructive">
                  <X className="h-3 w-3" />
                  Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excel-like Table */}
      <Card className="overflow-hidden border-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header Row with Filters */}
            <thead>
              <tr className="bg-muted/80 border-b-2 border-primary/20">
                {columns.map((col) => (
                  <th 
                    key={col.key} 
                    className={cn(
                      "text-left font-semibold text-xs uppercase tracking-wide",
                      "border-r border-border/50 last:border-r-0",
                      col.width,
                      col.className
                    )}
                  >
                    <div className="flex flex-col">
                      {/* Header with Sort */}
                      <button
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={cn(
                          "flex items-center gap-1 px-3 py-2.5 w-full text-left hover:bg-muted transition-colors",
                          col.sortable && "cursor-pointer"
                        )}
                      >
                        <span className="truncate">{col.header}</span>
                        {col.sortable && (
                          <span className="shrink-0">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUp className="h-3 w-3 text-primary" />
                              ) : sortConfig.direction === 'desc' ? (
                                <ArrowDown className="h-3 w-3 text-primary" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-50" />
                            )}
                          </span>
                        )}
                      </button>
                      
                      {/* Filter Dropdown */}
                      {col.filterable && filterOptions[col.key as keyof typeof filterOptions] && (
                        <div className="px-2 pb-2 border-t border-border/30">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                  "w-full h-7 justify-between text-xs font-normal",
                                  columnFilters[col.key]?.length > 0 && "bg-primary/10 text-primary"
                                )}
                              >
                                <span className="flex items-center gap-1">
                                  <Filter className="h-3 w-3" />
                                  {columnFilters[col.key]?.length > 0 
                                    ? `${columnFilters[col.key].length} selected` 
                                    : 'Filter'}
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="start">
                              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                                <span className="text-xs font-semibold">Filter {col.header}</span>
                                {columnFilters[col.key]?.length > 0 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => clearFilter(col.key)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {filterOptions[col.key as keyof typeof filterOptions]?.map((option) => (
                                  <label 
                                    key={option} 
                                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={columnFilters[col.key]?.includes(option) || false}
                                      onCheckedChange={(checked) => 
                                        handleFilterChange(col.key, option, checked as boolean)
                                      }
                                    />
                                    <span className="text-sm truncate">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Data Rows */}
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                    No records found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, idx) => (
                  <tr 
                    key={record.id}
                    className={cn(
                      "border-b border-border/50 hover:bg-primary/5 transition-colors",
                      idx % 2 === 0 ? "bg-card" : "bg-muted/20"
                    )}
                  >
                    <td className="px-3 py-2.5 border-r border-border/30 font-mono text-xs">
                      {record.date}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 font-mono text-xs font-medium text-primary">
                      {record.epNumber.replace('EP-2024-', 'EP')}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 font-medium truncate max-w-[160px]">
                      {record.employeeName}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 text-muted-foreground truncate max-w-[144px]">
                      {record.contractor}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 text-muted-foreground">
                      {record.department}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 font-mono text-xs text-center">
                      {record.punchIn || '-'}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30 font-mono text-xs text-center">
                      {record.punchOut || '-'}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border/30">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        statusColors[record.status]?.bg,
                        statusColors[record.status]?.text,
                        statusColors[record.status]?.border
                      )}>
                        {record.status}
                      </span>
                    </td>
                    <td className={cn(
                      "px-3 py-2.5 border-r border-border/30 text-center font-mono text-xs",
                      record.overtime > 0 && "text-orange-600 font-semibold"
                    )}>
                      {record.overtime > 0 ? record.overtime : '-'}
                    </td>
                    <td className={cn(
                      "px-3 py-2.5 text-center font-mono text-xs",
                      record.mandays === 1 && "text-emerald-600 font-semibold",
                      record.mandays === 0.5 && "text-amber-600 font-semibold",
                      record.mandays === 0 && "text-muted-foreground"
                    )}>
                      {record.mandays}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-muted/50 border-t-2 border-primary/10">
          <div className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span>
            {' '}• Total: <span className="font-semibold text-foreground">{filteredRecords.length}</span> records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
