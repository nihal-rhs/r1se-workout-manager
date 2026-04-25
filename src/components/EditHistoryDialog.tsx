import { useState, useEffect } from 'react';
import {
  WorkoutLog,
  CompletedSet,
  INTENSITY_LABELS,
  SET_TYPE_LABELS,
  IntensityLevel,
  SetType,
} from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Dumbbell, Save, X, Plus, Minus, StickyNote, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EditHistoryDialogProps {
  log: WorkoutLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedLog: WorkoutLog) => void;
}

const INTENSITY_OPTIONS: IntensityLevel[] = [
  'unspecified',
  'warmup',
  '2rir',
  '1rir',
  'failure',
];
const SET_TYPE_OPTIONS: SetType[] = [
  'unspecified',
  'normal',
  'superset',
  'alternating',
  'challenge',
];

export function EditHistoryDialog({
  log,
  open,
  onOpenChange,
  onSave,
}: EditHistoryDialogProps) {
  const [editData, setEditData] = useState<WorkoutLog | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (log && open) {
      setEditData(JSON.parse(JSON.stringify(log)));
      setExpandedNotes(new Set());
    }
  }, [log, open]);

  if (!editData) return null;

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof CompletedSet,
    value: number | string | undefined,
  ) => {
    setEditData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex, ei) =>
          ei === exerciseIndex
            ? {
                ...ex,
                sets: ex.sets.map((s, si) =>
                  si === setIndex ? { ...s, [field]: value } : s,
                ),
              }
            : ex,
        ),
      };
    });
  };

  const handleSave = () => {
    if (editData) {
      onSave(editData);
      onOpenChange(false);
    }
  };

  const toggleNote = (key: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-bold text-left truncate">
                Edit Workout
              </SheetTitle>
              <p className="text-xs text-muted-foreground truncate">
                {editData.workoutName}
              </p>
            </div>
            <Button
              size="sm"
              glow
              onClick={handleSave}
              className="shrink-0 h-9"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              Save
            </Button>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {editData.exercises.map((exercise, ei) => (
            <div key={ei} className="space-y-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {exercise.exerciseName}
                </span>
              </div>

              <div className="space-y-3">
                {exercise.sets.map((set, si) => {
                  const noteKey = `${ei}-${si}`;
                  const noteOpen = expandedNotes.has(noteKey) || !!set.setNote;
                  const intensity = (set.intensity as IntensityLevel) || 'unspecified';
                  const setType = (set.setType as SetType) || 'unspecified';

                  return (
                    <div
                      key={si}
                      className="rounded-xl border border-border bg-secondary/40 p-3 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-background/60 rounded px-1.5 py-0.5">
                          Set {si + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleNote(noteKey)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center',
                            set.setNote
                              ? 'text-primary'
                              : 'text-muted-foreground/50 hover:text-muted-foreground',
                          )}
                          aria-label="Toggle note"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Weight */}
                      <div className="grid grid-cols-[64px_1fr] gap-2 items-center">
                        <span className="text-[11px] text-muted-foreground">
                          Weight
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateSet(ei, si, 'weight', Math.max(0, set.weight - 2.5))
                            }
                            className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-colors"
                            aria-label="Decrease weight"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-base font-bold text-foreground tabular-nums flex-1 text-center">
                            {set.weight}
                            <span className="text-[10px] font-normal text-muted-foreground ml-1">
                              kg
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSet(ei, si, 'weight', set.weight + 2.5)
                            }
                            className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-colors"
                            aria-label="Increase weight"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Reps */}
                      <div className="grid grid-cols-[64px_1fr] gap-2 items-center">
                        <span className="text-[11px] text-muted-foreground">
                          Reps
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateSet(ei, si, 'reps', Math.max(0, set.reps - 1))
                            }
                            className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-colors"
                            aria-label="Decrease reps"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-base font-bold text-foreground tabular-nums flex-1 text-center">
                            {set.reps}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateSet(ei, si, 'reps', set.reps + 1)}
                            className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-colors"
                            aria-label="Increase reps"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Intensity + Set type pickers */}
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg bg-background border border-border text-xs text-foreground hover:border-primary/40 transition-colors min-h-[36px]"
                            >
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Intensity
                              </span>
                              <span className="font-medium truncate flex-1 text-right">
                                {INTENSITY_LABELS[intensity]}
                              </span>
                              <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="p-1 w-40"
                            align="end"
                          >
                            {INTENSITY_OPTIONS.map((opt) => (
                              <button
                                type="button"
                                key={opt}
                                onClick={() =>
                                  updateSet(
                                    ei,
                                    si,
                                    'intensity',
                                    opt === 'unspecified' ? undefined : opt,
                                  )
                                }
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-md text-xs transition-colors',
                                  intensity === opt
                                    ? 'bg-primary/15 text-primary font-medium'
                                    : 'text-foreground hover:bg-secondary',
                                )}
                              >
                                {INTENSITY_LABELS[opt]}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg bg-background border border-border text-xs text-foreground hover:border-primary/40 transition-colors min-h-[36px]"
                            >
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Type
                              </span>
                              <span className="font-medium truncate flex-1 text-right">
                                {SET_TYPE_LABELS[setType]}
                              </span>
                              <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="p-1 w-44"
                            align="end"
                          >
                            {SET_TYPE_OPTIONS.map((opt) => (
                              <button
                                type="button"
                                key={opt}
                                onClick={() =>
                                  updateSet(
                                    ei,
                                    si,
                                    'setType',
                                    opt === 'unspecified' ? undefined : opt,
                                  )
                                }
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-md text-xs transition-colors',
                                  setType === opt
                                    ? 'bg-primary/15 text-primary font-medium'
                                    : 'text-foreground hover:bg-secondary',
                                )}
                              >
                                {SET_TYPE_LABELS[opt]}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Set note */}
                      {noteOpen && (
                        <input
                          type="text"
                          value={set.setNote || ''}
                          onChange={(e) =>
                            updateSet(ei, si, 'setNote', e.target.value)
                          }
                          placeholder="Note for this set..."
                          className="bg-transparent border-b border-dashed border-border/50 text-xs text-muted-foreground focus:text-foreground focus:border-primary/40 focus:outline-none h-7 w-full px-0"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/50">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
