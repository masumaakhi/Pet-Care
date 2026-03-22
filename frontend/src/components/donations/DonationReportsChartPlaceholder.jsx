// src/components/donations/DonationReportsChartPlaceholder.jsx
import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const DonationReportsChartPlaceholder = ({ title, type = "bar" }) => {
  return (
    <div className="p-6 md:p-8 flex flex-col h-80 h-full">
      <h3 className="text-xl font-bold text-[#2f3e2c] mb-6">{title}</h3>
      
      <div className="flex-grow flex items-center justify-center bg-white/40 rounded-2xl border border-dashed border-[#8b6b4c]/30 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-[#8b6b4c]/60">
          {type === 'bar' ? (
            <BarChart3 className="w-16 h-16 mb-4 stroke-1 opacity-50 text-[#5f7d5a]" />
          ) : (
            <TrendingUp className="w-16 h-16 mb-4 stroke-1 opacity-50 text-[#5f7d5a]" />
          )}
          <p className="text-sm font-bold text-[#4e5f4a]">Chart Visualization</p>
          <p className="text-xs text-[#6b7d67] mt-1 max-w-[200px] text-center font-medium">
            Integrate Recharts or Chart.js here for actual data visualization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationReportsChartPlaceholder;
