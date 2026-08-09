// Column definitions + mock data for the Overtime, Regularization,
// Partial Day and Week-Off report tabs.

export interface ReportColumn {
  key: string;
  label: string;
  align: 'left' | 'center';
  width: string;
}

/* ---------------- Overtime ---------------- */
export const overtimeColumns: ReportColumn[] = [
  { key: 'epNumber', label: 'EP NO', align: 'left', width: 'w-[104px] min-w-[104px]' },
  { key: 'epName', label: 'EP NAME', align: 'left', width: 'w-[140px] min-w-[140px]' },
  { key: 'punchDate', label: 'PUNCHDATE', align: 'center', width: 'w-[96px] min-w-[96px]' },
  { key: 'actualOverstay', label: 'ACTUAL OVERSTAY', align: 'center', width: 'w-[112px] min-w-[112px]' },
  { key: 'requestedOvertime', label: 'REQUESTED OVERTIME', align: 'center', width: 'w-[124px] min-w-[124px]' },
  { key: 'approvedOvertime', label: 'APPROVED OVERTIME', align: 'center', width: 'w-[120px] min-w-[120px]' },
  { key: 'requestedRegularMandayHours', label: 'REQUESTED REGULAR MANDAY HOURS', align: 'center', width: 'w-[168px] min-w-[168px]' },
  { key: 'approvedRegularMandayHours', label: 'APPROVED REGULAR MANDAY HOURS', align: 'center', width: 'w-[168px] min-w-[168px]' },
  { key: 'requestedEicName', label: 'REQUESTED EIC NAME', align: 'left', width: 'w-[150px] min-w-[150px]' },
  { key: 'status', label: 'OT REQUEST STATUS', align: 'center', width: 'w-[120px] min-w-[120px]' },
];

