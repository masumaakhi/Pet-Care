// src/components/donations/SponsorPetCard.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import { formatCurrency } from '../../utils/donationHelpers';

const SponsorPetCard = ({ pet }) => {
  return (
    <div className="group rounded-3xl overflow-hidden bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] hover:shadow-[0_55px_160px_rgba(95,125,90,0.35)] transition duration-500 flex flex-col relative">
      <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-sm z-10 cursor-pointer hover:bg-white/90 border border-white/40 transition-colors">
        <Heart className="w-5 h-5 text-[#8b6b4c]" />
      </div>

      <div className="relative h-56 overflow-hidden">
        <img 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 flex flex-col justify-end">
          <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{pet.name}</h3>
          <p className="text-sm text-white/90 drop-shadow-sm font-medium">{pet.breed} • {pet.age}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-[#6b7d67] text-sm mb-6 line-clamp-3 italic">"{pet.story}"</p>
        
        <div className="mt-auto pt-4 border-t border-[#8b6b4c]/20">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-[#6b7d67]">Monthly Support</span>
            <span className="text-xl font-bold text-[#5f7d5a]">{formatCurrency(pet.monthlySponsorshipAmount)}<span className="text-sm font-normal text-[#6b7d67]">/mo</span></span>
          </div>

          <button className="w-full py-3 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/70 hover:shadow-md transition flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-[#2f3e2c]" /> Become a Sponsor
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorPetCard;
