import React from 'react';

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7fa37a] mb-4
        shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
      ></div>
      <p className="text-[#6b7d67] font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;