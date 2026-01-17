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
      <CardHeader className="py-2 px-3 bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Attendance Calendar
          </CardTitle>
          
          {/* Search and EP Selection */}
          <div className="flex items-center gap-1.5 flex-1 max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-6 h-6 text-xs"
              />
            </div>
            <Select 
              value={selectedEP || selectedEmployee?.epNumber} 
              onValueChange={setSelectedEP}
            >
              <SelectTrigger className="w-[80px] h-6 text-xs">
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
      
      <CardContent className="p-2">
        {/* Employee Info + Month Navigation */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/50">
          {selectedEmployee && (
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-[10px]">
                  {selectedEmployee.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs truncate">{selectedEmployee.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">{selectedEmployee.trade}</p>
              </div>
            </div>
          )}
          
          {/* Month/Year Navigation */}
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-5 w-5">
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-[50px] h-5 text-[10px] px-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => (
                  <SelectItem key={month} value={String(idx)} className="text-xs">{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-[55px] h-5 text-[10px] px-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)} className="text-xs">{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-5 w-5">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Compact Calendar Grid */}
        <div className="max-w-[280px] mx-auto">
          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-px mb-0.5">
            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "text-center text-[9px] font-medium py-0.5",
                  idx === 0 || idx === 6 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px">
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
                    "aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium transition-all cursor-pointer",
                    config 
                      ? cn(config.bg, config.text, "hover:opacity-90") 
                      : cn(
                          "bg-muted/30 text-muted-foreground border border-dashed border-border/40",
                          isWeekend && "bg-muted/50"
                        )
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
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 pt-1.5 border-t border-border/30">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-0.5">
              <div className={cn(
                "w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-bold",
                config.bg, config.text
              )}>
                {config.shortLabel}
              </div>
              <span className="text-[9px] text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
