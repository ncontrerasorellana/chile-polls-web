import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePollsData } from '../hooks/usePollsData';
import { useCandidates } from '../hooks/useCandidates';
import { useFilters } from '../hooks/useFilters';
import { CandidateCard } from '../components/CandidateCard';
import { EvolutionChart } from '../components/EvolutionChart';
import { AveragesTable } from '../components/AveragesTable';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { CandidateFilter } from '../components/CandidateFilter';
import { PollsterFilter } from '../components/PollsterFilter';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { ChartDataPoint, SparklineData, CandidateAverage } from '../types';

export const Dashboard = () => {
  const { dateRange, selectedCandidates, selectedPollsters, preset } = useFilters();
  const { candidates, loading: candidatesLoading } = useCandidates();

  // Datos filtrados para mostrar
  const { data: pollsData, loading: pollsLoading, error } = usePollsData({
    startDate: preset === 'latest' ? undefined : dateRange.startDate,
    endDate: preset === 'latest' ? undefined : dateRange.endDate,
    candidateIds: selectedCandidates.length > 0 ? selectedCandidates : undefined,
    pollsterNames: selectedPollsters.length > 0 ? selectedPollsters : undefined,
    latest: preset === 'latest',
  });

  // Datos globales sin filtro de candidatos para calcular top 2
  const { data: globalPollsData, loading: globalPollsLoading } = usePollsData({
    startDate: preset === 'latest' ? undefined : dateRange.startDate,
    endDate: preset === 'latest' ? undefined : dateRange.endDate,
    pollsterNames: selectedPollsters.length > 0 ? selectedPollsters : undefined,
    latest: preset === 'latest',
  });

  // Filter candidates based on selection
  const displayCandidates = useMemo(() => {
    if (selectedCandidates.length === 0) return candidates;
    return candidates.filter((c) => selectedCandidates.includes(c.id));
  }, [candidates, selectedCandidates]);

  // Prepare chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!pollsData?.polls) return [];

    const dataByDate = new Map<string, { 
      candidatesData: Map<string, number[]>,
      pollsters: Set<string>
    }>();

    pollsData.polls.forEach((poll) => {
      const date = poll.pollDate;
      if (!dataByDate.has(date)) {
        dataByDate.set(date, {
          candidatesData: new Map(),
          pollsters: new Set()
        });
      }
      const dateInfo = dataByDate.get(date)!;
      dateInfo.pollsters.add(poll.pollsterName);

      poll.entries.forEach((entry) => {
        if (!dateInfo.candidatesData.has(entry.candidateId)) {
          dateInfo.candidatesData.set(entry.candidateId, []);
        }
        dateInfo.candidatesData.get(entry.candidateId)!.push(entry.percentage);
      });
    });

    const result: ChartDataPoint[] = [];
    dataByDate.forEach((dateInfo, date) => {
      const point: ChartDataPoint = { 
        date,
        pollsters: Array.from(dateInfo.pollsters).join(', ')
      };
      dateInfo.candidatesData.forEach((percentages, candidateId) => {
        const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
        point[candidateId] = avg;
      });
      result.push(point);
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [pollsData]);

  // Calculate global top 2 candidates (sin filtro de candidatos)
  const globalTopTwoIds = useMemo((): string[] => {
    if (!globalPollsData?.polls || globalPollsData.polls.length === 0 || !candidates) return [];

    // Calcular promedios globales para todos los candidatos
    const candidateAverages = new Map<string, number[]>();

    globalPollsData.polls.forEach((poll) => {
      poll.entries.forEach((entry) => {
        if (!candidateAverages.has(entry.candidateId)) {
          candidateAverages.set(entry.candidateId, []);
        }
        candidateAverages.get(entry.candidateId)!.push(entry.percentage);
      });
    });

    // Calcular promedio de cada candidato
    const averages = Array.from(candidateAverages.entries()).map(([candidateId, percentages]) => ({
      candidateId,
      average: percentages.reduce((a, b) => a + b, 0) / percentages.length,
    }));

    // Ordenar por promedio descendente y tomar los top 2
    const sortedAverages = averages.sort((a, b) => b.average - a.average);
    return sortedAverages.slice(0, 2).map(avg => avg.candidateId);
  }, [globalPollsData, candidates]);

  // Calculate averages and trends
  const averagesData = useMemo((): CandidateAverage[] => {
    if (!pollsData?.polls || pollsData.polls.length === 0 || !candidates) return [];

    // Agrupar polls por candidato con sus fechas
    const candidateData = new Map<string, Array<{ date: string; percentage: number }>>();

    pollsData.polls.forEach((poll) => {
      poll.entries.forEach((entry) => {
        if (!candidateData.has(entry.candidateId)) {
          candidateData.set(entry.candidateId, []);
        }
        candidateData.get(entry.candidateId)!.push({
          date: poll.pollDate,
          percentage: entry.percentage
        });
      });
    });

    return displayCandidates.map((candidate) => {
      const data = candidateData.get(candidate.id) || [];
      
      // Ordenar por fecha (más antiguo a más reciente)
      const sortedData = data.sort((a, b) => a.date.localeCompare(b.date));
      const percentages = sortedData.map(d => d.percentage);
      
      const average = percentages.length > 0
        ? percentages.reduce((a, b) => a + b, 0) / percentages.length
        : 0;

      // Calcular tendencia comparando datos más antiguos vs más recientes
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let change = 0;

      if (percentages.length >= 2) {
        // Tomar últimos 3 datos vs primeros 3 datos (o la mitad si hay menos)
        const sampleSize = Math.min(3, Math.floor(percentages.length / 2));
        
        const oldData = percentages.slice(0, sampleSize);
        const recentData = percentages.slice(-sampleSize);

        const oldAvg = oldData.reduce((a, b) => a + b, 0) / oldData.length;
        const recentAvg = recentData.reduce((a, b) => a + b, 0) / recentData.length;
        
        change = recentAvg - oldAvg;

        if (Math.abs(change) > 0.5) {
          trend = change > 0 ? 'up' : 'down';
        }
      }

      return {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        averagePercentage: average,
        pollCount: percentages.length,
        // UI fields
        candidateId: candidate.id,
        candidateName: candidate.name,
        average,
        trend,
        change,
        color: candidate.color || '#6b7280',
      };
    });
  }, [pollsData, displayCandidates, candidates]);

  // Prepare sparkline data for each candidate
  const sparklineDataMap = useMemo(() => {
    const map = new Map<string, SparklineData[]>();

    chartData.forEach((point) => {
      displayCandidates.forEach((candidate) => {
        if (!map.has(candidate.id)) {
          map.set(candidate.id, []);
        }
        const value = point[candidate.id];
        if (typeof value === 'number') {
          map.get(candidate.id)!.push({
            date: point.date,
            value,
          });
        }
      });
    });

    return map;
  }, [chartData, displayCandidates]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            No se pudieron cargar los datos. Por favor, intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  const loading = candidatesLoading || pollsLoading || globalPollsLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span>Encuestas Presidenciales Chile 2025</span>
            <span className="text-5xl">🇨🇱</span>
          </h1>
          <p className="text-gray-600">
            Seguimiento en tiempo real de la intención de voto
            {selectedPollsters.length > 0 && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📊 {selectedPollsters[0]}
              </span>
            )}
            {selectedPollsters.length === 0 && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                📈 Promedio General
              </span>
            )}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <DateRangeFilter />
            <PollsterFilter />
            <CandidateFilter />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {averagesData.map((avg, index) => {
                    const candidate = candidates.find((c) => c.id === avg.candidateId);
                    if (!candidate) return null;

                    // Solo mostrar badge de segunda vuelta si:
                    // 1. Hay 3 o más candidatos siendo visualizados
                    // 2. El candidato está en el top 2 global
                    const shouldShowSecondRound = displayCandidates.length >= 3;
                    const isInGlobalTopTwo = globalTopTwoIds.includes(avg.candidateId);

                    return (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        latestPercentage={avg.average || avg.averagePercentage}
                        trend={avg.trend || 'stable'}
                        change={avg.change}
                        sparklineData={sparklineDataMap.get(candidate.id) || []}
                        index={index}
                        isSecondRound={shouldShowSecondRound && isInGlobalTopTwo}
                      />
                    );
                  })}
                </div>

                <EvolutionChart data={chartData} candidates={displayCandidates} />

                {averagesData.length > 0 && (
                  <AveragesTable
                    averages={averagesData}
                    period={dateRange.startDate ? 'seleccionado' : 'completo'}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
