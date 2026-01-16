import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarDays } from 'lucide-react';
import { attendanceRecords, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AttendanceCalendarProps {
  companyId?: string;
}

export function AttendanceCalendar({ companyId }: AttendanceCalendarProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedEp, setSelectedEp] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((e) => !companyId || e.companyId === companyId)
      .filter((e) => 
        searchQuery === '' ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.epNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [companyId, searchQuery]);

  const selectedEmployee = employees.find((e) => e.epNumber === selectedEp);

  const employeeAttendance = useMemo(() => {
    if (!selectedEp) return [];
    return attendanceRecords.filter((r) => r.epNumber === selectedEp);
  }, [selectedEp]);

  const calendarDate = new Date(selectedYear, selectedMonth, 1);

  const getStatusForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const record = employeeAttendance.find((r) => r.date === dateStr);
    return record?.status;
  };

  const statusColors: Record<string, string> = {
    'Present': 'bg-success text-success-foreground',
    'Absent': 'bg-destructive text-destructive-foreground',
    'Partial Day': 'bg-warning text-warning-foreground',
    'On Leave': 'bg-info text-info-foreground',
    'Holiday': 'bg-muted text-muted-foreground',
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Calculate attendance summary for selected employee and month
  const attendanceSummary = useMemo(() => {
    if (!selectedEp) return null;

    const monthRecords = employeeAttendance.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });

    return {
      present: monthRecords.filter((r) => r.status === 'Present').length,
      absent: monthRecords.filter((r) => r.status === 'Absent').length,
      partial: monthRecords.filter((r) => r.status === 'Partial Day').length,
      leave: monthRecords.filter((r) => r.status === 'On Leave').length,
      holiday: monthRecords.filter((r) => r.status === 'Holiday').length,
      totalMandays: monthRecords.reduce((sum, r) => sum + r.mandays, 0),
    };
  }, [selectedEp, selectedMonth, selectedYear, employeeAttendance]);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Attendance Calendar
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* EP Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search EP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* EP Select */}
          <Select value={selectedEp} onValueChange={setSelectedEp}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {filteredEmployees.map((emp) => (
                <SelectItem key={emp.epNumber} value={emp.epNumber}>
                  {emp.epNumber} - {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => (
                <SelectItem key={month} value={String(idx)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Select */}
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployee ? (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.epNumber} • {selectedEmployee.contractor} • {selectedEmployee.trade}
                  </p>
                </div>
                {attendanceSummary && (
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-success/10 text-success border-success/20">
                      {attendanceSummary.present} Present
                    </Badge>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                      {attendanceSummary.absent} Absent
                    </Badge>
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      {attendanceSummary.partial} Partial
                    </Badge>
                    <Badge className="bg-info/10 text-info border-info/20">
                      {attendanceSummary.totalMandays.toFixed(1)} Mandays
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="flex justify-center overflow-x-auto">
              <Calendar
                mode="single"
                month={calendarDate}
                onMonthChange={(date) => {
                  setSelectedMonth(date.getMonth());
                  setSelectedYear(date.getFullYear());
                }}
                className="rounded-xl border shadow-sm"
                modifiers={{
                  present: (date) => getStatusForDate(date) === 'Present',
                  absent: (date) => getStatusForDate(date) === 'Absent',
                  partial: (date) => getStatusForDate(date) === 'Partial Day',
                  leave: (date) => getStatusForDate(date) === 'On Leave',
                  holiday: (date) => getStatusForDate(date) === 'Holiday',
                }}
                modifiersClassNames={{
                  present: 'bg-success text-success-foreground hover:bg-success/90',
                  absent: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                  partial: 'bg-warning text-warning-foreground hover:bg-warning/90',
                  leave: 'bg-info text-info-foreground hover:bg-info/90',
                  holiday: 'bg-muted text-muted-foreground',
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={cn('w-4 h-4 rounded', color)} />
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Select an Employee</p>
            <p className="text-sm">Choose an employee to view their attendance calendar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
