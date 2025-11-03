import { motion } from 'framer-motion';
import { Sparkline } from './Sparkline';
import type { Candidate, SparklineData } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  latestPercentage: number;
  trend: 'up' | 'down' | 'stable';
  change?: number;
  sparklineData: SparklineData[];
  index: number;
  isSecondRound?: boolean;
}

export const CandidateCard = ({
  candidate,
  latestPercentage,
  trend,
  change,
  sparklineData,
  index,
  isSecondRound = false,
}: CandidateCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const candidateColor = candidate.color || '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card group relative overflow-hidden ${
        isSecondRound ? 'ring-2 ring-blue-400 shadow-lg' : ''
      }`}
    >
      {/* Badge de segunda vuelta */}
      {isSecondRound && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
            <span>🏆</span>
            <span>2da Vuelta</span>
          </div>
        </div>
      )}
      
      {/* Barra de color lateral - más gruesa si está en segunda vuelta */}
      <div 
        className={`absolute left-0 top-0 bottom-0 ${isSecondRound ? 'w-2' : 'w-1.5'}`}
        style={{ backgroundColor: candidateColor }}
      />
      
      <div className="flex items-start gap-4 mb-4">
        {candidate.imageUrl ? (
          <div className="relative">
            <img
              src={candidate.imageUrl}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: candidateColor }}
            />
          </div>
        ) : (
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ backgroundColor: candidateColor }}
            >
              {candidate.name.charAt(0)}
            </div>
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {candidate.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: candidateColor }}
            />
            <p className="text-sm text-gray-600">{candidate.party}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-4xl font-bold" style={{ color: candidateColor }}>
            {latestPercentage.toFixed(1)}%
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon()}
              <span
                className={`text-sm font-medium ${
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {change > 0 ? '+' : ''}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Sparkline data={sparklineData} color={candidateColor} />
      </div>
    </motion.div>
  );
};
