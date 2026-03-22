// src/components/donations/EmptyDonationState.jsx
import React from 'react';
import { HeartCrack } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmptyDonationState = ({ 
  title = "No Donations Yet", 
  message = "You haven't made any donations yet. Every contribution helps us save more lives.",
  actionText = "Donate Now",
  icon = <HeartCrack className="w-16 h-16 text-[#8b6b4c]/40 mb-4" />
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminArea = location.pathname.includes('/admin');

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/40 rounded-3xl border-2 border-dashed border-[#8b6b4c]/30 backdrop-blur-sm">
      {icon}
      <h3 className="text-xl font-bold text-[#2f3e2c] mb-2">{title}</h3>
      <p className="text-[#6b7d67] mb-6 max-w-md">{message}</p>
      
      {actionText && !isAdminArea && (
        <button 
          onClick={() => navigate('/donate')}
          className="px-6 py-3 bg-gradient-to-r from-[#5f7d5a]/80 via-[#7fa37a]/90 to-[#8b6b4c]/80 text-[#2f3e2c] rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition duration-300 backdrop-blur-md border border-[#d6e2d3]/50"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyDonationState;
