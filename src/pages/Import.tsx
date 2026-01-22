import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Clock, File, Download, AlertTriangle, BarChart3, Timer, Calendar, Edit, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const uploadTypes = [
  { 
    id: 'punchrecord', 
    name: 'Punchrecord', 
    description: 'Upload punch time records',
    icon: Timer,
    badge: 'MOST COMMON',
    badgeVariant: 'default' as const,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600'
  },
  { 
    id: 'arc-summary', 
    name: 'ARC Summary', 
    description: 'Upload attendance summary reports',
    icon: BarChart3,
    badge: null,
    badgeVariant: null,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  { 
    id: 'overtime', 
    name: 'Overtime', 
    description: 'Upload overtime records',
    icon: Clock,
    badge: null,
    badgeVariant: null,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500'
  },
  { 
    id: 'partial-day', 
    name: 'Partial Day', 
    description: 'Upload partial day attendance',
    icon: Calendar,
    badge: null,
    badgeVariant: null,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500'
  },
  { 
    id: 'regularization', 
    name: 'Regularization', 
    description: 'Upload attendance regularization requests',
    icon: Edit,
    badge: null,
    badgeVariant: null,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  { 
    id: 'auto-detect', 
    name: 'Auto-Detect', 
    description: 'Let the system detect file type automatically',
    icon: Search,
    badge: 'SMART',
    badgeVariant: 'secondary' as const,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500'
  },
];

const uploadHistory = [
  { id: 1, filename: 'attendance_jan_2024.xlsx', type: 'Attendance', rows: 1250, success: 1245, errors: 5, date: '2024-01-15 09:30', status: 'completed' },
  { id: 2, filename: 'employees_master.csv', type: 'Employee Master', rows: 156, success: 156, errors: 0, date: '2024-01-14 14:20', status: 'completed' },
  { id: 3, filename: 'overtime_requests.xlsx', type: 'Overtime', rows: 45, success: 43, errors: 2, date: '2024-01-13 11:45', status: 'completed' },
  { id: 4, filename: 'punch_data_jan.csv', type: 'Punch Records', rows: 3200, success: 0, errors: 0, date: '2024-01-12 16:00', status: 'failed' },
  { id: 5, filename: 'contractors_list.xlsx', type: 'Contractors', rows: 12, success: 12, errors: 0, date: '2024-01-10 10:30', status: 'completed' },
];

const templates = [
  { name: 'Attendance Template', description: 'Daily attendance records with punch times', format: 'xlsx' },
  { name: 'Employee Master Template', description: 'Employee details with EP number, contractor, etc.', format: 'xlsx' },
  { name: 'Overtime Request Template', description: 'Overtime request data for bulk import', format: 'csv' },
  { name: 'Punch Records Template', description: 'Raw punch data from biometric devices', format: 'csv' },
  { name: 'Contractor List Template', description: 'Contractor master data', format: 'xlsx' },
];

export default function Import() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      completed: { className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      failed: { className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
      processing: { className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    };
    const variant = variants[status] || variants.completed;
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Type Selection Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Excel File Upload</h1>
            <p className="text-muted-foreground">Select the type of attendance data you want to upload</p>
          </div>

          {/* Upload Type Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <Card 
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`
                    relative cursor-pointer transition-all duration-200 hover:shadow-md
                    ${isSelected 
                      ? 'ring-2 ring-primary border-primary bg-primary/5' 
                      : 'hover:border-primary/50 bg-muted/30'
                    }
                  `}
                >
                  {type.badge && (
                    <Badge 
                      variant={type.badgeVariant || 'default'}
                      className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 ${
                        type.badge === 'SMART' 
                          ? 'bg-emerald-500 text-white hover:bg-emerald-500' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {type.badge}
                    </Badge>
                  )}
                  <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl ${type.iconBg} mb-4`}>
                      <Icon className={`h-8 w-8 ${type.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Upload Zone - Shows after type selection */}
          {selectedType && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">
                  Upload {uploadTypes.find(t => t.id === selectedType)?.name} File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-colors
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse. Supports CSV, XLS, XLSX (max 20MB)
                      </p>
                    </div>
                    <Button variant="outline" onClick={simulateUpload}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress !== null && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Uploading file...</span>
                      <span className="text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    {uploadProgress === 100 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Upload complete! Processing data...</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Import Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure your file follows the template format for the selected import type</li>
                <li>• Date format should be DD/MM/YYYY or YYYY-MM-DD</li>
                <li>• Time format should be HH:MM (24-hour format)</li>
                <li>• EP Numbers must match existing employee records</li>
                <li>• Duplicate records will be skipped or updated based on settings</li>
                <li>• Maximum file size is 20MB</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>View history of all file uploads and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Rows</TableHead>
                      <TableHead className="text-right">Success</TableHead>
                      <TableHead className="text-right">Errors</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadHistory.map((upload) => (
                      <TableRow key={upload.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{upload.filename}</span>
                          </div>
                        </TableCell>
                        <TableCell>{upload.type}</TableCell>
                        <TableCell className="text-right">{upload.rows}</TableCell>
                        <TableCell className="text-right text-green-600">{upload.success}</TableCell>
                        <TableCell className="text-right text-red-600">{upload.errors}</TableCell>
                        <TableCell className="text-muted-foreground">{upload.date}</TableCell>
                        <TableCell>{getStatusBadge(upload.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
