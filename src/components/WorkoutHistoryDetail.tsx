import { WorkoutLog, INTENSITY_LABELS, SET_TYPE_LABELS } from '@/types/workout';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dumbbell,
  Clock,
  Trash2,
  Pencil,
  Layers,
  Activity,
  Weight,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { EditHistoryDialog } from './EditHistoryDialog';

interface WorkoutHistoryDetailProps {
  log: WorkoutLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (log: WorkoutLog) => void;
}

export function WorkoutHistoryDetail({
  log,
  open,
  onOpenChange,
  onDelete,
  onEdit,
}: WorkoutHistoryDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  if (!log) return null;

  const totalSets = log.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const totalVolume = log.exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0,
  );

  const handleDelete = () => {
    onDelete(log.id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  const handleSaveEdit = (updatedLog: WorkoutLog) => {
    onEdit(updatedLog);
    setShowEdit(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0">
          {/* Header */}
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold text-left truncate">
                  {log.workoutName}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(log.completedAt), 'EEEE, MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  aria-label="Edit workout"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  aria-label="Delete workout"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </SheetHeader>

          {/* Stats chips */}
          <div className="grid grid-cols-4 gap-2 px-5 pt-3 pb-2">
            <div className="bg-secondary/60 rounded-xl px-2 py-2.5 text-center">
              <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground tabular-nums">
                {log.duration}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Min
              </p>
            </div>
            <div className="bg-secondary/60 rounded-xl px-2 py-2.5 text-center">
              <Layers className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground tabular-nums">
                {totalSets}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Sets
              </p>
            </div>
            <div className="bg-secondary/60 rounded-xl px-2 py-2.5 text-center">
              <Weight className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground tabular-nums">
                {Math.round(totalVolume)}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Vol kg
              </p>
            </div>
            <div className="bg-secondary/60 rounded-xl px-2 py-2.5 text-center">
              <Activity className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground tabular-nums">
                {log.exercises.length}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Exercises
              </p>
            </div>
          </div>

          {/* Exercises */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
            {log.exercises.map((exercise, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {exercise.exerciseName}
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/30 overflow-hidden">
                  {/* Column headers */}
                  <div className="grid grid-cols-[28px_1fr_1fr_1fr] gap-2 px-3 py-2 border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>#</span>
                    <span>Weight</span>
                    <span>Reps</span>
                    <span className="text-right">Tags</span>
                  </div>
                  {exercise.sets.map((set, j) => {
                    const isChallenge = set.setType === 'challenge';
                    const hasTarget =
                      isChallenge && typeof (set as any).targetReps === 'number';
                    const targetReps = (set as any).targetReps as number | undefined;
                    const isPartial = hasTarget && set.reps < targetReps!;
                    const isOver = hasTarget && set.reps > targetReps!;
                    const setNote = (set as any).setNote as string | undefined;

                    return (
                      <div
                        key={j}
                        className="px-3 py-2 border-b border-border/30 last:border-0"
                      >
                        <div className="grid grid-cols-[28px_1fr_1fr_1fr] gap-2 items-center text-sm">
                          <span className="text-muted-foreground tabular-nums">
                            {j + 1}
                          </span>
                          <span className="font-bold text-foreground tabular-nums">
                            {set.weight}
                            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                              kg
                            </span>
                          </span>
                          <span
                            className={
                              isPartial
                                ? 'font-bold text-amber-400 tabular-nums'
                                : 'font-bold text-foreground tabular-nums'
                            }
                          >
                            {hasTarget
                              ? `${set.reps}/${targetReps}${isOver ? ' ↑' : ''}`
                              : set.reps}
                          </span>
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {set.intensity && (
                              <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
                                {INTENSITY_LABELS[set.intensity]}
                              </span>
                            )}
                            {set.setType && set.setType !== 'normal' && (
                              <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                                {SET_TYPE_LABELS[set.setType]}
                              </span>
                            )}
                          </div>
                        </div>
                        {setNote && (
                          <p className="text-[10px] text-muted-foreground italic mt-1 pl-1">
                            "{setNote}"
                          </p>
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
              variant="outline"
              className="w-full"
              onClick={() => setShowEdit(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Workout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <EditHistoryDialog
        log={log}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSave={handleSaveEdit}
      />

      <AlertDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this workout from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
