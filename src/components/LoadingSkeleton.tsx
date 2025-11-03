import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="card"
        >
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
