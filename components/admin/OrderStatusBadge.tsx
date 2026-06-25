import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  pending: 'bg-gold/10 text-gold border-gold/30',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'text-[10px] tracking-widest uppercase border rounded-full px-2.5 py-0.5',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}
