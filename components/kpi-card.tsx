import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = '#5B3DF5', iconBgColor = '#EEF2FF', trend, className }: KpiCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <div className={cn('card-base p-5 transition-all duration-200', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 truncate leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBgColor }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={cn(
            'inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md',
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
          )}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
