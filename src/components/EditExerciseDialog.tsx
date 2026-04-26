import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWorkoutStore } from '@/store/workoutStore';
import { Exercise } from '@/types/workout';
import { toast } from 'sonner';
import { useHeaderContext } from './Layout';
import { MuscleInput } from './MuscleInput';

interface EditExerciseDialogProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseDialog({ exercise, open, onOpenChange }: EditExerciseDialogProps) {
  const { exerciseMuscleOverrides, setExerciseMuscleGroup } = useWorkoutStore();
  const { setIsOverlayOpen } = useHeaderContext();

  const overridden = exerciseMuscleOverrides[exercise.id];
  const initialMuscles = overridden ? [overridden] : exercise.muscles;
  const [muscles, setMuscles] = useState<string[]>(initialMuscles);

  useEffect(() => {
    setIsOverlayOpen(open);
  }, [open, setIsOverlayOpen]);

  useEffect(() => {
    if (open) {
      const o = exerciseMuscleOverrides[exercise.id];
      setMuscles(o ? [o] : exercise.muscles);
    }
  }, [open, exercise.id, exercise.muscles, exerciseMuscleOverrides]);

  const handleSave = () => {
    if (muscles.length === 0) {
      toast.error('Please select at least one muscle');
      return;
    }
    setExerciseMuscleGroup(exercise.id, muscles[0]);
    toast.success('Exercise updated!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <Label>Exercise</Label>
            <p className="text-sm text-muted-foreground">{exercise.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Muscles</Label>
            <MuscleInput value={muscles} onChange={setMuscles} placeholder="Search or add muscles..." />
            <p className="text-xs text-muted-foreground">
              First selected becomes the primary muscle group.
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
