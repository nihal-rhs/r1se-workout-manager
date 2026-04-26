import { useWeightUnit, UNIT_LABEL, WeightUnit } from '@/store/weightUnitStore';
import { cn } from '@/lib/utils';

const UNITS: WeightUnit[] = ['kg', 'lbs', 'plates'];

export function WeightUnitSwitcher() {
  const unit = useWeightUnit((s) => s.unit);
  const setUnit = useWeightUnit((s) => s.setUnit);

  return (
    <div className="inline-flex items-center gap-0.5 bg-secondary/60 border border-border rounded-xl p-0.5">
      {UNITS.map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => setUnit(u)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all',
            unit === u
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {UNIT_LABEL[u]}
        </button>
      ))}
    </div>
  );
}
