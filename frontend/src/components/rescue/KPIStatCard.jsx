import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPIStatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorMap = {
    blue: "text-[#5f7d5a] bg-white/55",
    red: "text-[#8b6b4c] bg-white/55",
    green: "text-[#2f3e2c] bg-white/55",
    orange: "text-[#8b6b4c] bg-white/55",
    purple: "text-[#6b7d67] bg-white/55"
  };

  const bgBorderMap = {
    blue: "border-[#8b6b4c]/35",
    red: "border-[#8b6b4c]/35",
    green: "border-[#8b6b4c]/35",
    orange: "border-[#8b6b4c]/35",
    purple: "border-[#8b6b4c]/35"
  };

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300
      bg-transparent border ${bgBorderMap[color]}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-sm font-medium text-[#6b7d67] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#2f3e2c]">{value}</h3>
          
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-[#5f7d5a]' : 'text-[#8b6b4c]'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">{trendValue}</span>
              <span className="text-[#6b7d67] ml-1.5">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center
            border border-[#8b6b4c]/30 shadow-[0_12px_30px_rgba(0,0,0,0.08)]
            ${colorMap[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIStatCard;