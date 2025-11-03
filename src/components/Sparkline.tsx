import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { SparklineData } from '../types';

interface SparklineProps {
  data: SparklineData[];
  color: string;
}

export const Sparkline = ({ data, color }: SparklineProps) => {
  if (!data || data.length === 0) {
    return <div className="h-12 bg-gray-100 rounded" />;
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={48}>
        <LineChart data={data}>
          {/* Área de fondo con gradiente */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            fill={`url(#gradient-${color})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
