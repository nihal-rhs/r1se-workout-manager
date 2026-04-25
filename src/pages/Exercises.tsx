import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ExerciseCard } from '@/components/ExerciseCard';
import { CreateExerciseDialog } from '@/components/CreateExerciseDialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { exercises } from '@/data/exercises';
import { useWorkoutStore } from '@/store/workoutStore';
import { useExerciseSearch } from '@/lib/exerciseSearch';
import { Search, SlidersHorizontal, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Exercises = () => {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [customOnly, setCustomOnly] = useState(false);
  const customExercises = useWorkoutStore((state) => state.customExercises);

  const allExercises = [...exercises, ...customExercises];
  const filteredExercises = useExerciseSearch(allExercises, search);

  const allMuscleGroups = useMemo(() => {
    const groups = new Set<string>();
    allExercises.forEach((e) => {
      if (e.muscleGroup) groups.add(e.muscleGroup);
      if ((e as any).muscles) (e as any).muscles.forEach((m: string) => groups.add(m));
    });
    return Array.from(groups).sort();
  }, [allExercises]);

  const displayedExercises = useMemo(() => {
    let result = filteredExercises;
    if (customOnly) {
      result = result.filter(
        (e) =>
          (e as any).isCustom ||
          customExercises.some((c: any) => c.id === e.id)
      );
    }
    if (selectedMuscles.length > 0) {
      result = result.filter((e) =>
        selectedMuscles.some(
          (m) =>
            (e.muscleGroup || '').toLowerCase() === m.toLowerCase() ||
            ((e as any).muscles || []).some(
              (em: string) => em.toLowerCase() === m.toLowerCase()
            )
        )
      );
    }
    return result;
  }, [filteredExercises, customOnly, selectedMuscles, customExercises]);

  const activeFilterCount = selectedMuscles.length + (customOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedMuscles([]);
    setCustomOnly(false);
  };

  return (
    <Layout>
      <div className="container max-w-lg animate-fade-in px-4">
        <div className="pt-4 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Exercise Library</h2>
            <p className="text-sm text-muted-foreground">
              {allExercises.length} exercises available
            </p>
          </div>
          <div className="shrink-0 pt-1">
            <CreateExerciseDialog />
          </div>
        </div>

        <div className="space-y-3">
          {/* Search + filter row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or muscle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-10 rounded-xl border text-sm font-medium transition-colors shrink-0",
                activeFilterCount > 0
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 ? `Filter (${activeFilterCount})` : 'Filter'}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customOnly && (
                <Badge
                  className="gap-1 bg-primary/15 text-primary border-primary/25 cursor-pointer"
                  onClick={() => setCustomOnly(false)}
                >
                  Custom only <X className="w-2.5 h-2.5" />
                </Badge>
              )}
              {selectedMuscles.map((m) => (
                <Badge
                  key={m}
                  className="gap-1 bg-primary/15 text-primary border-primary/25 cursor-pointer"
                  onClick={() =>
                    setSelectedMuscles((p) => p.filter((x) => x !== m))
                  }
                >
                  {m} <X className="w-2.5 h-2.5" />
                </Badge>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-muted-foreground underline self-center"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Exercise list */}
          <div className="space-y-2 pt-1">
            {displayedExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
            {displayedExercises.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No exercises found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Filter Exercises</SheetTitle>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-muted-foreground underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </SheetHeader>
          <div className="space-y-5 pb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Type
              </p>
              <button
                type="button"
                onClick={() => setCustomOnly((p) => !p)}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors min-h-[44px]",
                  customOnly
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-secondary text-foreground"
                )}
              >
                <span className="text-sm font-medium">Custom exercises only</span>
                {customOnly && <Check className="w-4 h-4" />}
              </button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Muscle Group
              </p>
              <div className="grid grid-cols-2 gap-2">
                {allMuscleGroups.map((muscle) => {
                  const isSelected = selectedMuscles.includes(muscle);
                  return (
                    <button
                      type="button"
                      key={muscle}
                      onClick={() =>
                        setSelectedMuscles((p) =>
                          isSelected ? p.filter((m) => m !== muscle) : [...p, muscle]
                        )
                      }
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors text-left min-h-[44px]",
                        isSelected
                          ? "border-primary/40 bg-primary/10 text-primary font-medium"
                          : "border-border bg-secondary text-foreground"
                      )}
                    >
                      <span>{muscle}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm min-h-[44px]"
            >
              Show {displayedExercises.length} exercise
              {displayedExercises.length !== 1 ? 's' : ''}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Exercises;
