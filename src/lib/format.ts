export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Dark-mode status badge classes */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'captain_assigned':
    case 'paid':
    case 'completed':
      return 'bg-green-900/40 text-green-400';
    case 'pending':
      return 'bg-amber-900/40 text-amber-400';
    case 'cancelled':
    case 'refunded':
      return 'bg-red-900/40 text-red-400';
    default:
      return 'bg-white/10 text-slate-400';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'captain_assigned':
      return 'Captain Assigned';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
