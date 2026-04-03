import React from 'react';
import { MapPin } from 'lucide-react';

const RescueMapPanel = ({ className = "", height = "h-96", title = "Rescue Maps", markers = [] }) => {
  return (
    <div
      className={`rounded-3xl border border-[#8b6b4c]/35 overflow-hidden relative
      bg-gradient-to-br from-white/70 via-[#e5e3df]/70 to-[#a18463]/20
      backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.10)]
      ${height} ${className}`}
    >
      {/* Fake Map Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10"></div>

      {/* Fake Streets */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className="absolute top-4 left-4 bg-white/75 backdrop-blur-md px-4 py-2 rounded-xl
        shadow-[0_12px_30px_rgba(0,0,0,0.10)] font-semibold text-[#2f3e2c]
        text-sm z-10 border border-[#8b6b4c]/30 flex items-center"
      >
        <MapPin className="w-4 h-4 mr-2 text-[#5f7d5a]" />
        {title}
      </div>

      {markers.map((marker, idx) => (
        <div
          key={idx}
          className="absolute z-10 animate-bounce cursor-pointer group"
          style={{ top: marker.top || '50%', left: marker.left || '50%' }}
        >
          <div className="bg-[#7fa37a] text-[#2f3e2c] rounded-full p-2 shadow-lg ring-4 ring-[#7fa37a]/20">
            <MapPin className="w-5 h-5" />
          </div>

          {marker.label && (
            <div
              className="absolute top-12 left-1/2 -translate-x-1/2
              bg-[#2f3e2c] text-white text-xs px-2 py-1 rounded whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {marker.label}
            </div>
          )}
        </div>
      ))}

      {/* Crosshair Center indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-full text-[#5f7d5a] opacity-50"><hr /></div>
          <div className="absolute h-full border-l border-[#5f7d5a] opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default RescueMapPanel;