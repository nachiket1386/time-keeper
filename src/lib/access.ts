import type { User } from '@/contexts/AuthContext';

export function canViewEmployee(
  user: User | null,
  employeeId?: string,
  employeeCode?: string,
): boolean {
  if (!user) return false;
  if (user.role === 'root') return true;
  if (user.role === 'admin') return !user.companyId;

  const assignedIds = user.assignedEmployees ?? [];
  const assignedCodes = user.assignedEmployeeCodes ?? [];

  if (user.role === 'user2') {
    return Boolean(
      (employeeId && assignedIds.includes(employeeId)) ||
        (employeeCode && assignedCodes.includes(employeeCode)),
    );
  }

  return Boolean(
    (employeeId && assignedIds.includes(employeeId)) ||
      (employeeCode && assignedCodes.includes(employeeCode)),
  );
}

export function filterEmployeeRecords<T extends { employeeId?: string; epNumber?: string; companyId?: string }>(
  records: T[],
  user: User | null,
): T[] {
  if (!user) return [];
  if (user.role === 'root') return records;

  if (user.role === 'admin') {
    return user.companyId
      ? records.filter((record) => record.companyId === user.companyId)
      : records;
  }

  return records.filter((record) => canViewEmployee(user, record.employeeId, record.epNumber));
}