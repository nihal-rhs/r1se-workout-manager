import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WeightUnit = 'kg' | 'lbs' | 'plates';

interface WeightUnitStore {
  unit: WeightUnit;
  setUnit: (unit: WeightUnit) => void;
}

export const useWeightUnit = create<WeightUnitStore>()(
  persist(
    (set) => ({
      unit: 'kg',
      setUnit: (unit) => set({ unit }),
    }),
    { name: 'weight-unit-store' },
  ),
);

export const UNIT_STEP: Record<WeightUnit, number> = {
  kg: 2.5,
  lbs: 5,
  plates: 1,
};

export const UNIT_LABEL: Record<WeightUnit, string> = {
  kg: 'kg',
  lbs: 'lbs',
  plates: 'plates',
};
