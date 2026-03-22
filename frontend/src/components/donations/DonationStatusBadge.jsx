// src/components/donations/DonationStatusBadge.jsx
import React from 'react';

const DonationStatusBadge = ({ status }) => {
  
  const statusStyles = {
    paid: 'bg-[#5f7d5a]/20 text-[#2f3e2c] border-[#5f7d5a]/40',
    pending: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
    failed: 'bg-red-500/20 text-red-900 border-red-500/40'
  };

  const currentStyle = statusStyles[status?.toLowerCase()] || 'bg-gray-100/50 text-gray-800 border-gray-200/50';
  const formattedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${currentStyle}`}>
      {formattedStatus}
    </span>
  );
};

export default DonationStatusBadge;
