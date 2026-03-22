import React from 'react';
import { getStatusConfig } from '../../utils/rescueHelpers';

const RescueStatusBadge = ({ status, className = "" }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      border bg-white/65 backdrop-blur-md text-[#2f3e2c] border-[#8b6b4c]/35 ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 mr-1.5" />}
      {config.label}
    </span>
  );
};

export default RescueStatusBadge;