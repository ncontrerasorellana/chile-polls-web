import { useFilters } from '../hooks/useFilters';
import { motion } from 'framer-motion';

export const DateRangeFilter = () => {
  const { preset, setPreset } = useFilters();

  const presets = [
    { label: 'Último mes', value: 'month' as const, icon: '📆' },
    { label: 'Últimos 3 meses', value: '3months' as const, icon: '📊' },
    { label: 'Todos', value: 'all' as const, icon: '🗓️' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Período de tiempo</h3>

      <div className="relative">
        <select
          value={preset || 'month'}
          onChange={(e) => setPreset(e.target.value as 'latest' | 'month' | '3months' | 'all')}
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none transition-all hover:border-gray-400"
        >
          {presets.map((p) => (
            <option key={p.value} value={p.value}>
              {p.icon} {p.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
