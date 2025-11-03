import { motion } from 'framer-motion';
import { useFilters } from '../hooks/useFilters';
import { usePollsters } from '../hooks/usePollsters';

export const PollsterFilter = () => {
  const { pollsters, loading } = usePollsters();
  const { selectedPollsters, setSelectedPollsters } = useFilters();

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (pollsters.length === 0) {
    return null;
  }

  const handlePollsterChange = (pollster: string) => {
    if (selectedPollsters.includes(pollster)) {
      // If already selected, deselect it (show all)
      setSelectedPollsters([]);
    } else {
      // Select only this pollster
      setSelectedPollsters([pollster]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Encuestadoras</h3>

      <div className="space-y-2">
        {/* Option to show all pollsters */}
        <label
          className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <input
            type="radio"
            checked={selectedPollsters.length === 0}
            onChange={() => setSelectedPollsters([])}
            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <div className="ml-3 flex-1">
            <div className="font-medium text-gray-900">
              Todas las encuestadoras
            </div>
            <div className="text-xs text-gray-500">Promedio general</div>
          </div>
        </label>

        {/* Individual pollsters */}
        {pollsters.map((pollster) => (
          <label
            key={pollster}
            className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              checked={selectedPollsters.includes(pollster)}
              onChange={() => handlePollsterChange(pollster)}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">{pollster}</div>
            </div>
          </label>
        ))}
      </div>
    </motion.div>
  );
};
