import { create } from 'zustand';
import type { FilterState, DateRange } from '../types';
import { getPresetDateRange } from '../utils/dateHelpers';

interface FilterStore extends FilterState {
  setDateRange: (dateRange: DateRange) => void;
  setPreset: (preset: 'latest' | 'month' | '3months' | 'all') => void;
  setSelectedCandidates: (candidateIds: string[]) => void;
  toggleCandidate: (candidateId: string) => void;
  setSelectedPollsters: (pollsters: string[]) => void;
  togglePollster: (pollster: string) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  dateRange: getPresetDateRange('month'),
  selectedCandidates: [],
  selectedPollsters: [],
  preset: 'month',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setDateRange: (dateRange) =>
    set({ dateRange, preset: null }),

  setPreset: (preset) => {
    const dateRange = getPresetDateRange(preset);
    set({ preset, dateRange });
  },

  setSelectedCandidates: (candidateIds) =>
    set({ selectedCandidates: candidateIds }),

  toggleCandidate: (candidateId) =>
    set((state) => ({
      selectedCandidates: state.selectedCandidates.includes(candidateId)
        ? state.selectedCandidates.filter((id) => id !== candidateId)
        : [...state.selectedCandidates, candidateId],
    })),

  setSelectedPollsters: (pollsters) =>
    set({ selectedPollsters: pollsters }),

  togglePollster: (pollster) =>
    set((state) => ({
      selectedPollsters: state.selectedPollsters.includes(pollster)
        ? state.selectedPollsters.filter((p) => p !== pollster)
        : [...state.selectedPollsters, pollster],
    })),

  resetFilters: () => set(initialState),
}));