export const overtimeData = [
  { epNumber: 'EP-2024-001', epName: 'Amit Patel', punchDate: '21-01-2026', actualOverstay: '02:15', requestedOvertime: '02:00', approvedOvertime: '02:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-002', epName: 'Suresh Kumar', punchDate: '21-01-2026', actualOverstay: '01:30', requestedOvertime: '01:30', approvedOvertime: '01:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-003', epName: 'Ramesh Singh', punchDate: '21-01-2026', actualOverstay: '03:00', requestedOvertime: '03:00', approvedOvertime: '00:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '04:00', requestedEicName: 'R. Sharma', status: 'Rejected' },
  { epNumber: 'EP-2024-004', epName: 'Vijay Sharma', punchDate: '20-01-2026', actualOverstay: '00:45', requestedOvertime: '00:45', approvedOvertime: '00:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'S. Iyer', status: 'Pending' },
  { epNumber: 'EP-2024-005', epName: 'Manoj Gupta', punchDate: '20-01-2026', actualOverstay: '04:00', requestedOvertime: '04:00', approvedOvertime: '03:30', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-006', epName: 'Anil Verma', punchDate: '20-01-2026', actualOverstay: '02:45', requestedOvertime: '02:30', approvedOvertime: '02:30', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'S. Iyer', status: 'Approved' },
  { epNumber: 'EP-2024-007', epName: 'Sanjay Yadav', punchDate: '19-01-2026', actualOverstay: '01:00', requestedOvertime: '01:00', approvedOvertime: '01:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'R. Sharma', status: 'Pending' },
  { epNumber: 'EP-2024-008', epName: 'Deepak Joshi', punchDate: '19-01-2026', actualOverstay: '05:15', requestedOvertime: '05:00', approvedOvertime: '04:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-009', epName: 'Rohit Mishra', punchDate: '19-01-2026', actualOverstay: '00:30', requestedOvertime: '00:30', approvedOvertime: '00:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'S. Iyer', status: 'Rejected' },
  { epNumber: 'EP-2024-010', epName: 'Karan Malhotra', punchDate: '18-01-2026', actualOverstay: '02:00', requestedOvertime: '02:00', approvedOvertime: '02:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-011', epName: 'Nitin Agarwal', punchDate: '18-01-2026', actualOverstay: '03:30', requestedOvertime: '03:00', approvedOvertime: '03:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'K. Menon', status: 'Pending' },
  { epNumber: 'EP-2024-012', epName: 'Prakash Reddy', punchDate: '18-01-2026', actualOverstay: '01:15', requestedOvertime: '01:00', approvedOvertime: '01:00', requestedRegularMandayHours: '08:00', approvedRegularMandayHours: '08:00', requestedEicName: 'S. Iyer', status: 'Approved' },
];

/* ---------------- Regularization ---------------- */
export const regularizationColumns: ReportColumn[] = [
  { key: 'epNumber', label: 'EP NO', align: 'left', width: 'w-[104px] min-w-[104px]' },
  { key: 'epName', label: 'EP NAME', align: 'left', width: 'w-[140px] min-w-[140px]' },
  { key: 'punchDate', label: 'PUNCHDATE', align: 'center', width: 'w-[96px] min-w-[96px]' },
  { key: 'oldPunchIn', label: 'OLD PUNCH IN', align: 'center', width: 'w-[100px] min-w-[100px]' },
  { key: 'oldPunchOut', label: 'OLD PUNCH OUT', align: 'center', width: 'w-[104px] min-w-[104px]' },
  { key: 'newPunchIn', label: 'NEW PUNCH IN', align: 'center', width: 'w-[100px] min-w-[100px]' },
  { key: 'newPunchOut', label: 'NEW PUNCH OUT', align: 'center', width: 'w-[104px] min-w-[104px]' },
  { key: 'requestedEicName', label: 'REQUESTED EIC NAME', align: 'left', width: 'w-[150px] min-w-[150px]' },
  { key: 'status', label: 'REQUEST STATUS', align: 'center', width: 'w-[112px] min-w-[112px]' },
];

export const regularizationData = [
  { epNumber: 'EP-2024-001', epName: 'Amit Patel', punchDate: '21-01-2026', oldPunchIn: '09:15', oldPunchOut: '18:00', newPunchIn: '08:30', newPunchOut: '18:00', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-003', epName: 'Ramesh Singh', punchDate: '21-01-2026', oldPunchIn: '--', oldPunchOut: '17:45', newPunchIn: '08:45', newPunchOut: '17:45', requestedEicName: 'K. Menon', status: 'Pending' },
  { epNumber: 'EP-2024-004', epName: 'Vijay Sharma', punchDate: '20-01-2026', oldPunchIn: '08:30', oldPunchOut: '--', newPunchIn: '08:30', newPunchOut: '18:15', requestedEicName: 'S. Iyer', status: 'Approved' },
  { epNumber: 'EP-2024-005', epName: 'Manoj Gupta', punchDate: '20-01-2026', oldPunchIn: '10:00', oldPunchOut: '19:00', newPunchIn: '09:00', newPunchOut: '19:00', requestedEicName: 'R. Sharma', status: 'Rejected' },
  { epNumber: 'EP-2024-006', epName: 'Anil Verma', punchDate: '20-01-2026', oldPunchIn: '08:50', oldPunchOut: '16:30', newPunchIn: '08:50', newPunchOut: '18:00', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-008', epName: 'Deepak Joshi', punchDate: '19-01-2026', oldPunchIn: '--', oldPunchOut: '--', newPunchIn: '08:30', newPunchOut: '17:30', requestedEicName: 'S. Iyer', status: 'Pending' },
  { epNumber: 'EP-2024-009', epName: 'Rohit Mishra', punchDate: '19-01-2026', oldPunchIn: '09:40', oldPunchOut: '18:20', newPunchIn: '08:40', newPunchOut: '18:20', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-011', epName: 'Nitin Agarwal', punchDate: '18-01-2026', oldPunchIn: '08:20', oldPunchOut: '15:00', newPunchIn: '08:20', newPunchOut: '17:30', requestedEicName: 'K. Menon', status: 'Rejected' },
  { epNumber: 'EP-2024-012', epName: 'Prakash Reddy', punchDate: '18-01-2026', oldPunchIn: '09:05', oldPunchOut: '18:10', newPunchIn: '08:35', newPunchOut: '18:10', requestedEicName: 'S. Iyer', status: 'Pending' },
  { epNumber: 'EP-2024-014', epName: 'Arvind Das', punchDate: '17-01-2026', oldPunchIn: '--', oldPunchOut: '17:00', newPunchIn: '08:30', newPunchOut: '17:00', requestedEicName: 'R. Sharma', status: 'Approved' },
];

/* ---------------- Partial Day ---------------- */
export const partialDayColumns: ReportColumn[] = [
  { key: 'epNumber', label: 'EP NO', align: 'left', width: 'w-[104px] min-w-[104px]' },
  { key: 'epName', label: 'EP NAME', align: 'left', width: 'w-[140px] min-w-[140px]' },
  { key: 'punchDate', label: 'PUNCHDATE', align: 'center', width: 'w-[96px] min-w-[96px]' },
  { key: 'actualPdHours', label: 'ACTUAL PD HOURS', align: 'center', width: 'w-[116px] min-w-[116px]' },
  { key: 'requestedPdHours', label: 'REQUESTED PD HOURS', align: 'center', width: 'w-[128px] min-w-[128px]' },
  { key: 'approvedPdHours', label: 'APPROVED PD HOURS', align: 'center', width: 'w-[126px] min-w-[126px]' },
  { key: 'mandayConversion', label: 'MANDAY CONVERSION', align: 'center', width: 'w-[128px] min-w-[128px]' },
  { key: 'requestedEicName', label: 'REQUESTED EIC NAME', align: 'left', width: 'w-[150px] min-w-[150px]' },
  { key: 'status', label: 'PD REQUEST STATUS', align: 'center', width: 'w-[122px] min-w-[122px]' },
];

export const partialDayReportData = [
  { epNumber: 'EP-2024-003', epName: 'Ramesh Singh', punchDate: '21-01-2026', actualPdHours: '04:00', requestedPdHours: '04:00', approvedPdHours: '04:00', mandayConversion: '0.50', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-010', epName: 'Karan Malhotra', punchDate: '21-01-2026', actualPdHours: '06:00', requestedPdHours: '06:00', approvedPdHours: '06:00', mandayConversion: '0.75', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-002', epName: 'Suresh Kumar', punchDate: '20-01-2026', actualPdHours: '05:00', requestedPdHours: '05:00', approvedPdHours: '00:00', mandayConversion: '0.00', requestedEicName: 'S. Iyer', status: 'Rejected' },
  { epNumber: 'EP-2024-005', epName: 'Manoj Gupta', punchDate: '20-01-2026', actualPdHours: '03:00', requestedPdHours: '03:00', approvedPdHours: '03:00', mandayConversion: '0.375', requestedEicName: 'R. Sharma', status: 'Pending' },
  { epNumber: 'EP-2024-007', epName: 'Sanjay Yadav', punchDate: '19-01-2026', actualPdHours: '04:30', requestedPdHours: '04:00', approvedPdHours: '04:00', mandayConversion: '0.50', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-009', epName: 'Rohit Mishra', punchDate: '19-01-2026', actualPdHours: '02:00', requestedPdHours: '02:00', approvedPdHours: '02:00', mandayConversion: '0.25', requestedEicName: 'S. Iyer', status: 'Pending' },
  { epNumber: 'EP-2024-013', epName: 'Santosh Nair', punchDate: '18-01-2026', actualPdHours: '06:00', requestedPdHours: '06:00', approvedPdHours: '06:00', mandayConversion: '0.75', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-015', epName: 'Mukesh Pandey', punchDate: '18-01-2026', actualPdHours: '04:00', requestedPdHours: '04:00', approvedPdHours: '00:00', mandayConversion: '0.00', requestedEicName: 'K. Menon', status: 'Rejected' },
];

/* ---------------- Week-Off ---------------- */
export const weekOffColumns: ReportColumn[] = [
  { key: 'epNumber', label: 'EP NO', align: 'left', width: 'w-[104px] min-w-[104px]' },
  { key: 'epName', label: 'EP NAME', align: 'left', width: 'w-[140px] min-w-[140px]' },
  { key: 'weekOffDate', label: 'WEEK OFF DATE', align: 'center', width: 'w-[110px] min-w-[110px]' },
  { key: 'punch1', label: 'PUNCH1', align: 'center', width: 'w-[80px] min-w-[80px]' },
  { key: 'punch2', label: 'PUNCH2', align: 'center', width: 'w-[80px] min-w-[80px]' },
  { key: 'overtime', label: 'OVERTIME', align: 'center', width: 'w-[92px] min-w-[92px]' },
  { key: 'requestedEicName', label: 'REQUESTED EIC NAME', align: 'left', width: 'w-[150px] min-w-[150px]' },
  { key: 'status', label: 'STATUS', align: 'center', width: 'w-[104px] min-w-[104px]' },
];

export const weekOffData = [
  { epNumber: 'EP-2024-001', epName: 'Amit Patel', weekOffDate: '18-01-2026', punch1: '08:30', punch2: '17:30', overtime: '08:00', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-002', epName: 'Suresh Kumar', weekOffDate: '18-01-2026', punch1: '09:00', punch2: '15:00', overtime: '06:00', requestedEicName: 'K. Menon', status: 'Pending' },
  { epNumber: 'EP-2024-004', epName: 'Vijay Sharma', weekOffDate: '18-01-2026', punch1: '08:45', punch2: '18:00', overtime: '08:15', requestedEicName: 'S. Iyer', status: 'Approved' },
  { epNumber: 'EP-2024-006', epName: 'Anil Verma', weekOffDate: '11-01-2026', punch1: '08:30', punch2: '13:30', overtime: '05:00', requestedEicName: 'R. Sharma', status: 'Rejected' },
  { epNumber: 'EP-2024-008', epName: 'Deepak Joshi', weekOffDate: '11-01-2026', punch1: '08:00', punch2: '17:00', overtime: '08:00', requestedEicName: 'K. Menon', status: 'Approved' },
  { epNumber: 'EP-2024-010', epName: 'Karan Malhotra', weekOffDate: '11-01-2026', punch1: '09:15', punch2: '18:15', overtime: '08:00', requestedEicName: 'S. Iyer', status: 'Pending' },
  { epNumber: 'EP-2024-012', epName: 'Prakash Reddy', weekOffDate: '04-01-2026', punch1: '08:30', punch2: '16:30', overtime: '07:00', requestedEicName: 'R. Sharma', status: 'Approved' },
  { epNumber: 'EP-2024-013', epName: 'Santosh Nair', weekOffDate: '04-01-2026', punch1: '--', punch2: '--', overtime: '00:00', requestedEicName: 'K. Menon', status: 'Rejected' },
  { epNumber: 'EP-2024-015', epName: 'Mukesh Pandey', weekOffDate: '04-01-2026', punch1: '08:20', punch2: '17:50', overtime: '08:30', requestedEicName: 'S. Iyer', status: 'Approved' },
];
