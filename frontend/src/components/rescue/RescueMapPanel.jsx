//src/components/rescue/RescueMapPanel.jsx
import React from 'react';
import { MapPin } from 'lucide-react';
import MapComponent from './MapComponent';

const RescueMapPanel = ({ 
  className = "", 
  height = "h-96", 
  title = "Rescue Maps", 
  markers = [], 
  onMapClick,
  onMarkerDrag,
  isDraggable = false,
  center
}) => {
  return (
    <div
      className={`rounded-3xl border border-[#8b6b4c]/35 overflow-hidden relative
      bg-gradient-to-br from-white/70 via-[#e5e3df]/70 to-[#a18463]/20
      backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.10)]
      ${height} ${className}`}
    >
      <div
        className="absolute top-4 left-4 bg-white/75 backdrop-blur-md px-4 py-2 rounded-xl
        shadow-[0_12px_30px_rgba(0,0,0,0.10)] font-semibold text-[#2f3e2c]
        text-sm z-[1000] border border-[#8b6b4c]/30 flex items-center"
      >
        <MapPin className="w-4 h-4 mr-2 text-[#5f7d5a]" />
        {title}
      </div>

      <MapComponent 
        height="100%" 
        markers={markers} 
        onMapClick={onMapClick}
        onMarkerDrag={onMarkerDrag}
        isDraggable={isDraggable}
        center={center}
      />
    </div>
  );
};

export default RescueMapPanel;
