import { useState } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AttendanceCalendar } from '@/components/dashboard/AttendanceCalendar';
import { ARCSummaryTable } from '@/components/dashboard/ARCSummaryTable';
import { StatusSummaryTable } from '@/components/dashboard/StatusSummaryTable';
import { cn } from '@/lib/utils';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(pickerYear, monthIndex, 1);
    setSelectedDate(newDate);
    setIsDatePickerOpen(false);
  };

  const handlePrevYear = () => {
    setPickerYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setPickerYear(prev => prev + 1);
  };

  // Date range for filtering
  const dateRange = {
    start: format(startOfMonth(selectedDate), 'yyyy-MM-dd'),
    end: format(endOfMonth(selectedDate), 'yyyy-MM-dd'),
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Date Picker Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 h-9 px-4">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{format(selectedDate, 'MMMM yyyy')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="end">
            {/* Year Navigation */}
            <div className="flex items-center justify-between p-3 border-b">
              <Button variant="ghost" size="icon" onClick={handlePrevYear} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg">{pickerYear}</span>
              <Button variant="ghost" size="icon" onClick={handleNextYear} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2 p-3">
              {months.map((month, index) => {
                const isSelected = 
                  selectedDate.getMonth() === index && 
                  selectedDate.getFullYear() === pickerYear;
                const isCurrent = 
                  new Date().getMonth() === index && 
                  new Date().getFullYear() === pickerYear;
                return (
                  <Button
                    key={month}
                    variant={isSelected ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      'h-9 text-xs font-medium',
                      isSelected && 'bg-primary text-primary-foreground',
                      !isSelected && isCurrent && 'border border-primary text-primary'
                    )}
                  >
                    {month.substring(0, 3)}
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar + ARC Summary Side by Side on Desktop */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="shrink-0">
          <AttendanceCalendar companyId={user?.companyId} selectedMonth={selectedDate} />
        </div>
        <div className="flex-1 min-w-0">
          <ARCSummaryTable companyId={user?.companyId} dateRange={dateRange} />
        </div>
      </div>

      {/* Status Summary Tables */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <StatusSummaryTable companyId={user?.companyId} type="overtime" dateRange={dateRange} />
        <StatusSummaryTable companyId={user?.companyId} type="regularization" dateRange={dateRange} />
        <StatusSummaryTable companyId={user?.companyId} type="partialday" dateRange={dateRange} />
      </div>
    </div>
  );
}
