import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 
  | 'present' 
  | 'absent' 
  | 'partial' 
  | 'leave' 
  | 'holiday'
  | 'pending' 
  | 'approved' 
  | 'rejected'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  present: {
    label: 'Present',
    className: 'bg-success/10 text-success border-success/20',
  },
  absent: {
    label: 'Absent',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  partial: {
    label: 'Partial Day',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  leave: {
    label: 'On Leave',
    className: 'bg-info/10 text-info border-info/20',
  },
  holiday: {
    label: 'Holiday',
    className: 'bg-muted text-muted-foreground border-border',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '') as StatusType;
  
  // Map common status variations
  const statusMap: Record<string, StatusType> = {
    'present': 'present',
    'absent': 'absent',
    'partialday': 'partial',
    'partial': 'partial',
    'onleave': 'leave',
    'leave': 'leave',
    'holiday': 'holiday',
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
    'active': 'active',
    'inactive': 'inactive',
  };

  const mappedStatus = statusMap[normalizedStatus] || 'pending';
  const config = statusConfig[mappedStatus];

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
