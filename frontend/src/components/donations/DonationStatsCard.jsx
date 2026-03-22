// src/components/donations/DonationStatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DonationStatsCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)] hover:shadow-[0_25px_60px_rgba(95,125,90,0.20)] transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#6b7d67]">{title}</h3>
        {icon && (
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#7fa37a]/30 to-[#8b6b4c]/20 text-[#2f3e2c]">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#2f3e2c]">{value}</span>
        
        {trend && (
          <div className="flex items-center mt-2 text-sm">
            <span className={`font-medium ${trend === 'up' ? 'text-[#5f7d5a]' : trend === 'down' ? 'text-red-500' : 'text-[#6b7d67]'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
            </span>
            <span className="text-[#6b7d67]/70 ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationStatsCard;
