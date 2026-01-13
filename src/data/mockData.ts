// Companies
export const companies = [
  { id: 'company-001', name: 'TechCorp Industries', code: 'TCI', sector: 'Manufacturing', employeeCount: 245, status: 'active' },
  { id: 'company-002', name: 'BuildRight Construction', code: 'BRC', sector: 'Construction', employeeCount: 189, status: 'active' },
  { id: 'company-003', name: 'Global Logistics Ltd', code: 'GLL', sector: 'Logistics', employeeCount: 312, status: 'active' },
];

// Contractors
export const contractors = [
  { id: 'cont-001', code: 'ABC', name: 'ABC Contractors', companyId: 'company-001' },
  { id: 'cont-002', code: 'XYZ', name: 'XYZ Services', companyId: 'company-001' },
  { id: 'cont-003', code: 'PQR', name: 'PQR Manpower', companyId: 'company-002' },
  { id: 'cont-004', code: 'DEF', name: 'DEF Staffing', companyId: 'company-003' },
];

// Plants
export const plants = [
  { id: 'plant-001', code: 'P1', name: 'Main Plant', sector: 'Sector A', companyId: 'company-001' },
  { id: 'plant-002', code: 'P2', name: 'Assembly Unit', sector: 'Sector B', companyId: 'company-001' },
  { id: 'plant-003', code: 'P3', name: 'Site Alpha', sector: 'Zone 1', companyId: 'company-002' },
];

// Employees
export const employees = [
  { id: 'EMP001', epNumber: 'EP-2024-001', name: 'Amit Patel', contractor: 'ABC Contractors', department: 'Production', trade: 'Welder', skill: 'Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP002', epNumber: 'EP-2024-002', name: 'Suresh Kumar', contractor: 'ABC Contractors', department: 'Maintenance', trade: 'Electrician', skill: 'Highly Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP003', epNumber: 'EP-2024-003', name: 'Ramesh Singh', contractor: 'XYZ Services', department: 'Production', trade: 'Fitter', skill: 'Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP004', epNumber: 'EP-2024-004', name: 'Vijay Sharma', contractor: 'XYZ Services', department: 'Quality', trade: 'Inspector', skill: 'Highly Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP005', epNumber: 'EP-2024-005', name: 'Manoj Gupta', contractor: 'ABC Contractors', department: 'Production', trade: 'Welder', skill: 'Semi-Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP006', epNumber: 'EP-2024-006', name: 'Anil Verma', contractor: 'PQR Manpower', department: 'Construction', trade: 'Mason', skill: 'Skilled', companyId: 'company-002', status: 'active' },
  { id: 'EMP007', epNumber: 'EP-2024-007', name: 'Sanjay Yadav', contractor: 'PQR Manpower', department: 'Construction', trade: 'Carpenter', skill: 'Skilled', companyId: 'company-002', status: 'active' },
  { id: 'EMP008', epNumber: 'EP-2024-008', name: 'Deepak Joshi', contractor: 'DEF Staffing', department: 'Warehouse', trade: 'Operator', skill: 'Semi-Skilled', companyId: 'company-003', status: 'active' },
  { id: 'EMP009', epNumber: 'EP-2024-009', name: 'Rohit Mishra', contractor: 'ABC Contractors', department: 'Production', trade: 'Turner', skill: 'Highly Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP010', epNumber: 'EP-2024-010', name: 'Karan Malhotra', contractor: 'XYZ Services', department: 'Maintenance', trade: 'Plumber', skill: 'Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP011', epNumber: 'EP-2024-011', name: 'Nitin Agarwal', contractor: 'ABC Contractors', department: 'Production', trade: 'Machinist', skill: 'Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP012', epNumber: 'EP-2024-012', name: 'Prakash Reddy', contractor: 'XYZ Services', department: 'Quality', trade: 'Technician', skill: 'Highly Skilled', companyId: 'company-001', status: 'active' },
  { id: 'EMP013', epNumber: 'EP-2024-013', name: 'Santosh Nair', contractor: 'PQR Manpower', department: 'Construction', trade: 'Painter', skill: 'Skilled', companyId: 'company-002', status: 'active' },
  { id: 'EMP014', epNumber: 'EP-2024-014', name: 'Arvind Das', contractor: 'DEF Staffing', department: 'Logistics', trade: 'Driver', skill: 'Semi-Skilled', companyId: 'company-003', status: 'active' },
  { id: 'EMP015', epNumber: 'EP-2024-015', name: 'Mukesh Pandey', contractor: 'ABC Contractors', department: 'Production', trade: 'Helper', skill: 'Unskilled', companyId: 'company-001', status: 'active' },
];

