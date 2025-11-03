import { motion } from 'framer-motion';
import { useFilters } from '../hooks/useFilters';
import { useCandidates } from '../hooks/useCandidates';

export const CandidateFilter = () => {
  const { candidates, loading } = useCandidates();
  const { selectedCandidates, toggleCandidate } = useFilters();

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Candidatos</h3>

      <div className="space-y-2">
        {candidates.map((candidate) => {
          const isSelected = selectedCandidates.includes(candidate.id);
          const candidateColor = candidate.color || '#6b7280';
          
          return (
            <label
              key={candidate.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'bg-gray-50 shadow-sm' 
                  : 'bg-white hover:bg-gray-50 border-transparent'
              }`}
              style={{
                borderColor: isSelected ? candidateColor : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCandidate(candidate.id)}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-1"
                style={{
                  accentColor: candidateColor,
                }}
              />
              <div className="ml-3 flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: candidateColor }}
                />
                <div>
                  <div className="font-medium text-gray-900">{candidate.name}</div>
                  <div className="text-sm text-gray-500">{candidate.party}</div>
                </div>
              </div>
              {isSelected && (
                <div 
                  className="w-2 h-2 rounded-full ml-auto"
                  style={{ backgroundColor: candidateColor }}
                />
              )}
            </label>
          );
        })}
      </div>

      {selectedCandidates.length > 0 && (
        <button
          onClick={() =>
            selectedCandidates.forEach((id) => toggleCandidate(id))
          }
          className="mt-4 w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Limpiar selección
        </button>
      )}
    </motion.div>
  );
};
