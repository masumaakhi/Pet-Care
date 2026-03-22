import React from 'react';
import { getPriorityConfig } from '../../utils/rescueHelpers';

const PriorityBadge = ({ priority, className = "" }) => {
  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      bg-white/65 backdrop-blur-md text-[#2f3e2c]
      border border-[#8b6b4c]/35 shadow-[0_8px_20px_rgba(0,0,0,0.08)]
      ${className}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;