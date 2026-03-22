// src/components/donations/FundDistributionTable.jsx
import React from 'react';
import { formatCurrency } from '../../utils/donationHelpers';

const FundDistributionTable = ({ distribution = [] }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden h-full">
      <div className="p-6 md:p-8 border-b border-[#8b6b4c]/30 bg-white/40">
        <h3 className="text-xl font-bold text-[#2f3e2c]">Fund Distribution Overview</h3>
        <p className="text-sm font-medium text-[#6b7d67]">Allocation of total raised funds across categories.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#e5e3df]/40 text-[#4e5f4a] text-xs font-bold uppercase tracking-wider border-b border-[#8b6b4c]/30">
              <th className="py-4 px-6 md:px-8">Category</th>
              <th className="py-4 px-6 md:px-8">Allocation (%)</th>
              <th className="py-4 px-6 md:px-8 text-right">Amount Allocated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8b6b4c]/20">
            {distribution.map((item, index) => (
              <tr key={index} className="hover:bg-white/40 transition-colors">
                <td className="py-5 px-6 md:px-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-bold text-[#2f3e2c]">{item.category}</span>
                  </div>
                </td>
                <td className="py-5 px-6 md:px-8">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#2f3e2c] w-8">{item.percentage}%</span>
                    <div className="w-32 bg-white/50 border border-[#8b6b4c]/20 rounded-full h-2 hidden sm:block shadow-inner">
                      <div 
                        className={`h-2 rounded-full shadow-sm ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 md:px-8 text-right font-black text-[#5f7d5a]">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundDistributionTable;
