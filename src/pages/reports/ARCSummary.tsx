import { useState } from 'react';
import { Download, Filter, Printer } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { contractors } from '@/data/mockData';

const arcSummaryData = [
  { contractor: 'ABC Contractors', totalEmployees: 45, presentDays: 892, absentDays: 58, mandays: 892, overtime: 156, regularization: 12 },
  { contractor: 'XYZ Services', totalEmployees: 32, presentDays: 640, absentDays: 40, mandays: 640, overtime: 98, regularization: 8 },
  { contractor: 'PQR Industries', totalEmployees: 28, presentDays: 532, absentDays: 28, mandays: 532, overtime: 72, regularization: 5 },
  { contractor: 'LMN Works', totalEmployees: 56, presentDays: 1064, absentDays: 56, mandays: 1064, overtime: 210, regularization: 18 },
  { contractor: 'DEF Engineering', totalEmployees: 38, presentDays: 722, absentDays: 38, mandays: 722, overtime: 134, regularization: 9 },
];

export default function ARCSummary() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedContractor, setSelectedContractor] = useState('all');

  const totals = arcSummaryData.reduce(
    (acc, row) => ({
      totalEmployees: acc.totalEmployees + row.totalEmployees,
      presentDays: acc.presentDays + row.presentDays,
      absentDays: acc.absentDays + row.absentDays,
      mandays: acc.mandays + row.mandays,
      overtime: acc.overtime + row.overtime,
      regularization: acc.regularization + row.regularization,
    }),
    { totalEmployees: 0, presentDays: 0, absentDays: 0, mandays: 0, overtime: 0, regularization: 0 }
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="ARC Summary Report"
        description="Attendance Record Card summary by contractor with manday calculations"
      />

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contractor</Label>
              <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Contractors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contractors</SelectItem>
                  {contractors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="flex-1">Apply Filters</Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{totals.totalEmployees}</div>
            <p className="text-sm text-muted-foreground">Total Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totals.mandays}</div>
            <p className="text-sm text-muted-foreground">Total Mandays</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{totals.overtime}</div>
            <p className="text-sm text-muted-foreground">Overtime Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{totals.regularization}</div>
            <p className="text-sm text-muted-foreground">Regularizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contractor-wise Summary</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contractor</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Present Days</TableHead>
                  <TableHead className="text-right">Absent Days</TableHead>
                  <TableHead className="text-right">Mandays</TableHead>
                  <TableHead className="text-right">Overtime (hrs)</TableHead>
                  <TableHead className="text-right">Regularizations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arcSummaryData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.contractor}</TableCell>
                    <TableCell className="text-right">{row.totalEmployees}</TableCell>
                    <TableCell className="text-right text-green-600">{row.presentDays}</TableCell>
                    <TableCell className="text-right text-red-600">{row.absentDays}</TableCell>
                    <TableCell className="text-right font-medium">{row.mandays}</TableCell>
                    <TableCell className="text-right text-blue-600">{row.overtime}</TableCell>
                    <TableCell className="text-right">{row.regularization}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{totals.totalEmployees}</TableCell>
                  <TableCell className="text-right text-green-600">{totals.presentDays}</TableCell>
                  <TableCell className="text-right text-red-600">{totals.absentDays}</TableCell>
                  <TableCell className="text-right">{totals.mandays}</TableCell>
                  <TableCell className="text-right text-blue-600">{totals.overtime}</TableCell>
                  <TableCell className="text-right">{totals.regularization}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
