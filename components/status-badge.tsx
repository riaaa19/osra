import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending:    { label: 'Pending',    bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  confirmed:  { label: 'Confirmed',  bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  packed:     { label: 'Packed',     bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  shipped:    { label: 'Shipped',    bg: '#ECFEFF', text: '#0E7490', border: '#A5F3FC' },
  delivered:  { label: 'Delivered',  bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  cancelled:  { label: 'Cancelled',  bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  active:     { label: 'Active',     bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  inactive:   { label: 'Inactive',   bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  suspended:  { label: 'Suspended',  bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  draft:      { label: 'Draft',      bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  approved:   { label: 'Approved',   bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  rejected:   { label: 'Rejected',   bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  paid:       { label: 'Paid',       bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  overdue:    { label: 'Overdue',    bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  low:        { label: 'Low Stock',  bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  live:       { label: 'Live',       bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'awaiting admin acceptance': { label: 'Awaiting Admin',   bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'token reserved':            { label: 'Token Reserved',   bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'ready to dispatch':         { label: 'Ready to Dispatch', bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  dispatched:                  { label: 'Dispatched',       bg: '#ECFEFF', text: '#0E7490', border: '#A5F3FC' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const cfg = STATUS_CONFIG[key] ?? { label: status, bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };

  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide whitespace-nowrap', className)}
      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}
