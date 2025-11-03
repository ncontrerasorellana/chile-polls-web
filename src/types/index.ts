// Core data types for Chilean Presidential Polls
// Adjusted to match API DTOs from chile-polls-api

export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl?: string;
  createdAt?: Date | string;
  pollCount?: number;
  poll_count?: string;
  color?: string;
}

export interface PollWithCandidate {
  id: string;
  candidateId: string;
  percentage: number;
  pollDate: string; // ISO date string
  pollster: string;
  source?: string;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    party: string;
    imageUrl?: string;
  };
}

export interface PollEntry {
  id: string;
  candidateId: string;
  candidateName: string;
  percentage: number;
  pollsterName: string;
  pollDate: string; // ISO date string
  sampleSize?: number;
  marginOfError?: number;
}

export interface Poll {
  id: string;
  pollsterName: string;
  pollDate: string; // ISO date string
  sampleSize?: number;
  marginOfError?: number;
  entries: PollEntry[];
}

export interface PollsResponse {
  polls: Poll[];
  candidates: Candidate[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CandidateAverage {
  id: string;
  name: string;
  party: string;
  averagePercentage: number;
  pollCount: number;
  // Additional fields for UI
  candidateId?: string;
  candidateName?: string;
  average?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  color?: string;
}

export interface AveragesData {
  period: string;
  averages: CandidateAverage[];
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FilterState {
  dateRange: DateRange;
  selectedCandidates: string[];
  selectedPollsters: string[];
  preset: 'latest' | 'month' | '3months' | 'all' | null;
}

export interface ChartDataPoint {
  date: string;
  [candidateId: string]: number | string;
}

export interface SparklineData {
  date: string;
  value: number;
}
