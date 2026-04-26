import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_MUSCLES = [
  'Chest', 'Upper Chest', 'Lower Chest',
  'Back', 'Lats', 'Upper Lats', 'Lower Lats', 'Traps', 'Mid Traps', 'Lower Traps', 'Rhomboids', 'Lower Back', 'Teres Major',
  'Shoulders', 'Front Delts', 'Side Delts', 'Rear Delts',
  'Biceps', 'Long Head Bicep', 'Short Head Bicep',
  'Triceps', 'Long Head Tricep', 'Lateral Head Tricep', 'Medial Head Tricep',
  'Forearms',
  'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Hip Flexors', 'Adductors', 'Abductors',
  'Abs', 'Obliques', 'Core',
  'Neck', 'Serratus',
];

interface MuscleStore {
  muscles: string[];
  addMuscle: (name: string) => void;
  deleteMuscle: (name: string) => void;
  renameMuscle: (oldName: string, newName: string) => void;
}

export const useMuscleStore = create<MuscleStore>()(
  persist(
    (set, get) => ({
      muscles: DEFAULT_MUSCLES,
      addMuscle: (name) => {
        const trimmed = name.trim();
        if (!trimmed || get().muscles.some((m) => m.toLowerCase() === trimmed.toLowerCase())) return;
        set((s) => ({ muscles: [...s.muscles, trimmed].sort() }));
      },
      deleteMuscle: (name) => {
        // Soft delete — remove from list but do NOT remove from exercises that reference it
        set((s) => ({ muscles: s.muscles.filter((m) => m !== name) }));
      },
      renameMuscle: (oldName, newName) => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        set((s) => ({ muscles: s.muscles.map((m) => (m === oldName ? trimmed : m)) }));
      },
    }),
    { name: 'muscle-store' },
  ),
);
