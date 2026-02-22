import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';

export const LinearPriorityIcon = ({ priority, size = 16 }: { priority: number; size?: number }) => {
  const s = size;
  const barW = Math.max(2, s * 0.19);
  const gap = Math.max(0.5, s * 0.04);
  const totalBarsWidth = 4 * barW + 3 * gap;
  const offsetX = (s - totalBarsWidth) / 2;

  if (priority === 1) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect x={s * 0.15} y={s * 0.15} width={s * 0.7} height={s * 0.7} rx={s * 0.13} fill="#f97316" />
        <text
          x={s / 2}
          y={s / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={s * 0.6}
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >!</text>
      </svg>
    );
  }

  if (priority === 0) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line x1={s * 0.2} y1={s * 0.5} x2={s * 0.8} y2={s * 0.5} stroke="#a1a1aa" strokeWidth={1.5} strokeLinecap="round" strokeDasharray={`${s * 0.12} ${s * 0.1}`} />
      </svg>
    );
  }

  const activeBars = priority === 2 ? 3 : priority === 3 ? 2 : 1;
  const barHeights = [s * 0.25, s * 0.4, s * 0.55, s * 0.7];
  const activeColor = priority === 2 ? '#f97316' : priority === 3 ? '#eab308' : '#a1a1aa';

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={offsetX + i * (barW + gap)}
          y={s * 0.85 - barHeights[i]}
          width={barW}
          height={barHeights[i]}
          rx={barW * 0.25}
          fill={i < activeBars ? activeColor : '#d4d4d830'}
        />
      ))}
    </svg>
  );
};

const PRIORITY_LABELS: Record<number, string> = {
  0: 'No priority',
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

const COMPASS_TO_LINEAR: Record<string, number> = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4,
};

export const LinearPrioritySelect = ({
  value,
  onValueChange,
  size = 16,
  triggerClassName = '',
}: {
  value: number;
  onValueChange: (v: number) => void;
  size?: number;
  triggerClassName?: string;
}) => (
  <Select value={String(value)} onValueChange={v => onValueChange(Number(v))}>
    <SelectTrigger className={`h-auto w-auto p-1 -m-1 rounded-sm border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none !ring-0 !outline-none [&>svg:last-child]:hidden ${triggerClassName}`}>
      <LinearPriorityIcon priority={value} size={size} />
    </SelectTrigger>
    <SelectContent>
      {[0, 1, 2, 3, 4].map(p => (
        <SelectItem key={p} value={String(p)}>
          <div className="flex items-center gap-2">
            <LinearPriorityIcon priority={p} size={16} />
            <span>{PRIORITY_LABELS[p]}</span>
            <span className="ml-auto text-xs text-muted-foreground">{p}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const CompassPrioritySelect = ({
  value,
  onValueChange,
  size = 16,
  triggerClassName = '',
}: {
  value: string;
  onValueChange: (v: string) => void;
  size?: number;
  triggerClassName?: string;
}) => {
  const numericPriority = value === 'none' ? 0 : (COMPASS_TO_LINEAR[value] ?? 3);
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`h-auto w-auto p-1 -m-1 rounded-sm border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none !ring-0 !outline-none [&>svg:last-child]:hidden ${triggerClassName}`}>
        <LinearPriorityIcon priority={numericPriority} size={size} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <div className="flex items-center gap-2">
            <LinearPriorityIcon priority={0} size={16} />
            <span>No priority</span>
          </div>
        </SelectItem>
        {(['critical', 'high', 'medium', 'low'] as const).map(p => (
          <SelectItem key={p} value={p}>
            <div className="flex items-center gap-2">
              <LinearPriorityIcon priority={COMPASS_TO_LINEAR[p]} size={16} />
              <span className="capitalize">{p === 'critical' ? 'Urgent' : p}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export function formatShortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}
