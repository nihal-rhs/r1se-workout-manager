import { memo, useCallback } from 'react';
import { Plus, Minus, Trash2, ChevronDown, Target, ClipboardPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  SetType,
  SET_TYPE_SHORT_LABELS,
  INTENSITY_LABELS,
  IntensityLevel,
} from '@/types/workout';
import { useWeightUnit, UNIT_STEP, UNIT_LABEL } from '@/store/weightUnitStore';

interface CreateSetRowProps {
  index: number;
  weight: number;
  setType: SetType;
  intensity: IntensityLevel;
  targetReps?: number;
  setNote?: string;
  noteOpen?: boolean;
  isOnlySet: boolean;
  onWeightChange: (weight: number) => void;
  onOpenIntensityPicker: () => void;
  onOpenSetTypePicker: () => void;
  onRemoveSet: () => void;
  onTargetRepsChange?: (reps: number) => void;
  onSetNoteChange?: (note: string) => void;
  onToggleNote?: () => void;
}

export const CreateSetRow = memo(function CreateSetRow({
  index,
  weight,
  setType,
  intensity,
  targetReps,
  setNote,
  noteOpen,
  isOnlySet,
  onWeightChange,
  onOpenIntensityPicker,
  onOpenSetTypePicker,
  onRemoveSet,
  onTargetRepsChange,
  onSetNoteChange,
  onToggleNote,
}: CreateSetRowProps) {
  const isNormal = setType === 'normal';
  const showNoteInput = noteOpen || !!setNote;
  const noteButton = onToggleNote ? (
    <button
      type="button"
      onClick={onToggleNote}
      className={cn(
        'h-8 w-8 rounded-md flex items-center justify-center transition-colors shrink-0',
        setNote
          ? 'text-primary'
          : 'text-muted-foreground/50 hover:text-muted-foreground',
      )}
      aria-label="Toggle set note"
    >
      <ClipboardPen className="w-3.5 h-3.5" />
    </button>
  ) : null;
  const noteInput = showNoteInput && onSetNoteChange ? (
    <input
      type="text"
      value={setNote || ''}
      onChange={(e) => onSetNoteChange(e.target.value)}
      placeholder="Note for this set..."
      className="bg-transparent border-b border-dashed border-border/50 text-xs text-muted-foreground focus:text-foreground focus:border-primary/40 focus:outline-none h-7 w-full px-0"
    />
  ) : null;
  const isChallenge = setType === 'challenge';

  const unit = useWeightUnit((s) => s.unit);
  const step = UNIT_STEP[unit];

  const handleWeightDecrement = useCallback(() => {
    onWeightChange(Math.max(0, weight - step));
  }, [weight, onWeightChange, step]);

  const handleWeightIncrement = useCallback(() => {
    onWeightChange(weight + step);
  }, [weight, onWeightChange, step]);

  const handleWeightInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onWeightChange(Number(e.target.value));
  }, [onWeightChange]);

  const handleTargetRepsChange = useCallback((delta: number) => {
    onTargetRepsChange?.(Math.max(1, (targetReps || 30) + delta));
  }, [targetReps, onTargetRepsChange]);

  const handleTargetRepsInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTargetRepsChange?.(Math.max(1, Number(e.target.value)));
  }, [onTargetRepsChange]);

  if (isChallenge) {
    return (
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
        {/* Top row: type selector + note + delete */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-medium text-primary gap-1"
            onClick={onOpenSetTypePicker}
          >
            <Target className="w-3.5 h-3.5" />
            Challenge Set
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
          <div className="flex items-center gap-0.5">
            {noteButton}
            {!isOnlySet && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onRemoveSet}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Weight row */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground px-1">Weight ({UNIT_LABEL[unit]})</label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-foreground" onClick={handleWeightDecrement}>
              <Minus className="w-3 h-3" />
            </Button>
            <Input type="number" value={weight} onChange={handleWeightInput} className="h-9 text-center min-w-0 text-foreground bg-background" />
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-foreground" onClick={handleWeightIncrement}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Target reps row */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground px-1">Total Rep Target</label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-foreground" onClick={() => handleTargetRepsChange(-5)}>
              <Minus className="w-3 h-3" />
            </Button>
            <Input type="number" value={targetReps || 30} onChange={handleTargetRepsInput} className="h-9 text-center min-w-0 text-foreground bg-background" />
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-foreground" onClick={() => handleTargetRepsChange(5)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Intensity row */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground px-1">Intensity</label>
          <Button variant="outline" size="sm" className="w-full h-9 text-sm text-foreground justify-center" onClick={onOpenIntensityPicker}>
            {intensity ? INTENSITY_LABELS[intensity] : '2 RIR'}
          </Button>
        </div>

        {noteInput}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[48px_1fr_64px_32px_32px] gap-1.5 items-center p-2 bg-background/50 rounded-lg">
        {/* Set column */}
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 px-1 text-xs font-medium text-foreground ${!isNormal ? 'text-primary' : ''}`}
          onClick={onOpenSetTypePicker}
        >
          {isNormal ? (
            <span className="text-sm text-foreground">{index + 1}</span>
          ) : (
            <span className="truncate text-primary">{SET_TYPE_SHORT_LABELS[setType]}</span>
          )}
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-50 shrink-0" />
        </Button>
        
        {/* Weight */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-foreground" onClick={handleWeightDecrement}>
            <Minus className="w-3 h-3" />
          </Button>
          <Input type="number" value={weight} onChange={handleWeightInput} className="h-9 text-center min-w-0 text-foreground bg-background/80" />
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-foreground" onClick={handleWeightIncrement}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Intensity */}
        <Button variant="outline" size="sm" className="h-9 text-xs px-1 text-foreground" onClick={onOpenIntensityPicker}>
          <span className="truncate">{intensity ? INTENSITY_LABELS[intensity] : '2 RIR'}</span>
        </Button>

        {/* Note toggle */}
        {noteButton}
        
        {/* Delete */}
        {!isOnlySet ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemoveSet}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
      {noteInput && <div className="px-2">{noteInput}</div>}
    </div>
  );
});
