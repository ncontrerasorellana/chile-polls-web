import { motion } from 'framer-motion';
import type { CandidateAverage } from '../types';

interface AveragesTableProps {
  averages: CandidateAverage[];
  period: string;
}

export const AveragesTable = ({ averages, period }: AveragesTableProps) => {
  const sortedAverages = [...averages].sort((a, b) => 
    (b.average || b.averagePercentage) - (a.average || a.averagePercentage)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Promedios del período {period}
        </h2>
        {sortedAverages.length >= 2 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-2xl">🗳️</span>
            <span className="text-sm font-medium text-blue-700">
              Los primeros 2 pasarían a segunda vuelta
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tendencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cambio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAverages.map((avg, index) => {
              const candidateColor = avg.color || '#6b7280';
              const isSecondRound = index < 2; // Los primeros 2 pasan a segunda vuelta
              
              return (
                <motion.tr
                  key={avg.candidateId || avg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors relative ${
                    isSecondRound ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''
                  }`}
                >
                  {/* Barra de color izquierda - más gruesa para los primeros 2 */}
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <div 
                      className={`absolute left-0 top-0 bottom-0 ${isSecondRound ? 'w-2' : 'w-1'}`}
                      style={{ backgroundColor: candidateColor }}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${isSecondRound ? 'text-blue-600' : 'text-gray-400'}`}>
                        {index + 1}
                      </span>
                      {isSecondRound && (
                        <span className="text-lg" title="Pasaría a segunda vuelta">
                          🏆
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full shadow-sm ${isSecondRound ? 'w-4 h-4' : 'w-3 h-3'}`}
                        style={{ backgroundColor: candidateColor }}
                      />
                      <div>
                        <div className={`text-sm font-medium ${isSecondRound ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                          {avg.candidateName || avg.name}
                        </div>
                        {isSecondRound && (
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Segunda vuelta
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold" style={{ color: candidateColor }}>
                        {(avg.average || avg.averagePercentage).toFixed(1)}%
                      </div>
                      {/* Barra de progreso visual */}
                      <div className="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: candidateColor,
                            width: `${Math.min((avg.average || avg.averagePercentage), 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {avg.trend === 'up' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ↑ Subiendo
                      </span>
                    )}
                    {avg.trend === 'down' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ↓ Bajando
                      </span>
                    )}
                    {(avg.trend === 'stable' || !avg.trend) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        → Estable
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {avg.change !== undefined && (
                      <span
                        className={`text-sm font-medium ${
                          avg.change > 0
                            ? 'text-green-600'
                            : avg.change < 0
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {avg.change > 0 ? '+' : ''}
                        {avg.change.toFixed(1)}%
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
