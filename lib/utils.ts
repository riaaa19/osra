import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export const ORDER_STATUS_MAP = {
  pending: { label: 'Pending', color: 'status-pending' },
  confirmed: { label: 'Confirmed', color: 'status-confirmed' },
  packed: { label: 'Packed', color: 'status-packed' },
  shipped: { label: 'Shipped', color: 'status-shipped' },
  delivered: { label: 'Delivered', color: 'status-delivered' },
  cancelled: { label: 'Cancelled', color: 'status-cancelled' },
} as const;

export const MIDDLEMAN_STATUS_MAP = {
  pending: { label: 'Pending', color: 'status-pending' },
  active: { label: 'Active', color: 'status-active' },
  suspended: { label: 'Suspended', color: 'status-suspended' },
} as const;

export const PRODUCT_STATUS_MAP = {
  active: { label: 'Active', color: 'status-active' },
  inactive: { label: 'Inactive', color: 'status-inactive' },
  draft: { label: 'Draft', color: 'status-pending' },
} as const;
