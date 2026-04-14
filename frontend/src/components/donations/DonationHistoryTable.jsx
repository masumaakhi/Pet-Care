// src/components/donations/DonationHistoryTable.jsx
import React from 'react';
import { Download } from 'lucide-react';
import DonationStatusBadge from './DonationStatusBadge';
import DonationTypeBadge from './DonationTypeBadge';
import { formatCurrency, formatDate } from '../../utils/donationHelpers';

const DonationHistoryTable = ({ donations = [], onReceipt }) => {
  if (donations.length === 0) {
    return <div className="text-center p-8 text-[#6b7d67]">No donation history available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/30 backdrop-blur-xl border border-[#8b6b4c]/30 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#8b6b4c]/30">
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a]">Date</th>
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a]">Campaign / Pet</th>
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a]">Type</th>
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a]">Amount</th>
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a]">Status</th>
            <th className="py-4 px-6 text-sm font-bold text-[#4e5f4a] text-right">Receipt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#8b6b4c]/20">
          {donations.map((donation) => (
            <tr key={donation.id} className="hover:bg-white/40 transition-colors">
              <td className="py-4 px-6 text-sm text-[#2f3e2c] whitespace-nowrap font-medium">
                {formatDate(donation.date)}
              </td>
              <td className="py-4 px-6">
                <p className="text-sm font-bold text-[#2f3e2c]">{donation.campaignName}</p>
                <p className="text-xs text-[#6b7d67]">ID: {String(donation.id).slice(0, 8)}…</p>
              </td>
              <td className="py-4 px-6">
                <DonationTypeBadge type={donation.type} />
              </td>
              <td className="py-4 px-6 text-sm font-black text-[#5f7d5a]">
                {formatCurrency(donation.amount)}
              </td>
              <td className="py-4 px-6">
                <DonationStatusBadge status={donation.status} />
              </td>
              <td className="py-4 px-6 text-right">
                {donation.status === 'paid' ? (
                  <button
                    type="button"
                    onClick={() => onReceipt?.(donation)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-[#8b6b4c]/30 text-[#2f3e2c] rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt
                  </button>
                ) : (
                  <span className="text-xs text-[#6b7d67] italic">Not available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationHistoryTable;
