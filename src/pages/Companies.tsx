import { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Users, Clock, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const companiesData = [
  { id: 1, name: 'TechCorp Industries', code: 'TCI', employees: 156, users: 3, contractors: 5, status: 'active', createdAt: '2023-06-15' },
  { id: 2, name: 'GlobalTech Solutions', code: 'GTS', employees: 89, users: 2, contractors: 3, status: 'active', createdAt: '2023-08-22' },
  { id: 3, name: 'IndustryPlus Ltd', code: 'IPL', employees: 234, users: 4, contractors: 7, status: 'active', createdAt: '2023-04-10' },
  { id: 4, name: 'Sunrise Manufacturing', code: 'SRM', employees: 67, users: 2, contractors: 2, status: 'inactive', createdAt: '2023-09-05' },
  { id: 5, name: 'Prime Industries', code: 'PRI', employees: 178, users: 3, contractors: 6, status: 'active', createdAt: '2023-07-18' },
];

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCompanies = companiesData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totals = {
    companies: companiesData.length,
    employees: companiesData.reduce((sum, c) => sum + c.employees, 0),
    users: companiesData.reduce((sum, c) => sum + c.users, 0),
    contractors: companiesData.reduce((sum, c) => sum + c.contractors, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Management"
        description="Manage companies and their configurations (Root access only)"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.companies}</div>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.employees}</div>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.users}</div>
                <p className="text-sm text-muted-foreground">System Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.contractors}</div>
                <p className="text-sm text-muted-foreground">Contractors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Add */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>
                    Create a new company for attendance management
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Code</Label>
                    <Input placeholder="Enter short code (e.g., TCI)" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea placeholder="Enter company address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" placeholder="Enter contact email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input type="tel" placeholder="Enter contact phone" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Create Company</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">Contractors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{company.employees}</TableCell>
                    <TableCell className="text-right">{company.users}</TableCell>
                    <TableCell className="text-right">{company.contractors}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          company.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.createdAt}
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
                            Edit Company
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Company
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
