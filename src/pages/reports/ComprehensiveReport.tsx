import { useState } from 'react';
import { Download, Filter, FileSpreadsheet, Printer } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contractors, companies } from '@/data/mockData';

const comprehensiveData = [
  { epNumber: 'EP001', name: 'Amit Kumar', contractor: 'ABC Contractors', department: 'Production', presentDays: 22, absentDays: 2, partialDays: 1, overtime: 8, regularizations: 1, status: 'active' },
  { epNumber: 'EP002', name: 'Sunita Devi', contractor: 'XYZ Services', department: 'Maintenance', presentDays: 20, absentDays: 4, partialDays: 0, overtime: 12, regularizations: 2, status: 'active' },
  { epNumber: 'EP003', name: 'Ravi Verma', contractor: 'ABC Contractors', department: 'Production', presentDays: 23, absentDays: 1, partialDays: 0, overtime: 5, regularizations: 0, status: 'active' },
  { epNumber: 'EP004', name: 'Meena Singh', contractor: 'PQR Industries', department: 'Quality', presentDays: 18, absentDays: 6, partialDays: 2, overtime: 3, regularizations: 1, status: 'inactive' },
  { epNumber: 'EP005', name: 'Vikram Joshi', contractor: 'LMN Works', department: 'Engineering', presentDays: 24, absentDays: 0, partialDays: 0, overtime: 15, regularizations: 0, status: 'active' },
  { epNumber: 'EP006', name: 'Anjali Gupta', contractor: 'DEF Engineering', department: 'Admin', presentDays: 21, absentDays: 3, partialDays: 1, overtime: 2, regularizations: 1, status: 'active' },
  { epNumber: 'EP007', name: 'Kavita Rao', contractor: 'ABC Contractors', department: 'Production', presentDays: 19, absentDays: 5, partialDays: 0, overtime: 6, regularizations: 2, status: 'active' },
  { epNumber: 'EP008', name: 'Deepa Nair', contractor: 'XYZ Services', department: 'HR', presentDays: 22, absentDays: 2, partialDays: 0, overtime: 0, regularizations: 0, status: 'active' },
];

export default function ComprehensiveReport() {
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const totals = comprehensiveData.reduce(
    (acc, row) => ({
      presentDays: acc.presentDays + row.presentDays,
      absentDays: acc.absentDays + row.absentDays,
      partialDays: acc.partialDays + row.partialDays,
      overtime: acc.overtime + row.overtime,
      regularizations: acc.regularizations + row.regularizations,
    }),
    { presentDays: 0, absentDays: 0, partialDays: 0, overtime: 0, regularizations: 0 }
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comprehensive Report"
        description="Complete attendance data with all metrics combined"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{comprehensiveData.length}</div>
            <p className="text-sm text-muted-foreground">Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totals.presentDays}</div>
            <p className="text-sm text-muted-foreground">Present Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{totals.absentDays}</div>
            <p className="text-sm text-muted-foreground">Absent Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{totals.overtime}h</div>
            <p className="text-sm text-muted-foreground">Overtime</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{totals.regularizations}</div>
            <p className="text-sm text-muted-foreground">Regularizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" defaultValue="2024-01-01" />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" defaultValue="2024-01-31" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Button className="flex-1">Generate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Data</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detailed">
            <TabsList className="mb-4">
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
              <TabsTrigger value="summary">Summary View</TabsTrigger>
            </TabsList>

            <TabsContent value="detailed">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>EP Number</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Present</TableHead>
                      <TableHead className="text-right">Absent</TableHead>
                      <TableHead className="text-right">Partial</TableHead>
                      <TableHead className="text-right">OT (hrs)</TableHead>
                      <TableHead className="text-right">Reg.</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comprehensiveData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.epNumber}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.contractor}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell className="text-right text-green-600">{row.presentDays}</TableCell>
                        <TableCell className="text-right text-red-600">{row.absentDays}</TableCell>
                        <TableCell className="text-right text-amber-600">{row.partialDays}</TableCell>
                        <TableCell className="text-right text-blue-600">{row.overtime}</TableCell>
                        <TableCell className="text-right">{row.regularizations}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.status === 'active' ? 'present' : 'absent'} />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={4}>Total</TableCell>
                      <TableCell className="text-right text-green-600">{totals.presentDays}</TableCell>
                      <TableCell className="text-right text-red-600">{totals.absentDays}</TableCell>
                      <TableCell className="text-right text-amber-600">{totals.partialDays}</TableCell>
                      <TableCell className="text-right text-blue-600">{totals.overtime}</TableCell>
                      <TableCell className="text-right">{totals.regularizations}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">By Contractor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['ABC Contractors', 'XYZ Services', 'PQR Industries', 'LMN Works', 'DEF Engineering'].map(
                        (contractor) => (
                          <div key={contractor} className="flex justify-between items-center">
                            <span className="text-sm">{contractor}</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50 + 20)} mandays</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">By Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Production', 'Maintenance', 'Quality', 'Engineering', 'Admin', 'HR'].map((dept) => (
                        <div key={dept} className="flex justify-between items-center">
                          <span className="text-sm">{dept}</span>
                          <span className="font-medium">{Math.floor(Math.random() * 30 + 10)} mandays</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
