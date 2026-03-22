import React from 'react';
import { Phone, Star, AlertCircle, ShieldCheck } from 'lucide-react';

const VolunteerInfoCard = ({ volunteer, minimal = false }) => {
  if (!volunteer) return null;

  return (
    <div
      className="rounded-3xl p-5
      bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
      backdrop-blur-2xl border border-[#8b6b4c]/45
      shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold
            bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
            text-[#2f3e2c] shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#d6e2d3]"
          >
            {volunteer.name ? volunteer.name.charAt(0) : "V"}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              volunteer.status === 'active' ? 'bg-[#7fa37a]' : 'bg-[#9aa39a]'
            }`}
          ></div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="text-base font-bold text-[#2f3e2c]">
                {volunteer.name}
              </h3>
              <div className="flex items-center mt-1 text-sm text-[#6b7d67]">
                <ShieldCheck className="w-4 h-4 mr-1 text-[#5f7d5a]" />
                Verified Responder
              </div>
            </div>

            {volunteer.rating && (
              <div
                className="flex items-center text-sm font-medium
                text-[#8b6b4c] bg-white/60 px-2.5 py-1 rounded-xl
                border border-[#8b6b4c]/30"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                {volunteer.rating}
              </div>
            )}
          </div>

          {!minimal && (
            <div
              className="mt-4 pt-4 border-t border-[#8b6b4c]/20
              grid grid-cols-2 gap-y-3 gap-x-4"
            >
              <div className="flex items-center text-sm text-[#4e5f4a]">
                <Phone className="w-4 h-4 mr-2 text-[#6b7d67]" />
                {volunteer.phone}
              </div>

              <div className="flex items-center text-sm text-[#4e5f4a]">
                <AlertCircle className="w-4 h-4 mr-2 text-[#6b7d67]" />
                {volunteer.activeCases} active cases
              </div>

              {volunteer.eta && (
                <div
                  className="col-span-2 flex items-center text-sm font-medium
                  text-[#2f3e2c] bg-white/55 px-3 py-2 rounded-2xl mt-1
                  border border-[#8b6b4c]/35"
                >
                  <span className="animate-pulse w-2 h-2 bg-[#7fa37a] rounded-full mr-2"></span>
                  ETA: {volunteer.eta}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerInfoCard;