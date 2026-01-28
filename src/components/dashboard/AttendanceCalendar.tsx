import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { attendanceRecords, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

  const getStatusColor = (status: AttendanceStatus | null, isWeekend: boolean) => {
    if (!status) {
      return isWeekend ? 'text-muted-foreground' : 'text-foreground';
    }
    switch (status) {
      case 'Present':
        return 'bg-emerald-500 text-white';
      case 'Absent':
        return 'bg-red-500 text-white';
      case 'Partial Day':
      case 'On Leave':
        return 'bg-amber-500 text-white';
      case 'Holiday':
        return 'bg-blue-500 text-white';
      default:
        return isWeekend ? 'text-muted-foreground' : 'text-foreground';
    }
  };

  return (
    <Card className="overflow-hidden w-full md:w-[280px] lg:w-[320px] xl:w-[360px]">
      {/* Header */}
      <div className="bg-primary/5 border-b px-3 md:px-2 lg:px-4 py-2 md:py-2 lg:py-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm md:text-xs lg:text-sm text-foreground">Attendance Calendar</h3>
            <p className="text-xs text-muted-foreground hidden lg:block">
              Dashboard: {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 md:p-2 lg:p-4 space-y-3 md:space-y-2 lg:space-y-4">
        {/* Search Input */}
        <div className="flex gap-1.5 md:gap-1 lg:gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="PP5000039084"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8 h-9 md:h-8 lg:h-10 font-mono text-xs md:text-[11px] lg:text-sm border-2"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearSearch}
            className="h-9 w-9 md:h-8 md:w-8 lg:h-10 lg:w-10 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSearch}
            className="h-9 w-9 md:h-8 md:w-8 lg:h-10 lg:w-10 shrink-0 bg-primary hover:bg-primary/90"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-muted/30 rounded-lg px-1.5 md:px-1 lg:px-2 py-1">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-7 w-7 md:h-6 md:w-6 lg:h-8 lg:w-8">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1">
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-auto h-7 md:h-6 lg:h-8 text-xs md:text-[11px] lg:text-sm px-2 border-0 bg-transparent font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={month} value={String(idx)} className="text-xs">{month.substring(0, 3)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-auto h-7 md:h-6 lg:h-8 text-xs md:text-[11px] lg:text-sm px-1.5 border-0 bg-transparent font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)} className="text-xs">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7 md:h-6 md:w-6 lg:h-8 lg:w-8">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Employee Name */}
        {selectedEmployee && (
          <div className="flex items-center gap-2 py-1.5 md:py-1 lg:py-2 border-b">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-xs md:text-[11px] lg:text-sm uppercase tracking-wide truncate">
              {selectedEmployee.name}
            </span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-1 md:gap-1 lg:gap-2 text-center">
          <div>
            <p className="text-lg md:text-lg lg:text-xl font-bold text-emerald-600">{calendarData.stats.present}</p>
            <p className="text-[10px] md:text-xs lg:text-xs text-muted-foreground">Present</p>
          </div>
          <div>
            <p className="text-lg md:text-lg lg:text-xl font-bold text-red-500">{calendarData.stats.absent}</p>
            <p className="text-[10px] md:text-xs lg:text-xs text-muted-foreground">Absent</p>
          </div>
          <div>
            <p className="text-lg md:text-lg lg:text-xl font-bold text-amber-500">{calendarData.stats.exceptions}</p>
            <p className="text-[10px] md:text-xs lg:text-xs text-muted-foreground">Exc</p>
          </div>
          <div>
            <p className="text-lg md:text-lg lg:text-xl font-bold text-muted-foreground">{calendarData.stats.total}</p>
            <p className="text-[10px] md:text-xs lg:text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1 md:space-y-0.5 lg:space-y-2">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-0.5">
            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "text-center text-[10px] md:text-xs lg:text-xs font-semibold py-1 md:py-1 lg:py-2",
                  idx === 0 || idx === 6 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Empty cells for offset */}
            {Array.from({ length: calendarData.firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}
            
            {/* Day cells */}
            {calendarData.days.map(({ day, status, isWeekend }) => {
              const hasStatus = status !== null;
              const colorClass = getStatusColor(status, isWeekend);
              
              return (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center"
                >
                  <div
                    className={cn(
                      "w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-[11px] md:text-xs lg:text-sm font-medium transition-transform hover:scale-110 cursor-pointer",
                      hasStatus ? colorClass : (isWeekend ? "text-muted-foreground" : "text-foreground hover:bg-muted")
                    )}
                    title={status ? `Day ${day}: ${status}` : `Day ${day}`}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
