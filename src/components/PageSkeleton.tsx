import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("rounded-xl bg-secondary animate-pulse", className)} />;
}

export function TodaySkeleton() {
  return (
    <div className="space-y-4 pt-4 px-4 max-w-lg mx-auto">
      <Bone className="h-5 w-32" />
      <Bone className="h-40 w-full" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Bone key={i} className="h-16 w-28 rounded-2xl" />
        ))}
      </div>
      <Bone className="h-20 w-full" />
      <Bone className="h-32 w-full" />
    </div>
  );
}

export function PlanSkeleton() {
  return (
    <div className="space-y-3 pt-4 px-4 max-w-lg mx-auto">
      <Bone className="h-6 w-32" />
      {[1, 2, 3, 4].map((i) => (
        <Bone key={i} className="h-28 w-full" />
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="space-y-4 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Bone key={i} className="h-8 w-20" />
        ))}
      </div>
      <Bone className="h-48 w-full" />
      <Bone className="h-32 w-full" />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="space-y-3 pt-4 px-4 max-w-lg mx-auto">
      <Bone className="h-64 w-full" />
      {[1, 2, 3].map((i) => (
        <Bone key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export function WorkoutListSkeleton() {
  return (
    <div className="space-y-3 pt-4 px-4 max-w-lg mx-auto">
      <Bone className="h-6 w-40" />
      {[1, 2, 3].map((i) => (
        <Bone key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

export function ExerciseListSkeleton() {
  return (
    <div className="space-y-2 pt-4 px-4 max-w-lg mx-auto">
      <Bone className="h-10 w-full" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Bone key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
