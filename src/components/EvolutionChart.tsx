import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint, Candidate } from '../types';
import { formatDateShort } from '../utils/dateHelpers';
import { parseISO } from 'date-fns';

interface EvolutionChartProps {
  data: ChartDataPoint[];
  candidates: Candidate[];
}

export const EvolutionChart = ({ data, candidates }: EvolutionChartProps) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Evolución temporal
        </h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No hay datos disponibles para el período seleccionado
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Evolución temporal de intención de voto
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateShort(parseISO(value))}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              
              const dataPoint = payload[0].payload;
              const pollsters = dataPoint.pollsters || 'Desconocido';
              
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <p className="font-semibold text-gray-900 mb-2">
                    {formatDateShort(parseISO(label as string))}
                  </p>
                  <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                    <span>📊</span>
                    <span className="font-medium">{pollsters}</span>
                  </div>
                  <div className="space-y-1">
                    {payload.map((entry: any) => {
                      const candidate = candidates.find(c => c.name === entry.name);
                      const candidateColor = candidate?.color || '#6b7280';
                      return (
                        <div key={entry.name} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: candidateColor }}
                            />
                            <span className="text-sm text-gray-700">{entry.name}</span>
                          </div>
                          <span 
                            className="text-sm font-bold" 
                            style={{ color: candidateColor }}
                          >
                            {entry.value.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-700">
                {value}
              </span>
            )}
          />
          {candidates.map((candidate) => {
            const candidateColor = candidate.color || '#6b7280';
            return (
              <Line
                key={candidate.id}
                type="monotone"
                dataKey={candidate.id}
                name={candidate.name}
                stroke={candidateColor}
                strokeWidth={2.5}
                dot={{ 
                  r: 4, 
                  fill: candidateColor,
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: 6,
                  fill: candidateColor,
                  strokeWidth: 2,
                  stroke: '#fff',
                  style: { filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }
                }}
                animationDuration={500}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
