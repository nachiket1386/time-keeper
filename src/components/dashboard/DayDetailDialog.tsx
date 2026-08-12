import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { attendanceRecords } from '@/data/mockData';
import {
  overtimeData,
  partialDayReportData,
  regularizationData,
  weekOffData,
} from '@/data/reportData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Clock, CalendarDays, LogIn, LogOut, Timer } from 'lucide-react';

interface DayDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  epNumber?: string;
  employeeName?: string;
  /** ISO date yyyy-MM-dd */
  date: string | null;
}

const statusTone: Record<string, string> = {
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Absent: 'bg-red-50 text-red-700 border-red-200',
  'Partial Day': 'bg-amber-50 text-amber-700 border-amber-200',
  'On Leave': 'bg-violet-50 text-violet-700 border-violet-200',
  Holiday: 'bg-blue-50 text-blue-700 border-blue-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
};

function Tone({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('h-6 rounded-md px-2.5 text-xs font-semibold', statusTone[value] ?? 'bg-muted text-muted-foreground border-border')}
    >
      {value}
    </Badge>
  );
}

/** yyyy-MM-dd -> dd-MM-yyyy (report data format) */
const toReportDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

export function DayDetailDialog({ open, onOpenChange, epNumber, employeeName, date }: DayDetailDialogProps) {
  const record = useMemo(
    () => (date && epNumber ? attendanceRecords.find(r => r.epNumber === epNumber && r.date === date) : undefined),
    [date, epNumber]
  );

  const requests = useMemo(() => {
    if (!date || !epNumber) return [];
    const rd = toReportDate(date);
    const rows: { type: string; status: string; details: { label: string; value: string }[] }[] = [];

    const ot = overtimeData.find(r => r.epNumber === epNumber && r.punchDate === rd);
    if (ot) rows.push({
      type: 'Overtime', status: ot.status,
      details: [
        { label: 'Actual overstay', value: ot.actualOverstay },
        { label: 'Requested OT', value: ot.requestedOvertime },
        { label: 'Approved OT', value: ot.approvedOvertime },
        { label: 'Requested EIC', value: ot.requestedEicName },
      ],
    });

    const pd = partialDayReportData.find(r => r.epNumber === epNumber && r.punchDate === rd);
    if (pd) rows.push({
      type: 'Partial Day', status: pd.status,
      details: [
        { label: 'Actual PD hrs', value: pd.actualPdHours },
        { label: 'Requested PD hrs', value: pd.requestedPdHours },
        { label: 'Approved PD hrs', value: pd.approvedPdHours },
        { label: 'Manday conversion', value: pd.mandayConversion },
        { label: 'Requested EIC', value: pd.requestedEicName },
      ],
    });

    const reg = regularizationData.find(r => r.epNumber === epNumber && r.punchDate === rd);
    if (reg) rows.push({
      type: 'Regularization', status: reg.status,
      details: [
        { label: 'Old punch in / out', value: `${reg.oldPunchIn} - ${reg.oldPunchOut}` },
        { label: 'New punch in / out', value: `${reg.newPunchIn} - ${reg.newPunchOut}` },
        { label: 'Requested EIC', value: reg.requestedEicName },
      ],
    });

    const wo = weekOffData.find(r => r.epNumber === epNumber && r.weekOffDate === rd);
    if (wo) rows.push({
      type: 'Week-Off', status: wo.status,
      details: [
        { label: 'Punch 1 / Punch 2', value: `${wo.punch1} - ${wo.punch2}` },
        { label: 'Overtime', value: wo.overtime },
        { label: 'Requested EIC', value: wo.requestedEicName },
      ],
    });

    return rows;
  }, [date, epNumber]);

  const hours = useMemo(() => {
    if (!record?.punchIn || !record?.punchOut) return '--';
    const [ih, im] = record.punchIn.split(':').map(Number);
    const [oh, om] = record.punchOut.split(':').map(Number);
    const mins = oh * 60 + om - (ih * 60 + im);
    if (mins <= 0) return '--';
    return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  }, [record]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="font-heading text-lg">Attendance Data</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {employeeName} · <span className="font-mono">{epNumber}</span>
            {date && <> · {format(new Date(`${date}T00:00:00`), 'dd MMM yyyy (EEEE)')}</>}
          </p>
        </DialogHeader>

        {/* Attendance summary */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" /> Attendance
            </span>
            <Tone value={record?.status ?? 'No Record'} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Clock, label: 'Shift', value: 'General' },
              { icon: LogIn, label: 'Punch In', value: record?.punchIn || '--' },
              { icon: LogOut, label: 'Punch Out', value: record?.punchOut || '--' },
              { icon: Timer, label: 'Hours', value: hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg bg-muted/50 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          {record && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div><span className="text-muted-foreground">Mandays: </span><span className="font-semibold">{record.mandays}</span></div>
              <div><span className="text-muted-foreground">OT: </span><span className="font-semibold">{record.overtime} hr</span></div>
              <div className="col-span-2"><span className="text-muted-foreground">Contractor: </span><span className="font-semibold">{record.contractor}</span></div>
            </div>
          )}
        </div>

        {/* Requests */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Request Status</p>
          {requests.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
              No Overtime, Partial Day, Regularization or Week-Off request for this date.
            </p>
          ) : (
            requests.map(r => (
              <div key={r.type} className="rounded-xl border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{r.type}</span>
                  <Tone value={r.status} />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {r.details.map(d => (
                    <div key={d.label} className="flex justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
