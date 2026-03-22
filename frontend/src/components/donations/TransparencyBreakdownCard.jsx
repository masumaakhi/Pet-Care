// src/components/donations/TransparencyBreakdownCard.jsx
import React from 'react';
import { PieChart, Info } from 'lucide-react';

const TransparencyBreakdownCard = ({ data = [], title = "How Your Funds Are Used" }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        We ensure complete transparency. 100% of your donation is distributed exactly where it is needed most.
      </p>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color || 'bg-blue-500'}`}></span>
                {item.category}
              </span>
              <span className="font-bold text-gray-900">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${item.color || 'bg-blue-500'}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-emerald-50 rounded-xl flex items-start gap-3 border border-emerald-100">
        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800">
          Our foundation covers its own administrative costs through private endowments, so your public donations go directly to the animals.
        </p>
      </div>
    </div>
  );
};

export default TransparencyBreakdownCard;
