import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ClipboardList, FileText, LucideIcon } from 'lucide-react';
import { overtimeRequests, regularizationRequests, partialDayRequests, employees } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface StatusSummaryTableProps {
  companyId?: string;
  type: 'overtime' | 'regularization' | 'partialday';
}

const typeConfig: Record<string, { title: string; icon: LucideIcon; color: string }> = {
  overtime: { title: 'Overtime Summary', icon: Clock, color: 'text-cyan-500' },
  regularization: { title: 'Regularization Summary', icon: ClipboardList, color: 'text-indigo-500' },
  partialday: { title: 'Partial Day Summary', icon: FileText, color: 'text-amber-500' },
};

const statusOrder = ['approved', 'pending', 'rejected'] as const;
const statusLabels: Record<string, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
};

const statusColors: Record<string, { header: string; cell: string }> = {
  approved: { 
    header: 'bg-success/20 text-success', 
    cell: 'bg-success/10 text-success font-semibold' 
  },
  pending: { 
    header: 'bg-warning/20 text-warning', 
    cell: 'bg-warning/10 text-warning font-semibold' 
  },
  rejected: { 
    header: 'bg-destructive/20 text-destructive', 
    cell: 'bg-destructive/10 text-destructive font-semibold' 
  },
};

export function StatusSummaryTable({ companyId, type }: StatusSummaryTableProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const summaryData = useMemo(() => {
    let requests: Array<{ employeeId: string; status: string; companyId: string }> = [];

    if (type === 'overtime') {
      requests = overtimeRequests;
    } else if (type === 'regularization') {
      requests = regularizationRequests;
    } else if (type === 'partialday') {
      requests = partialDayRequests;
    }

    // Filter by company
    const filteredRequests = requests.filter(
      (r) => !companyId || r.companyId === companyId
    );

    // Get unique EIC codes (using employee epNumber as EIC)
    const employeeMap = new Map<string, string>();
    employees.forEach((e) => {
      if (!companyId || e.companyId === companyId) {
        employeeMap.set(e.id, e.epNumber);
      }
    });

    // Build summary: rows = EIC codes, columns = status
    const eicCodes = [...new Set(
      filteredRequests
        .map((r) => employeeMap.get(r.employeeId))
        .filter(Boolean)
    )] as string[];

    const data: Record<string, Record<string, number>> = {};
    const eicTotals: Record<string, number> = {};
    const statusTotals: Record<string, number> = { approved: 0, pending: 0, rejected: 0 };

    eicCodes.forEach((eic) => {
      data[eic] = { approved: 0, pending: 0, rejected: 0 };
      eicTotals[eic] = 0;
    });

    filteredRequests.forEach((request) => {
      const eic = employeeMap.get(request.employeeId);
      if (eic && data[eic]) {
        const status = request.status.toLowerCase();
        if (data[eic][status] !== undefined) {
          data[eic][status] += 1;
          eicTotals[eic] += 1;
          statusTotals[status] += 1;
        }
      }
    });

    const grandTotal = Object.values(eicTotals).reduce((a, b) => a + b, 0);

    return { eicCodes, data, eicTotals, statusTotals, grandTotal };
  }, [companyId, type]);

  if (summaryData.eicCodes.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={cn('h-5 w-5', config.color)} />
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Icon className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No {type} records found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={cn('h-5 w-5', config.color)} />
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-3 font-semibold bg-muted/50 rounded-tl-lg sticky left-0 z-10 min-w-[120px]">
                  EIC Code
                </th>
                {statusOrder.map((status) => (
                  <th 
                    key={status} 
                    className={cn(
                      'text-center p-3 font-semibold min-w-[90px]',
                      statusColors[status].header
                    )}
                  >
                    {statusLabels[status]}
                  </th>
                ))}
                <th className="text-center p-3 font-semibold bg-muted/70 rounded-tr-lg min-w-[70px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {summaryData.eicCodes.map((eic, idx) => (
                <tr 
                  key={eic} 
                  className={cn(
                    'border-b border-border/50 hover:bg-muted/20 transition-colors',
                    idx % 2 === 0 ? 'bg-card' : 'bg-muted/5'
                  )}
                >
                  <td className="p-3 font-medium sticky left-0 bg-inherit z-10 border-r border-border/30">
                    {eic}
                  </td>
                  {statusOrder.map((status) => {
                    const value = summaryData.data[eic][status];
                    return (
                      <td 
                        key={status} 
                        className={cn(
                          'text-center p-3 transition-colors',
                          value > 0 ? statusColors[status].cell : 'text-muted-foreground'
                        )}
                      >
                        {value > 0 ? value : '-'}
                      </td>
                    );
                  })}
                  <td className="text-center p-3 font-semibold bg-muted/30">
                    {summaryData.eicTotals[eic]}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-muted/50 font-semibold border-t-2 border-border">
                <td className="p-3 sticky left-0 bg-muted/50 z-10 rounded-bl-lg">
                  Total
                </td>
                {statusOrder.map((status) => (
                  <td 
                    key={status} 
                    className={cn('text-center p-3', statusColors[status].cell)}
                  >
                    {summaryData.statusTotals[status]}
                  </td>
                ))}
                <td className="text-center p-3 bg-primary text-primary-foreground rounded-br-lg">
                  {summaryData.grandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
