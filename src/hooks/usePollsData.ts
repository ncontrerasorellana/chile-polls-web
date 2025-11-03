import { useState, useEffect } from 'react';
import { pollsApi } from '../services/api';
import type { PollsResponse, Poll, Candidate, PollWithCandidate } from '../types';
import { format } from 'date-fns';

interface UsePollsDataParams {
  startDate?: Date | null;
  endDate?: Date | null;
  candidateIds?: string[];
  pollsterNames?: string[];
  page?: number;
  pageSize?: number;
  latest?: boolean;
}

interface UsePollsDataReturn {
  data: PollsResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const usePollsData = (params: UsePollsDataParams = {}): UsePollsDataReturn => {
  const [data, setData] = useState<PollsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = {
        ...(params.startDate && !params.latest && { dateFrom: format(params.startDate, 'yyyy-MM-dd') }),
        ...(params.endDate && !params.latest && { dateTo: format(params.endDate, 'yyyy-MM-dd') }),
        ...(params.candidateIds && params.candidateIds.length > 0 && { candidateIds: params.candidateIds }),
        ...(params.latest && { latest: true }),
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 500,
      };

      let response = await pollsApi.getPolls(apiParams);
      
      // Filter by pollsters on the client side if specified
      if (params.pollsterNames && params.pollsterNames.length > 0) {
        response = response.filter(poll => params.pollsterNames!.includes(poll.pollster));
      }
      
      // Transform the flat API response to the grouped format expected by the UI
      const transformedData = transformPollsData(response);
      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch polls'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [
    params.startDate,
    params.endDate,
    JSON.stringify(params.candidateIds),
    JSON.stringify(params.pollsterNames),
    params.page,
    params.pageSize,
    params.latest,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchPolls,
  };
};

// Transform flat API data (PollWithCandidate[]) to the grouped format (PollsResponse)
function transformPollsData(rawData: PollWithCandidate[]): PollsResponse {
  // Group by pollster and pollDate
  const pollsMap = new Map<string, Poll>();
  const candidatesMap = new Map<string, Candidate>();

  rawData.forEach((item) => {
    // Create a unique key for each poll (pollster + date)
    const pollKey = `${item.pollster}_${item.pollDate}`;

    // Add candidate to the candidates map
    if (!candidatesMap.has(item.candidateId)) {
      candidatesMap.set(item.candidateId, {
        id: item.candidate.id,
        name: item.candidate.name,
        party: item.candidate.party,
        imageUrl: item.candidate.imageUrl,
        color: getCandidateColor(item.candidate.name), // Assign color based on name
      });
    }

    // Create or update poll
    if (!pollsMap.has(pollKey)) {
      pollsMap.set(pollKey, {
        id: pollKey,
        pollsterName: item.pollster,
        pollDate: item.pollDate,
        entries: [],
      });
    }

    const poll = pollsMap.get(pollKey)!;
    poll.entries.push({
      id: item.id,
      candidateId: item.candidateId,
      candidateName: item.candidate.name,
      percentage: item.percentage,
      pollsterName: item.pollster,
      pollDate: item.pollDate,
    });
  });

  return {
    polls: Array.from(pollsMap.values()),
    candidates: Array.from(candidatesMap.values()),
    total: rawData.length,
    page: 1,
    pageSize: rawData.length,
  };
}

// Helper function to assign colors to candidates
function getCandidateColor(name: string): string {
  const colors: Record<string, string> = {
    'Evelyn Matthei': '#1e40af', // blue
    'Michelle Bachelet': '#dc2626', // red
    'José Antonio Kast': '#ea580c', // orange
    'Daniel Jadue': '#7c3aed', // purple
    'Franco Parisi': '#16a34a', // green
    'Eduardo Artés': '#ef4444', // red-500
  };
  
  return colors[name] || '#6b7280'; // default gray
}