// Generate attendance records
const statuses = ['Present', 'Absent', 'Partial Day', 'On Leave', 'Holiday'] as const;
const generateAttendanceRecords = () => {
  const records = [];
  const today = new Date();
  
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const emp of employees) {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let status: typeof statuses[number];
      let punchIn = '';
      let punchOut = '';
      let overtime = 0;
      
      if (isWeekend) {
        status = Math.random() > 0.7 ? 'Present' : 'Holiday';
      } else {
        const rand = Math.random();
        if (rand > 0.85) status = 'Absent';
        else if (rand > 0.75) status = 'Partial Day';
        else if (rand > 0.7) status = 'On Leave';
        else status = 'Present';
      }
      
      if (status === 'Present' || status === 'Partial Day') {
        const baseHour = 7 + Math.floor(Math.random() * 2);
        const baseMin = Math.floor(Math.random() * 60);
        punchIn = `${String(baseHour).padStart(2, '0')}:${String(baseMin).padStart(2, '0')}`;
        
        if (status === 'Present') {
          const endHour = 16 + Math.floor(Math.random() * 4);
          const endMin = Math.floor(Math.random() * 60);
          punchOut = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
          overtime = endHour > 17 ? endHour - 17 : 0;
        } else {
          const endHour = 12 + Math.floor(Math.random() * 3);
          const endMin = Math.floor(Math.random() * 60);
          punchOut = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        }
      }
      
      records.push({
        id: `att-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        epNumber: emp.epNumber,
        employeeName: emp.name,
        contractor: emp.contractor,
        department: emp.department,
        date: dateStr,
        punchIn,
        punchOut,
        status,
        overtime,
        mandays: status === 'Present' ? 1 : status === 'Partial Day' ? 0.5 : 0,
        remarks: '',
        companyId: emp.companyId,
      });
    }
  }
  
  return records;
};

export const attendanceRecords = generateAttendanceRecords();

// Overtime Requests
export const overtimeRequests = [
  { id: 'ot-001', employeeId: 'EMP001', employeeName: 'Amit Patel', date: '2024-01-10', hours: 3, reason: 'Urgent production deadline', eicApproval: 'Pending', adminApproval: 'Pending', status: 'pending', companyId: 'company-001' },
  { id: 'ot-002', employeeId: 'EMP002', employeeName: 'Suresh Kumar', date: '2024-01-09', hours: 2, reason: 'Emergency maintenance', eicApproval: 'Approved', adminApproval: 'Approved', status: 'approved', companyId: 'company-001' },
  { id: 'ot-003', employeeId: 'EMP003', employeeName: 'Ramesh Singh', date: '2024-01-08', hours: 4, reason: 'Client delivery requirement', eicApproval: 'Approved', adminApproval: 'Pending', status: 'pending', companyId: 'company-001' },
  { id: 'ot-004', employeeId: 'EMP006', employeeName: 'Anil Verma', date: '2024-01-10', hours: 2.5, reason: 'Project completion', eicApproval: 'Rejected', adminApproval: 'N/A', status: 'rejected', companyId: 'company-002' },
];

// Partial Day Requests
export const partialDayRequests = [
  { id: 'pd-001', employeeId: 'EMP004', employeeName: 'Vijay Sharma', date: '2024-01-11', hoursWorked: 4, reason: 'Medical appointment', status: 'pending', companyId: 'company-001' },
  { id: 'pd-002', employeeId: 'EMP005', employeeName: 'Manoj Gupta', date: '2024-01-10', hoursWorked: 6, reason: 'Family emergency', status: 'approved', companyId: 'company-001' },
];

// Regularization Requests
export const regularizationRequests = [
  { id: 'reg-001', employeeId: 'EMP001', employeeName: 'Amit Patel', date: '2024-01-09', originalPunchIn: '08:30', originalPunchOut: '', correctedPunchIn: '07:15', correctedPunchOut: '17:30', reason: 'Biometric failure', status: 'pending', companyId: 'company-001' },
  { id: 'reg-002', employeeId: 'EMP009', employeeName: 'Rohit Mishra', date: '2024-01-08', originalPunchIn: '08:00', originalPunchOut: '15:00', correctedPunchIn: '08:00', correctedPunchOut: '18:00', reason: 'Forgot to punch out', status: 'approved', companyId: 'company-001' },
];

// Access Requests (User1 to Admin)
export const accessRequests = [
  { id: 'acc-001', requesterId: 'user1-001', requesterName: 'Priya Sharma', employeeId: 'EMP009', employeeName: 'Rohit Mishra', reason: 'New team member assignment', status: 'pending', requestDate: '2024-01-10', companyId: 'company-001' },
  { id: 'acc-002', requesterId: 'user1-001', requesterName: 'Priya Sharma', employeeId: 'EMP010', employeeName: 'Karan Malhotra', reason: 'Project requirement', status: 'approved', requestDate: '2024-01-05', companyId: 'company-001' },
];

// Users
export const users = [
  { id: 'root-001', name: 'System Administrator', email: 'root@ams.com', role: 'root', status: 'active', lastLogin: '2024-01-11 09:15' },
  { id: 'admin-001', name: 'Rajesh Kumar', email: 'admin@techcorp.com', role: 'admin', company: 'TechCorp Industries', companyId: 'company-001', status: 'active', lastLogin: '2024-01-11 08:30' },
  { id: 'admin-002', name: 'Sunita Devi', email: 'admin@buildright.com', role: 'admin', company: 'BuildRight Construction', companyId: 'company-002', status: 'active', lastLogin: '2024-01-10 14:20' },
  { id: 'admin-003', name: 'Vikram Mehta', email: 'admin@globallog.com', role: 'admin', company: 'Global Logistics Ltd', companyId: 'company-003', status: 'active', lastLogin: '2024-01-09 11:45' },
  { id: 'user1-001', name: 'Priya Sharma', email: 'priya@techcorp.com', role: 'user1', company: 'TechCorp Industries', companyId: 'company-001', status: 'active', lastLogin: '2024-01-11 07:50' },
  { id: 'user1-002', name: 'Ankit Saxena', email: 'ankit@techcorp.com', role: 'user1', company: 'TechCorp Industries', companyId: 'company-001', status: 'active', lastLogin: '2024-01-10 16:30' },
];

// Upload History
export const uploadHistory = [
  { id: 'up-001', fileName: 'attendance_jan_week1.xlsx', fileType: 'xlsx', uploadedBy: 'Rajesh Kumar', uploadDate: '2024-01-08 10:30', rowsProcessed: 450, rowsSuccess: 445, rowsFailed: 5, status: 'completed', companyId: 'company-001' },
  { id: 'up-002', fileName: 'employee_master_update.csv', fileType: 'csv', uploadedBy: 'Rajesh Kumar', uploadDate: '2024-01-07 14:15', rowsProcessed: 25, rowsSuccess: 25, rowsFailed: 0, status: 'completed', companyId: 'company-001' },
  { id: 'up-003', fileName: 'overtime_requests.xlsx', fileType: 'xlsx', uploadedBy: 'Sunita Devi', uploadDate: '2024-01-06 09:00', rowsProcessed: 12, rowsSuccess: 10, rowsFailed: 2, status: 'completed', companyId: 'company-002' },
  { id: 'up-004', fileName: 'punch_data_jan.xls', fileType: 'xls', uploadedBy: 'Rajesh Kumar', uploadDate: '2024-01-05 11:45', rowsProcessed: 890, rowsSuccess: 890, rowsFailed: 0, status: 'completed', companyId: 'company-001' },
];

// Audit Logs
export const auditLogs = [
  { id: 'log-001', action: 'User Login', user: 'Rajesh Kumar', details: 'Logged in from 192.168.1.100', timestamp: '2024-01-11 08:30:15', category: 'authentication' },
  { id: 'log-002', action: 'File Upload', user: 'Rajesh Kumar', details: 'Uploaded attendance_jan_week1.xlsx', timestamp: '2024-01-08 10:30:00', category: 'data' },
  { id: 'log-003', action: 'Overtime Approved', user: 'Rajesh Kumar', details: 'Approved OT request for Suresh Kumar (2 hours)', timestamp: '2024-01-09 15:20:00', category: 'approval' },
  { id: 'log-004', action: 'User Created', user: 'System Administrator', details: 'Created user Priya Sharma (user1)', timestamp: '2024-01-01 09:00:00', category: 'user_management' },
  { id: 'log-005', action: 'Report Generated', user: 'Priya Sharma', details: 'Generated ARC Summary Report for Jan 2024', timestamp: '2024-01-10 16:45:00', category: 'report' },
  { id: 'log-006', action: 'Data Export', user: 'Rajesh Kumar', details: 'Exported 250 attendance records to Excel', timestamp: '2024-01-10 14:00:00', category: 'data' },
  { id: 'log-007', action: 'Access Granted', user: 'Rajesh Kumar', details: 'Granted EMP010 access to Priya Sharma', timestamp: '2024-01-05 10:30:00', category: 'access_control' },
  { id: 'log-008', action: 'Backup Created', user: 'System Administrator', details: 'Full system backup completed', timestamp: '2024-01-01 02:00:00', category: 'system' },
];

// Reason Categories
export const reasonCategories = [
  { id: 'cat-001', name: 'Medical', description: 'Health-related reasons' },
  { id: 'cat-002', name: 'Family Emergency', description: 'Urgent family matters' },
  { id: 'cat-003', name: 'Technical Issue', description: 'Biometric or system failures' },
  { id: 'cat-004', name: 'Transport', description: 'Transportation problems' },
  { id: 'cat-005', name: 'Official Duty', description: 'Work-related external duties' },
];

// Dashboard Statistics
export const getDashboardStats = (companyId?: string) => {
  const filteredRecords = companyId 
    ? attendanceRecords.filter(r => r.companyId === companyId)
    : attendanceRecords;
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = filteredRecords.filter(r => r.date === today);
  
  return {
    totalEmployees: companyId ? employees.filter(e => e.companyId === companyId).length : employees.length,
    presentToday: todayRecords.filter(r => r.status === 'Present').length,
    absentToday: todayRecords.filter(r => r.status === 'Absent').length,
    partialToday: todayRecords.filter(r => r.status === 'Partial Day').length,
    onLeaveToday: todayRecords.filter(r => r.status === 'On Leave').length,
    pendingOT: overtimeRequests.filter(r => r.status === 'pending' && (!companyId || r.companyId === companyId)).length,
    pendingRegularization: regularizationRequests.filter(r => r.status === 'pending' && (!companyId || r.companyId === companyId)).length,
    pendingAccessRequests: accessRequests.filter(r => r.status === 'pending' && (!companyId || r.companyId === companyId)).length,
  };
};
