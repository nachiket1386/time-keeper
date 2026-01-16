import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';
import { attendanceRecords, employees, contractors } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ARCSummaryTableProps {
  companyId?: string;
}

export function ARCSummaryTable({ companyId }: ARCSummaryTableProps) {
  const summaryData = useMemo(() => {
    // Filter by company if provided
    const filteredEmployees = employees.filter(
      (e) => !companyId || e.companyId === companyId
    );
    const filteredRecords = attendanceRecords.filter(
      (r) => !companyId || r.companyId === companyId
    );

    // Get unique trades and contractors
    const trades = [...new Set(filteredEmployees.map((e) => e.trade))].sort();
    const contractorList = contractors
      .filter((c) => !companyId || c.companyId === companyId)
      .map((c) => c.name);

    // Build summary: rows = trades, columns = contractors
    const data: Record<string, Record<string, number>> = {};
    const tradeTotals: Record<string, number> = {};
    const contractorTotals: Record<string, number> = {};

    trades.forEach((trade) => {
      data[trade] = {};
      tradeTotals[trade] = 0;
      contractorList.forEach((contractor) => {
        data[trade][contractor] = 0;
      });
    });

    contractorList.forEach((contractor) => {
      contractorTotals[contractor] = 0;
    });

    // Calculate mandays for each trade-contractor combination
    filteredRecords.forEach((record) => {
      const employee = filteredEmployees.find((e) => e.epNumber === record.epNumber);
      if (employee && record.mandays > 0) {
        const trade = employee.trade;
        const contractor = employee.contractor;

        if (data[trade] && data[trade][contractor] !== undefined) {
          data[trade][contractor] += record.mandays;
          tradeTotals[trade] += record.mandays;
          contractorTotals[contractor] += record.mandays;
        }
      }
    });

    const grandTotal = Object.values(tradeTotals).reduce((a, b) => a + b, 0);

    return { trades, contractors: contractorList, data, tradeTotals, contractorTotals, grandTotal };
  }, [companyId]);

  const getHeatmapColor = (value: number, max: number) => {
    if (value === 0) return 'bg-muted/30 text-muted-foreground';
    const intensity = Math.min(value / max, 1);
    if (intensity > 0.75) return 'bg-success/80 text-success-foreground font-semibold';
    if (intensity > 0.5) return 'bg-success/50 text-success-foreground';
    if (intensity > 0.25) return 'bg-success/30 text-foreground';
    return 'bg-success/15 text-foreground';
  };

  const maxValue = Math.max(...Object.values(summaryData.data).flatMap(obj => Object.values(obj)), 1);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          ARC Summary - Mandays by Trade & Contractor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="text-left p-3 font-semibold bg-muted/50 rounded-tl-lg sticky left-0 z-10 min-w-[120px]">
                  Trade
                </th>
                {summaryData.contractors.map((contractor) => (
                  <th 
                    key={contractor} 
                    className="text-center p-3 font-semibold bg-muted/50 whitespace-nowrap min-w-[100px]"
                  >
                    {contractor.split(' ')[0]}
                  </th>
                ))}
                <th className="text-center p-3 font-semibold bg-primary/10 text-primary rounded-tr-lg min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {summaryData.trades.map((trade, idx) => (
                <tr 
                  key={trade} 
                  className={cn(
                    'border-b border-border/50 hover:bg-muted/30 transition-colors',
                    idx % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                  )}
                >
                  <td className="p-3 font-medium sticky left-0 bg-inherit z-10 border-r border-border/30">
                    {trade}
                  </td>
                  {summaryData.contractors.map((contractor) => {
                    const value = summaryData.data[trade][contractor];
                    return (
                      <td 
                        key={contractor} 
                        className={cn(
                          'text-center p-3 transition-colors',
                          getHeatmapColor(value, maxValue)
                        )}
                      >
                        {value > 0 ? value.toFixed(1) : '-'}
                      </td>
                    );
                  })}
                  <td className="text-center p-3 font-semibold bg-primary/5 text-primary">
                    {summaryData.tradeTotals[trade].toFixed(1)}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-primary/10 font-semibold border-t-2 border-primary/30">
                <td className="p-3 sticky left-0 bg-primary/10 z-10 rounded-bl-lg">
                  Total
                </td>
                {summaryData.contractors.map((contractor) => (
                  <td key={contractor} className="text-center p-3 text-primary">
                    {summaryData.contractorTotals[contractor].toFixed(1)}
                  </td>
                ))}
                <td className="text-center p-3 bg-primary text-primary-foreground rounded-br-lg">
                  {summaryData.grandTotal.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
