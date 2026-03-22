// src/components/donations/DonationProgressCard.jsx
import React from 'react';
import { calculateProgressPercentage, formatCurrency } from '../../utils/donationHelpers';

const DonationProgressCard = ({ goal, raised, title = "Funding Progress", compact = false }) => {
  const percentage = calculateProgressPercentage(raised, goal);

  return (
    <div className={`w-full ${compact ? '' : 'p-5 sm:p-6 bg-white/55 backdrop-blur-xl rounded-3xl border border-[#8b6b4c]/35 shadow-[0_16px_40px_rgba(0,0,0,0.08)]'}`}>
      {!compact && <h3 className="text-lg font-bold text-[#2f3e2c] mb-4">{title}</h3>}
      
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-[#5f7d5a]">{formatCurrency(raised)} raised</span>
        <span className="text-[#6b7d67]">Goal: {formatCurrency(goal)}</span>
      </div>
      
      <div className="w-full bg-white/50 border border-[#8b6b4c]/20 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] h-3 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-right">
        <span className="text-xs text-[#4e5f4a] font-bold">{percentage}% Funded</span>
      </div>
    </div>
  );
};

export default DonationProgressCard;
