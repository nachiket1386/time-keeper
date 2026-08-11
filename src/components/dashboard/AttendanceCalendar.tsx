import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { attendanceRecords, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DayDetailDialog } from './DayDetailDialog';

interface AttendanceCalendarProps {
  companyId?: string;
  selectedMonth?: Date;
}

type AttendanceStatus = 'Present' | 'Absent' | 'Partial Day' | 'On Leave' | 'Holiday';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function AttendanceCalendar({ companyId, selectedMonth: externalMonth }: AttendanceCalendarProps) {
  const [search, setSearch] = useState('');
  const [selectedEP, setSelectedEP] = useState<string>('');
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<number>(externalMonth?.getMonth() ?? new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(externalMonth?.getFullYear() ?? new Date().getFullYear());

  // Sync with external month selection
  useEffect(() => {
    if (externalMonth) {
      setSelectedMonth(externalMonth.getMonth());
      setSelectedYear(externalMonth.getFullYear());
    }
  }, [externalMonth]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => !companyId || e.companyId === companyId);
  }, [companyId]);

  const searchedEmployees = useMemo(() => {
    if (!search) return filteredEmployees;
    const searchLower = search.toLowerCase();
    return filteredEmployees.filter(
      e => e.name.toLowerCase().includes(searchLower) || e.epNumber.toLowerCase().includes(searchLower)
    );
  }, [filteredEmployees, search]);

  const selectedEmployee = useMemo(() => {
    if (selectedEP) {
      return filteredEmployees.find(e => e.epNumber === selectedEP);
    }
    if (search && searchedEmployees.length > 0) {
      return searchedEmployees[0];
    }
    return filteredEmployees[0];
  }, [filteredEmployees, selectedEP, search, searchedEmployees]);

  const calendarData = useMemo(() => {
    if (!selectedEmployee) return { days: [], firstDayOffset: 0, stats: { present: 0, absent: 0, exceptions: 0, total: 0 } };
    
    const year = selectedYear;
    const month = selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: { day: number; status: AttendanceStatus | null; isWeekend: boolean }[] = [];
    const stats = { present: 0, absent: 0, exceptions: 0, total: 0 };
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceRecords.find(
        r => r.epNumber === selectedEmployee.epNumber && r.date === dateStr
      );
      
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const status = record ? (record.status as AttendanceStatus) : null;
      if (status === 'Present') stats.present++;
      else if (status === 'Absent') stats.absent++;
      else if (status === 'Partial Day' || status === 'On Leave') stats.exceptions++;
      
      stats.total = stats.present + stats.absent + stats.exceptions;
      
      days.push({ day, status, isWeekend });
    }
    
    return { days, firstDayOffset: firstDay, stats };
  }, [selectedEmployee, selectedMonth, selectedYear]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSelectedEP('');
  };

  const handleSearch = () => {
    if (searchedEmployees.length > 0) {
      setSelectedEP(searchedEmployees[0].epNumber);
    }
  };

  const statusStyles: Record<AttendanceStatus, { tile: string; dot: string; label: string }> = {
    'Present': { tile: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200', dot: 'bg-emerald-500', label: 'Present' },
    'Absent': { tile: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200', dot: 'bg-red-500', label: 'Absent' },
    'Partial Day': { tile: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200', dot: 'bg-amber-500', label: 'Partial' },
    'On Leave': { tile: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200', dot: 'bg-violet-500', label: 'Leave' },
    'Holiday': { tile: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200', dot: 'bg-blue-500', label: 'Holiday' },
  };

  const legend: AttendanceStatus[] = ['Present', 'Absent', 'Partial Day', 'On Leave', 'Holiday'];

  return (
    <Card className="w-full overflow-hidden rounded-2xl border-border shadow-sm md:w-[300px] lg:w-[340px] xl:w-[372px]">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/[0.03] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <CalendarIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">Attendance Calendar</h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-3 p-3 lg:p-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search EP no or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg pl-8 pr-8 text-xs"
              aria-label="Search employee"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                aria-label="Clear"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button size="icon" onClick={handleSearch} className="h-9 w-9 shrink-0 rounded-lg" aria-label="Search">
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Employee */}
        {selectedEmployee && (
          <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
              {selectedEmployee.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{selectedEmployee.name}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{selectedEmployee.epNumber}</p>
            </div>
          </div>
        )}

        {/* Month navigation */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-1 py-1">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-7 w-7 rounded-lg" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="h-7 w-auto border-0 bg-transparent px-2 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={month} value={String(idx)} className="text-xs">{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="h-7 w-auto border-0 bg-transparent px-1.5 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)} className="text-xs">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7 rounded-lg" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { value: calendarData.stats.present, label: 'Present', cls: 'text-emerald-600 bg-emerald-50' },
            { value: calendarData.stats.absent, label: 'Absent', cls: 'text-red-600 bg-red-50' },
            { value: calendarData.stats.exceptions, label: 'Exc', cls: 'text-amber-600 bg-amber-50' },
            { value: calendarData.stats.total, label: 'Total', cls: 'text-slate-600 bg-muted' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-xl px-1 py-2 text-center', s.cls)}>
              <p className="text-base font-bold leading-none tabular-nums">{s.value}</p>
              <p className="mt-1 text-[10px] font-medium opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  'text-center text-[10px] font-semibold uppercase tracking-wide',
                  idx === 0 || idx === 6 ? 'text-muted-foreground/70' : 'text-muted-foreground'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: calendarData.firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {calendarData.days.map(({ day, status, isWeekend }) => {
              const style = status ? statusStyles[status] : null;
              return (
                <button
                  key={day}
                  type="button"
                  title={status ? `${day} ${months[selectedMonth]} — ${status}` : `${day} ${months[selectedMonth]}`}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center rounded-lg text-[11px] font-semibold transition-all hover:ring-2 hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    style
                      ? style.tile
                      : isWeekend
                        ? 'bg-muted/40 text-muted-foreground/70'
                        : 'bg-card text-foreground ring-1 ring-inset ring-border'
                  )}
                >
                  <span className="leading-none">{day}</span>
                  {style && <span className={cn('mt-1 h-1 w-1 rounded-full', style.dot)} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border pt-3">
          {legend.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
              <span className={cn('h-2 w-2 rounded-sm', statusStyles[s].dot)} />
              {statusStyles[s].label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

