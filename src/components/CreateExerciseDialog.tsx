import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkoutStore } from '@/store/workoutStore';
import { Exercise } from '@/types/workout';
import { generateKeywords, muscleToCategory } from '@/lib/exerciseSearch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useHeaderContext } from './Layout';
import { MuscleInput } from './MuscleInput';

export function CreateExerciseDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [muscles, setMuscles] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const addCustomExercise = useWorkoutStore((state) => state.addCustomExercise);
  const { setIsOverlayOpen } = useHeaderContext();

  useEffect(() => {
    setIsOverlayOpen(open);
  }, [open, setIsOverlayOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }
    if (muscles.length === 0) {
      toast.error('Please select at least one muscle');
      return;
    }

    const category = muscleToCategory(muscles[0]);

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      muscles,
      keywords: generateKeywords(name.trim(), muscles),
      isDefault: false,
      category,
      muscleGroup: muscles[0],
      description: description.trim() || name.trim(),
      isCustom: true,
    };

    addCustomExercise(newExercise);
    toast.success('Exercise created!');

    setName('');
    setMuscles([]);
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              placeholder="e.g., Bulgarian Split Squat"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Muscles</Label>
            <MuscleInput value={muscles} onChange={setMuscles} placeholder="Search or add muscles..." />
            <p className="text-xs text-muted-foreground">
              First selected becomes the primary muscle group.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the exercise..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create Exercise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
