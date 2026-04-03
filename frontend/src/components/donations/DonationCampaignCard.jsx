// src/components/donations/DonationCampaignCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonationTypeBadge from './DonationTypeBadge';
import { calculateProgressPercentage, formatCurrency } from '../../utils/donationHelpers';

const DonationCampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const percentage = calculateProgressPercentage(campaign.raised, campaign.goal);
  const isUrgent = campaign.type === 'rescue';

  return (
    <div 
      className="group rounded-3xl overflow-hidden
      bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
      backdrop-blur-2xl border border-[#8b6b4c]/45
      shadow-[0_25px_80px_rgba(0,0,0,0.12)] hover:shadow-[0_55px_160px_rgba(95,125,90,0.35)]
      transition duration-500 flex flex-col cursor-pointer"
      onClick={() => navigate(`/donations/campaign/${campaign.id}`)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
        <div className="absolute top-4 left-4">
          <DonationTypeBadge type={campaign.type} />
        </div>
        {isUrgent && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
            URGENT
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-2 line-clamp-1">{campaign.title}</h3>
        <p className="text-[#6b7d67] text-sm mb-6 line-clamp-2 flex-grow">{campaign.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#5f7d5a] font-bold">{formatCurrency(campaign.raised)} <span className="text-[#6b7d67] font-normal">raised</span></span>
            <span className="text-[#6b7d67]">{percentage}%</span>
          </div>
          
          <div className="w-full bg-white/50 border border-[#8b6b4c]/20 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6b7d67] mb-5">
            <span>Goal: {formatCurrency(campaign.goal)}</span>
            <span className="flex items-center gap-1">
              <span className="font-bold text-[#2f3e2c]">{campaign.supporters}</span> supporters
            </span>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c] text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition duration-300">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationCampaignCard;
