import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function MyAttendance() {
  const { user } = useAuth();
  const location = useLocation();
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const date = new Date(`${month}-01T00:00:00`);
  const records = useQuery({
    queryKey: ['my-attendance', user?.id, user?.employeeId, month],
    enabled: Boolean(user?.employeeId),
    queryFn: async () => {
      if (!user?.employeeId) return [];
      const { data, error } = await supabase.from('attendance_records').select('*')
        .eq('employee_id', user.employeeId)
        .gte('attendance_date', format(startOfMonth(date), 'yyyy-MM-dd'))
        .lte('attendance_date', format(endOfMonth(date), 'yyyy-MM-dd'))
        .order('attendance_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const rows = records.data ?? [];
  const time = (value: string | null) => value ? format(new Date(value), 'HH:mm') : '—';
  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{location.pathname.startsWith('/reports') ? 'My Attendance Report' : 'My Attendance'}</h1>
          <p className="text-muted-foreground">{user?.employeeName || user?.name}{user?.employeeCode ? ` · ${user.employeeCode}` : ''}</p></div>
        <label className="space-y-1 text-sm">Month<Input aria-label="Month" type="month" value={month} onChange={(e) => { if (/^\d{4}-\d{2}$/.test(e.target.value)) setMonth(e.target.value); }} /></label>
      </div>
      {!user?.employeeId ? <p className="p-6 border rounded-lg text-muted-foreground">Your account is not linked to an employee yet. Contact your administrator.</p>
        : records.isError ? <div role="alert"><p>Attendance could not be loaded.</p><Button variant="outline" onClick={() => records.refetch()}>Try again</Button></div>
        : records.isLoading ? <p role="status">Loading attendance…</p> : <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['Recorded days', rows.length], ['Present', rows.filter(r => r.status === 'P').length], ['Total hours', rows.reduce((n, r) => n + Number(r.total_hours ?? 0), 0).toFixed(2)], ['Overtime hours', rows.reduce((n, r) => n + Number(r.overtime_hours ?? 0), 0).toFixed(2)]].map(([label, value]) => <div key={label} className="border rounded-lg p-4 bg-card"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold">{value}</p></div>)}
          </div>
          {rows.length === 0 ? <p className="py-8 text-center text-muted-foreground">No attendance records for this month.</p> : <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(row => <article key={row.id} className="border rounded-lg p-4 bg-card space-y-3">
              <div className="flex justify-between items-center"><h2 className="font-semibold">{format(new Date(`${row.attendance_date}T00:00:00`), 'dd MMM yyyy')}</h2><StatusBadge status={row.status} /></div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {[[row.punch_in_1, row.punch_out_1], [row.punch_in_2, row.punch_out_2], [row.punch_in_3, row.punch_out_3]].map(([start, end], index) => <div key={index}><dt className="text-muted-foreground">In / Out {index + 1}</dt><dd>{time(start)} / {time(end)}</dd></div>)}
                <div><dt className="text-muted-foreground">Hours / Overtime</dt><dd>{row.total_hours ?? 0} / {row.overtime_hours ?? 0}</dd></div>
              </dl>
              {row.remarks && <p className="text-sm break-words text-muted-foreground">{row.remarks}</p>}
            </article>)}
          </div>}
        </>}
    </section>
  );
}