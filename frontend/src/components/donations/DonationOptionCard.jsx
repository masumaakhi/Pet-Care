// src/components/donations/DonationOptionCard.jsx
import React from 'react';
import { Heart, ShieldAlert, PawPrint, Star } from 'lucide-react';

const icons = {
  general: <Heart className="w-8 h-8 text-[#5f7d5a]" />,
  rescue: <ShieldAlert className="w-8 h-8 text-[#8b6b4c]" />,
  pet_specific: <PawPrint className="w-8 h-8 text-[#2f3e2c]" />,
  sponsor: <Star className="w-8 h-8 text-[#7fa37a]" />
};

const backgrounds = {
  general: 'bg-gradient-to-br from-white/60 to-[#7fa37a]/10 hover:border-[#5f7d5a]/50',
  rescue: 'bg-gradient-to-br from-white/60 to-[#8b6b4c]/10 hover:border-[#8b6b4c]/50',
  pet_specific: 'bg-gradient-to-br from-white/60 to-[#2f3e2c]/5 hover:border-[#2f3e2c]/30',
  sponsor: 'bg-gradient-to-br from-white/60 to-[#7fa37a]/20 hover:border-[#7fa37a]/60'
};

const DonationOptionCard = ({ type, title, description, selected, onClick }) => {
  const icon = icons[type] || icons.general;
  const bg = backgrounds[type] || backgrounds.general;
  const isSelected = selected ? 'ring-2 ring-[#5f7d5a] border-transparent bg-white/80 shadow-md' : `border-[#8b6b4c]/30 ${bg} hover:shadow-sm`;

  return (
    <button
      onClick={() => onClick(type)}
      className={`text-left w-full p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-start gap-4 backdrop-blur-xl ${isSelected}`}
    >
      <div className={`p-3 bg-white/80 rounded-2xl shadow-sm border border-white/50 ${selected ? 'text-[#5f7d5a]' : ''}`}>
        {selected ? React.cloneElement(icon, { className: "w-8 h-8 text-[#5f7d5a]" }) : icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#2f3e2c] mb-1">{title}</h3>
        <p className="text-sm text-[#6b7d67] line-clamp-2">{description}</p>
      </div>
    </button>
  );
};

export default DonationOptionCard;
