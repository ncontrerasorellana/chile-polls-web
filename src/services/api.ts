import axios from 'axios';
import type { Candidate, PollWithCandidate, CandidateAverage } from '../types';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const pollsApi = {
  // Fetch polls with filters - returns flat array of PollWithCandidate
  getPolls: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    candidateIds?: string[];
    pollster?: string;
    page?: number;
    pageSize?: number;
    latest?: boolean;
  }): Promise<PollWithCandidate[]> => {
    const response = await apiClient.get<PollWithCandidate[]>('/polls', { params });
    return response.data;
  },

  // Fetch all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/candidates');
    return response.data;
  },

  // Fetch candidate by ID
  getCandidateById: async (id: string): Promise<Candidate> => {
    const response = await apiClient.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },

  // Fetch averages for a period
  getAverages: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    days?: number;
  }): Promise<CandidateAverage[]> => {
    const response = await apiClient.get<CandidateAverage[]>('/polls/averages', { params });
    return response.data;
  },

  // Fetch latest polls
  getLatestPolls: async (limit?: number): Promise<PollWithCandidate[]> => {
    const response = await apiClient.get<PollWithCandidate[]>('/polls/latest', { 
      params: { limit } 
    });
    return response.data;
  },
};

export default apiClient;
