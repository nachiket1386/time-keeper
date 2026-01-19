import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { attendanceRecords, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AttendanceCalendarProps {
  companyId?: string;
}

type AttendanceStatus = 'Present' | 'Absent' | 'Partial Day' | 'On Leave' | 'Holiday';

const statusConfig: Record<AttendanceStatus, { label: string; shortLabel: string; bg: string; text: string }> = {
  'Present': { label: 'Present', shortLabel: 'P', bg: 'bg-emerald-500', text: 'text-white' },
  'Absent': { label: 'Absent', shortLabel: 'A', bg: 'bg-red-500', text: 'text-white' },
  'Partial Day': { label: 'Half', shortLabel: '½', bg: 'bg-amber-400', text: 'text-amber-900' },
  'On Leave': { label: 'Leave', shortLabel: 'L', bg: 'bg-violet-500', text: 'text-white' },
  'Holiday': { label: 'Holiday', shortLabel: 'H', bg: 'bg-blue-400', text: 'text-white' },
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function AttendanceCalendar({ companyId }: AttendanceCalendarProps) {
  const [search, setSearch] = useState('');
  const [selectedEP, setSelectedEP] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

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
    return filteredEmployees.find(e => e.epNumber === selectedEP) || filteredEmployees[0];
  }, [filteredEmployees, selectedEP]);

  const calendarData = useMemo(() => {
    if (!selectedEmployee) return { days: [], firstDayOffset: 0, stats: { present: 0, absent: 0, partial: 0, leave: 0, holiday: 0, totalMandays: 0 } };
    
    const year = selectedYear;
    const month = selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: { day: number; status: AttendanceStatus | null; mandays: number }[] = [];
    const stats = { present: 0, absent: 0, partial: 0, leave: 0, holiday: 0, totalMandays: 0 };
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceRecords.find(
        r => r.epNumber === selectedEmployee.epNumber && r.date === dateStr
      );
      
      const status = record ? (record.status as AttendanceStatus) : null;
      if (status === 'Present') stats.present++;
      else if (status === 'Absent') stats.absent++;
      else if (status === 'Partial Day') stats.partial++;
      else if (status === 'On Leave') stats.leave++;
      else if (status === 'Holiday') stats.holiday++;
      stats.totalMandays += record?.mandays || 0;
      
      days.push({ day, status, mandays: record?.mandays || 0 });
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

  return (
    <Card className="overflow-hidden w-fit">
      <CardHeader className="py-2 px-3 bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Calendar
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm w-40"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {/* Employee Info + Month Navigation */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/40">
          {selectedEmployee && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold text-sm">
                  {selectedEmployee.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{selectedEmployee.name}</p>
                <p className="text-xs text-muted-foreground truncate">{selectedEmployee.trade}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-6 w-6">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-14 h-6 text-xs px-2 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={month} value={String(idx)} className="text-sm">{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-16 h-6 text-xs px-2 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)} className="text-sm">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "text-center text-xs font-semibold py-1",
                  idx === 0 || idx === 6 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {Array.from({ length: calendarData.firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}
            {calendarData.days.map(({ day, status, mandays }) => {
              const config = status ? statusConfig[status] : null;
              const isWeekend = (calendarData.firstDayOffset + day - 1) % 7 === 0 || 
                                (calendarData.firstDayOffset + day - 1) % 7 === 6;
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center text-xs font-semibold cursor-pointer transition-transform hover:scale-105",
                    config 
                      ? cn(config.bg, config.text, "shadow-sm") 
                      : cn("bg-muted/40 text-muted-foreground border border-border/50", isWeekend && "bg-muted/60")
                  )}
                  title={status ? `Day ${day}: ${status} - ${mandays} mandays` : `Day ${day}: No data`}
                >
                  {config ? config.shortLabel : day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend + Stats */}
        <div className="mt-3 pt-2 border-t border-border/30 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1">
                <div className={cn(
                  "w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold",
                  config.bg, config.text
                )}>
                  {config.shortLabel}
                </div>
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
          
          {/* Monthly Stats */}
          <div className="grid grid-cols-3 gap-2 bg-muted/30 rounded-lg p-2">
            <div className="text-center">
              <p className="text-base font-bold text-emerald-600">{calendarData.stats.present}</p>
              <p className="text-[10px] text-muted-foreground">Present</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-red-500">{calendarData.stats.absent}</p>
              <p className="text-[10px] text-muted-foreground">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-primary">{calendarData.stats.totalMandays.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">Mandays</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
