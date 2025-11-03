import { useFilterStore } from '../store/filterStore';
import type { DateRange } from '../types';

export const useFilters = () => {
  const {
    dateRange,
    selectedCandidates,
    selectedPollsters,
    preset,
    setDateRange,
    setPreset,
    setSelectedCandidates,
    toggleCandidate,
    setSelectedPollsters,
    togglePollster,
    resetFilters,
  } = useFilterStore();

  return {
    // State
    dateRange,
    selectedCandidates,
    selectedPollsters,
    preset,

    // Actions
    setDateRange: (range: DateRange) => setDateRange(range),
    setPreset: (preset: 'latest' | 'month' | '3months' | 'all') => setPreset(preset),
    setSelectedCandidates: (ids: string[]) => setSelectedCandidates(ids),
    toggleCandidate: (id: string) => toggleCandidate(id),
    setSelectedPollsters: (pollsters: string[]) => setSelectedPollsters(pollsters),
    togglePollster: (pollster: string) => togglePollster(pollster),
    resetFilters: () => resetFilters(),
  };
};
