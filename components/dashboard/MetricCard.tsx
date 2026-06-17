import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
}

export function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 space-y-1',
        highlight
          ? 'border-violet-500/50 bg-violet-500/10'
          : 'border-zinc-800 bg-zinc-900'
      )}
    >
      <p className="text-xs text-zinc-400 uppercase tracking-wider">{label}</p>
      <p className={cn('text-2xl font-bold', highlight ? 'text-violet-300' : 'text-zinc-100')}>
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}
