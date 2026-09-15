import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function IndividualEmployeeLink() {
  const [account, setAccount] = useState('');
  const [employee, setEmployee] = useState('');
  const [saving, setSaving] = useState(false);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['individual-links'], queryFn: async () => {
    const [profiles, roles, employees] = await Promise.all([
      supabase.from('profiles').select('id, username, full_name'),
      supabase.from('user_roles').select('user_id, role'),
      supabase.from('employees').select('id, employee_code, full_name, user_id').order('employee_code'),
    ]);
    if (profiles.error || roles.error || employees.error) throw profiles.error || roles.error || employees.error;
    return { profiles: profiles.data.filter(p => roles.data.some(r => r.user_id === p.id && r.role === 'user2') && !roles.data.some(r => r.user_id === p.id && r.role !== 'user2')), employees: employees.data };
  }});
  async function save() {
    setSaving(true);
    const { error } = await supabase.rpc('link_individual_employee', { _user_id: account, _employee_id: employee });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Employee linked to User2 account');
    await client.invalidateQueries({ queryKey: ['individual-links'] });
    setEmployee('');
  }
  return <section className="space-y-3 border-b pb-6">
    <h2 className="text-lg font-semibold">Individual accounts (User2)</h2>
    <p className="text-sm text-muted-foreground">New signups are individual accounts. Link each account to its employee.</p>
    {query.isError ? <p role="alert">Accounts could not be loaded.</p> : <div className="flex flex-col sm:flex-row gap-3">
      <Select value={account} onValueChange={value => { setAccount(value); setEmployee(''); }}><SelectTrigger aria-label="User2 account"><SelectValue placeholder="Select User2 account" /></SelectTrigger><SelectContent>{query.data?.profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.username} — {p.full_name}</SelectItem>)}</SelectContent></Select>
      <Select value={employee} onValueChange={setEmployee}><SelectTrigger aria-label="Employee to link"><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent>{query.data?.employees.filter(e => !e.user_id || e.user_id === account).map(e => <SelectItem key={e.id} value={e.id}>{e.employee_code} — {e.full_name}{e.user_id === account ? ' (linked)' : ''}</SelectItem>)}</SelectContent></Select>
      <Button disabled={!account || !employee || saving} onClick={save}>{saving ? 'Saving…' : 'Link employee'}</Button>
    </div>}
  </section>;
}