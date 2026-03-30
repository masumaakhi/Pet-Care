// src/components/donations/ReceiptCard.jsx
import React from 'react';
import { CheckCircle2, Download, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/donationHelpers';

const ReceiptCard = ({ donation }) => {
  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/70 to-[#e5e3df]/60 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] max-w-lg mx-auto relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c]"></div>
      
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="text-2xl font-black text-[#2f3e2c]">Donation Receipt</h2>
          <p className="text-sm font-medium text-[#6b7d67]">Receipt #{donation.id.toUpperCase()}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-[#7fa37a]/30 to-[#8b6b4c]/20 rounded-full flex items-center justify-center border border-[#8b6b4c]/30 shadow-inner">
          <CheckCircle2 className="w-6 h-6 text-[#5f7d5a]" />
        </div>
      </div>

      <div className="space-y-4 mb-8 text-[#2f3e2c]">
        <div className="flex justify-between py-3 border-b border-[#8b6b4c]/20 text-sm">
          <span className="text-[#6b7d67] font-medium">Date</span>
          <span className="font-bold">{formatDate(donation.date)}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-[#8b6b4c]/20 text-sm">
          <span className="text-[#6b7d67] font-medium">Donor Name</span>
          <span className="font-bold">{donation.donorName || "John Doe"}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-[#8b6b4c]/20 text-sm">
          <span className="text-[#6b7d67] font-medium">Designation</span>
          <span className="font-bold">{donation.campaignName}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-[#8b6b4c]/20 text-sm">
          <span className="text-[#6b7d67] font-medium">Payment Status</span>
          <span className="font-bold text-[#5f7d5a] capitalize">{donation.status}</span>
        </div>
      </div>

      <div className="bg-white/40 border border-[#8b6b4c]/30 p-5 rounded-2xl flex justify-between items-center mb-8 shadow-sm">
        <span className="font-bold text-[#4e5f4a]">Total Donated</span>
        <span className="text-3xl font-black text-[#2f3e2c]">{formatCurrency(donation.amount)}</span>
      </div>

      <p className="text-xs text-[#6b7d67] text-center mb-8 font-medium px-4">
        Pet-Care Foundation is a registered 501(c)(3) nonprofit organization. Your contribution is tax-deductible to the extent allowed by law.
      </p>

      <div className="flex gap-4">
        <button className="flex-1 py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5f7d5a]/70 via-[#7fa37a]/80 to-[#8b6b4c]/70 text-black/80 font-bold rounded-xl border border-[#d6e2d3]/50 hover:shadow-lg hover:scale-[1.02] transition duration-300">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <button className="py-3 px-5 flex items-center justify-center bg-white/60 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/80 hover:shadow-md rounded-xl transition">
          <Printer className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ReceiptCard;
