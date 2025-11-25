import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-800 py-4 px-4">
          <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex-1 space-x-2 flex justify-end">
             <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
             <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
             <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;