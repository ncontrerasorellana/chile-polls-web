import { useState, useEffect } from 'react';
import { pollsApi } from '../services/api';
import type { Candidate } from '../types';

interface UseCandidatesReturn {
  candidates: Candidate[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCandidates = (): UseCandidatesReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pollsApi.getCandidates();
      setCandidates(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch candidates'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
  };
};
