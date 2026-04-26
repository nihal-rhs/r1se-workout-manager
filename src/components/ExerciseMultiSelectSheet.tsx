import { useState, useCallback, useRef } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { exercises } from '@/data/exercises';
import { useExerciseSearch } from '@/lib/exerciseSearch';
import { useWorkoutStore } from '@/store/workoutStore';
import { ExerciseCard } from './ExerciseCard';
import { InlineCreateExerciseDialog } from './InlineCreateExerciseDialog';
import { EditExerciseDialog } from './EditExerciseDialog';
import type { Exercise } from '@/types/workout';

interface ExerciseMultiSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (exerciseIds: string[]) => void;
  existingExerciseIds?: string[];
}

export function ExerciseMultiSelectSheet({
  open,
  onOpenChange,
  onAdd,
  existingExerciseIds = [],
}: ExerciseMultiSelectSheetProps) {
  const [search, setSearch] = useState('');
  const [staged, setStaged] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [flashedId, setFlashedId] = useState<string | null>(null);

  const customExercises = useWorkoutStore((state) => state.customExercises);
  const allExercises = [...exercises, ...customExercises];
  const filtered = useExerciseSearch(allExercises, search);

  const handleAdd = useCallback(() => {
    if (staged.length === 0) return;
    onAdd(staged);
    setStaged([]);
    setSearch('');
    onOpenChange(false);
  }, [staged, onAdd, onOpenChange]);

  const addToStaged = useCallback((exerciseId: string) => {
    setStaged((prev) => [...prev, exerciseId]);
  }, []);

  const removeFromStaged = useCallback((index: number) => {
    setStaged((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleExerciseCreated = useCallback((exerciseId: string) => {
    setStaged((prev) => [...prev, exerciseId]);
    setShowCreate(false);
  }, []);

  // Reset when sheet opens
  const handleOpenChange = useCallback(
    (o: boolean) => {
      if (o) {
        setStaged([]);
        setSearch('');
      }
      onOpenChange(o);
    },
    [onOpenChange],
  );

  const exerciseCount = staged.length;
  const label = exerciseCount === 1 ? 'Add 1 Exercise' : `Add ${exerciseCount} Exercises`;

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
          <SheetHeader className="px-4 pt-4 pb-3 border-b">
            <SheetTitle className="text-foreground">Add Exercises</SheetTitle>
          </SheetHeader>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          {/* Create new exercise — always pinned */}
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 px-4 py-3 border-b border-border bg-background text-primary hover:bg-primary/5 transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Create New Exercise</p>
              <p className="text-[10px] text-muted-foreground">
                Add a custom exercise to your library
              </p>
            </div>
          </button>

          {/* Exercise list */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-2 py-2">
              {filtered.map((ex) => (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  isExisting={existingExerciseIds.includes(ex.id)}
                  flashed={flashedId === ex.id}
                  onTap={() => addToStaged(ex.id)}
                  onLongPress={() => {
                    setFlashedId(ex.id);
                    setTimeout(() => setFlashedId(null), 200);
                    setEditingExercise(ex);
                  }}
                />
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No exercises found</p>
              )}
            </div>
          </div>

          {/* Staging tray */}
          <div className="border-t bg-background px-4 pt-3">
            <div className="min-h-[44px] overflow-x-auto flex items-center gap-2 pb-2 scrollbar-hide">
              {staged.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tap exercises above to add them</p>
              ) : (
                staged.map((id, i) => {
                  const ex = allExercises.find((e) => e.id === id);
                  return (
                    <div
                      key={`${id}-${i}`}
                      className="flex items-center gap-1.5 shrink-0 bg-primary/15 border border-primary/25 rounded-full px-3 py-1"
                    >
                      <span className="text-sm font-medium text-foreground max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {ex?.name || 'Unknown'}
                      </span>
                      <button
                        onClick={() => removeFromStaged(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add button */}
            <Button onClick={handleAdd} disabled={staged.length === 0} className="w-full mb-4">
              {staged.length === 0 ? 'Add Exercises' : label}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <InlineCreateExerciseDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onExerciseCreated={handleExerciseCreated}
      />

      {editingExercise && (
        <EditExerciseDialog
          exercise={editingExercise}
          open={editingExercise !== null}
          onOpenChange={(o) => !o && setEditingExercise(null)}
        />
      )}
    </>
  );
}

// Row component handles long-press detection
function ExerciseRow({
  exercise,
  isExisting,
  flashed,
  onTap,
  onLongPress,
}: {
  exercise: Exercise;
  isExisting: boolean;
  flashed: boolean;
  onTap: () => void;
  onLongPress: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const longPressed = useRef(false);

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    longPressed.current = false;
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    timerRef.current = setTimeout(() => {
      longPressed.current = true;
      onLongPress();
    }, 400);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - startPos.current.x);
    const dy = Math.abs(e.touches[0].clientY - startPos.current.y);
    if (dx > 5 || dy > 5) cancelTimer();
  };

  const handleTouchEnd = () => {
    cancelTimer();
  };

  const handleClick = () => {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    onTap();
  };

  return (
    <div
      className={`relative transition-colors rounded-xl ${flashed ? 'bg-primary/10' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <ExerciseCard
        exercise={exercise}
        selected={false}
        onClick={handleClick}
        showEdit={false}
      />
      {isExisting && (
        <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          In workout
        </span>
      )}
    </div>
  );
}
