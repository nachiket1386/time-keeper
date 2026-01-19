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
    if (!selectedEmployee) return { days: [], firstDayOffset: 0 };
    
    const year = selectedYear;
    const month = selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: { day: number; status: AttendanceStatus | null; mandays: number }[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceRecords.find(
        r => r.epNumber === selectedEmployee.epNumber && r.date === dateStr
      );
      
      days.push({
        day,
        status: record ? (record.status as AttendanceStatus) : null,
        mandays: record?.mandays || 0
      });
    }
    
    return { days, firstDayOffset: firstDay };
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
    <Card className="overflow-hidden h-full">
      <CardHeader className="py-1.5 px-2 bg-muted/30">
        <div className="flex items-center justify-between gap-1">
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-primary" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="relative">
              <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-5 h-5 text-[10px] w-20"
              />
            </div>
            <Select 
              value={selectedEP || selectedEmployee?.epNumber} 
              onValueChange={setSelectedEP}
            >
              <SelectTrigger className="w-16 h-5 text-[10px] px-1">
                <SelectValue placeholder="EP" />
              </SelectTrigger>
              <SelectContent>
                {searchedEmployees.map((emp) => (
                  <SelectItem key={emp.epNumber} value={emp.epNumber} className="text-xs">
                    {emp.epNumber.replace('EP-2024-', 'EP')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-1.5">
        {/* Employee Info + Month Navigation */}
        <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-border/40">
          {selectedEmployee && (
            <div className="flex items-center gap-1 min-w-0">
              <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold text-[8px]">
                  {selectedEmployee.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-[10px] truncate leading-tight">{selectedEmployee.name}</p>
                <p className="text-[8px] text-muted-foreground truncate leading-tight">{selectedEmployee.trade}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-0">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-4 w-4">
              <ChevronLeft className="h-2.5 w-2.5" />
            </Button>
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-10 h-4 text-[9px] px-1 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={month} value={String(idx)} className="text-xs">{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-11 h-4 text-[9px] px-1 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)} className="text-xs">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-4 w-4">
              <ChevronRight className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>

        {/* Compact Calendar Grid */}
        <div className="max-w-[220px] mx-auto">
          <div className="grid grid-cols-7 gap-0.5">
            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "text-center text-[8px] font-medium",
                  idx === 0 || idx === 6 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 mt-0.5">
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
                    "aspect-square rounded-[2px] flex items-center justify-center text-[8px] font-medium cursor-pointer",
                    config 
                      ? cn(config.bg, config.text, "hover:opacity-90") 
                      : cn("bg-muted/30 text-muted-foreground", isWeekend && "bg-muted/50")
                  )}
                  title={status ? `Day ${day}: ${status} - ${mandays} mandays` : `Day ${day}: No data`}
                >
                  {config ? config.shortLabel : day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact Legend */}
        <div className="flex flex-wrap items-center justify-center gap-1 mt-1 pt-1 border-t border-border/30">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-0.5">
              <div className={cn(
                "w-3 h-3 rounded-[2px] flex items-center justify-center text-[6px] font-bold",
                config.bg, config.text
              )}>
                {config.shortLabel}
              </div>
              <span className="text-[8px] text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
