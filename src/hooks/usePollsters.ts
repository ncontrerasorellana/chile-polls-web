import { useState, useEffect } from 'react';
import { pollsApi } from '../services/api';

interface UsePollstersReturn {
  pollsters: string[];
  loading: boolean;
  error: Error | null;
}

export const usePollsters = (): UsePollstersReturn => {
  const [pollsters, setPollsters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPollsters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all polls and extract unique pollster names
        const polls = await pollsApi.getPolls({ pageSize: 1000 });
        const uniquePollsters = Array.from(
          new Set(polls.map((poll) => poll.pollster))
        ).sort();
        
        setPollsters(uniquePollsters);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch pollsters'));
      } finally {
        setLoading(false);
      }
    };

    fetchPollsters();
  }, []);

  return {
    pollsters,
    loading,
    error,
  };
};
