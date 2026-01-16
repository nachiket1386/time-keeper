import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { attendanceRecords, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AttendanceCalendarProps {
  companyId?: string;
}

type AttendanceStatus = 'Present' | 'Absent' | 'Partial Day' | 'On Leave' | 'Holiday';

const statusConfig: Record<AttendanceStatus, { label: string; shortLabel: string; bg: string; text: string; border: string }> = {
  'Present': { label: 'Present', shortLabel: 'P', bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500' },
  'Absent': { label: 'Absent', shortLabel: 'A', bg: 'bg-red-500', text: 'text-white', border: 'border-red-500' },
  'Partial Day': { label: 'Half', shortLabel: '½', bg: 'bg-amber-400', text: 'text-amber-900', border: 'border-amber-400' },
  'On Leave': { label: 'Leave', shortLabel: 'L', bg: 'bg-violet-500', text: 'text-white', border: 'border-violet-500' },
  'Holiday': { label: 'Holiday', shortLabel: 'H', bg: 'bg-blue-400', text: 'text-white', border: 'border-blue-400' },
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function AttendanceCalendar({ companyId }: AttendanceCalendarProps) {
  const [search, setSearch] = useState('');
  const [selectedEP, setSelectedEP] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Filter employees by company
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => !companyId || e.companyId === companyId);
  }, [companyId]);

  // Search employees
  const searchedEmployees = useMemo(() => {
    if (!search) return filteredEmployees;
    const searchLower = search.toLowerCase();
    return filteredEmployees.filter(
      e => e.name.toLowerCase().includes(searchLower) || 
           e.epNumber.toLowerCase().includes(searchLower)
    );
  }, [filteredEmployees, search]);

  // Get selected employee
  const selectedEmployee = useMemo(() => {
    return filteredEmployees.find(e => e.epNumber === selectedEP) || filteredEmployees[0];
  }, [filteredEmployees, selectedEP]);

  // Generate calendar data
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

  // Generate years for dropdown
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-muted/50 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Attendance Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {/* Search and EP Selection */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search EP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select 
            value={selectedEP || selectedEmployee?.epNumber} 
            onValueChange={setSelectedEP}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Select EP" />
            </SelectTrigger>
            <SelectContent>
              {searchedEmployees.map((emp) => (
                <SelectItem key={emp.epNumber} value={emp.epNumber}>
                  {emp.epNumber.replace('EP-2024-', 'EP')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => (
                <SelectItem key={month} value={String(idx)}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Employee Info */}
        {selectedEmployee && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
            <Avatar className="h-10 w-10 bg-primary/10 border-2 border-primary/20">
              <AvatarFallback className="text-primary font-semibold text-sm">
                {selectedEmployee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{selectedEmployee.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedEmployee.trade} • {selectedEmployee.contractor}
              </p>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[300px]">
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "text-center text-xs font-semibold py-2",
                    idx === 0 || idx === 6 ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: calendarData.firstDayOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              
              {/* Day cells */}
              {calendarData.days.map(({ day, status, mandays }) => {
                const config = status ? statusConfig[status] : null;
                const isWeekend = (calendarData.firstDayOffset + day - 1) % 7 === 0 || 
                                  (calendarData.firstDayOffset + day - 1) % 7 === 6;
                
                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                      "text-xs md:text-sm font-medium",
                      config 
                        ? cn(config.bg, config.text, "shadow-sm hover:shadow-md cursor-pointer hover:scale-105") 
                        : cn(
                            "bg-muted/20 border border-dashed border-border/50 text-muted-foreground",
                            isWeekend && "bg-muted/40"
                          )
                    )}
                    title={status ? `${status} - ${mandays} mandays` : 'No data'}
                  >
                    <span className="text-[10px] md:text-xs opacity-70 absolute top-0.5 left-1 md:top-1 md:left-1.5">
                      {day}
                    </span>
                    {config && (
                      <span className="font-bold text-sm md:text-base mt-1">
                        {config.shortLabel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4 pt-4 border-t border-border/50">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn(
                "w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold",
                config.bg, config.text
              )}>
                {config.shortLabel}
              </div>
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
