// src/components/donations/DonationTypeBadge.jsx
import React from 'react';
import { getDonationTypeDetails } from '../../utils/donationHelpers';

const DonationTypeBadge = ({ type }) => {
  const { label } = getDonationTypeDetails(type);

  // Custom colors for the earthy theme rather than standard Tailwind colors
  const typeStyles = {
    general: 'bg-[#5f7d5a]/20 text-[#2f3e2c] border-[#5f7d5a]/30',
    rescue: 'bg-red-500/20 text-red-900 border-red-500/30',
    pet_specific: 'bg-[#8b6b4c]/20 text-[#4e5f4a] border-[#8b6b4c]/30',
    sponsor: 'bg-[#7fa37a]/30 text-[#2f3e2c] border-[#7fa37a]/40'
  };

  const currentStyle = typeStyles[type] || 'bg-gray-100/50 text-gray-800 border-gray-200/50';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${currentStyle}`}>
      {label}
    </span>
  );
};

export default DonationTypeBadge;
