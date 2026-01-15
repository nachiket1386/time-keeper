import { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Download, Upload, UserCog } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { contractors } from '@/data/mockData';

const employeesData = [
  { id: 1, epNumber: 'EP001', name: 'Amit Kumar', contractor: 'ABC Contractors', department: 'Production', trade: 'Fitter', skill: 'Skilled', status: 'active' },
  { id: 2, epNumber: 'EP002', name: 'Sunita Devi', contractor: 'XYZ Services', department: 'Maintenance', trade: 'Electrician', skill: 'Highly Skilled', status: 'active' },
  { id: 3, epNumber: 'EP003', name: 'Ravi Verma', contractor: 'ABC Contractors', department: 'Production', trade: 'Welder', skill: 'Skilled', status: 'active' },
  { id: 4, epNumber: 'EP004', name: 'Meena Singh', contractor: 'PQR Industries', department: 'Quality', trade: 'Inspector', skill: 'Skilled', status: 'inactive' },
  { id: 5, epNumber: 'EP005', name: 'Vikram Joshi', contractor: 'LMN Works', department: 'Engineering', trade: 'Technician', skill: 'Highly Skilled', status: 'active' },
  { id: 6, epNumber: 'EP006', name: 'Anjali Gupta', contractor: 'DEF Engineering', department: 'Admin', trade: 'Clerk', skill: 'Semi-Skilled', status: 'active' },
  { id: 7, epNumber: 'EP007', name: 'Kavita Rao', contractor: 'ABC Contractors', department: 'Production', trade: 'Operator', skill: 'Skilled', status: 'active' },
  { id: 8, epNumber: 'EP008', name: 'Deepa Nair', contractor: 'XYZ Services', department: 'HR', trade: 'Executive', skill: 'Skilled', status: 'active' },
];

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contractorFilter, setContractorFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = employeesData.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.epNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContractor = contractorFilter === 'all' || e.contractor === contractorFilter;
    return matchesSearch && matchesContractor;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Master"
        description="Manage employee records and assignments"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{employeesData.length}</div>
            <p className="text-sm text-muted-foreground">Total Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {employeesData.filter((e) => e.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {new Set(employeesData.map((e) => e.contractor)).size}
            </div>
            <p className="text-sm text-muted-foreground">Contractors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(employeesData.map((e) => e.department)).size}
            </div>
            <p className="text-sm text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or EP number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={contractorFilter} onValueChange={setContractorFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Contractors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                {contractors.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Add a new employee to the master records
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>EP Number</Label>
                      <Input placeholder="EP001" />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contractor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contractor" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractors.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Trade</Label>
                      <Input placeholder="Enter trade" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unskilled">Unskilled</SelectItem>
                        <SelectItem value="semi-skilled">Semi-Skilled</SelectItem>
                        <SelectItem value="skilled">Skilled</SelectItem>
                        <SelectItem value="highly-skilled">Highly Skilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EP Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.epNumber}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.contractor}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.trade}</TableCell>
                    <TableCell>{employee.skill}</TableCell>
                    <TableCell>
                      <StatusBadge status={employee.status === 'active' ? 'present' : 'absent'} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            View Attendance
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Employee
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
