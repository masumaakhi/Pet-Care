import React, { useState } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import { rescueRequests, volunteers } from '../../data/rescueMockData';
import { Map, Layers, RefreshCw, Crosshair, Users, Hospital } from 'lucide-react';

const AdminRescueMapPage = () => {
  const [selectedRescue, setSelectedRescue] = useState(null);

  const activeRescues = rescueRequests.filter(r => ['pending', 'in_progress', 'picked'].includes(r.status));
  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  const mapMarkers = [
    // Rescues
    ...activeRescues.map(r => ({
      top: `${30 + Math.random() * 50}%`,
      left: `${20 + Math.random() * 60}%`,
      label: `Task: ${r.id} (${r.status})`,
      type: 'rescue',
      data: r
    })),
    // Volunteers
    ...activeVolunteers.map(v => ({
      top: `${30 + Math.random() * 50}%`,
      left: `${20 + Math.random() * 60}%`,
      label: `Vol: ${v.name}`,
      type: 'volunteer',
      data: v
    }))
  ];

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader 
          title="Live Dispatch Radar" 
          description="Monitor active rescues, volunteer positions, and clinic destinations in real-time."
          actions={
            <div className="flex gap-2">
              <button
                className="flex items-center px-4 py-2.5 rounded-xl
                bg-white/55 border border-[#8b6b4c]/40
                text-[#2f3e2c] font-semibold text-sm
                hover:bg-white/70 hover:shadow-md transition"
              >
                <Layers className="w-4 h-4 mr-2" /> Map Layers
              </button>

              <button
                className="flex items-center px-4 py-2.5 rounded-xl
                bg-white/55 border border-[#8b6b4c]/40
                text-[#2f3e2c] font-semibold text-sm
                hover:bg-white/70 hover:shadow-md transition"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </button>
            </div>
          }
        />

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px] mt-4">
          
          {/* Main Map Area */}
          <div
            className="flex-1 rounded-3xl overflow-hidden relative
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl
            border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <RescueMapPanel height="h-full" title="City Overview" markers={mapMarkers} className="border-none rounded-none" />
            
            {/* Overlay Map Legend */}
            <div
              className="absolute bottom-6 left-6 bg-white/85 backdrop-blur-md p-4 rounded-2xl
              shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#8b6b4c]/25 z-20"
            >
              <h4 className="text-xs font-bold text-[#6b7d67] uppercase tracking-wider mb-3">
                Map Legend
              </h4>

              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                  <span className="w-3 h-3 rounded-full bg-[#8b6b4c] ring-2 ring-[#8b6b4c]/20 mr-3"></span>
                  Default Marker (Rescue)
                </div>

                <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                  <span className="w-3 h-3 rounded-full bg-[#5f7d5a] ring-2 ring-[#5f7d5a]/20 mr-3"></span>
                  Volunteer
                </div>

                <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                  <span className="w-3 h-3 rounded-md bg-[#7fa37a] ring-2 ring-[#7fa37a]/20 mr-3"></span>
                  Partner Clinic
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
            
            {/* Active Rescues List */}
            <div
              className="rounded-3xl overflow-hidden shrink-0
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <div className="p-4 bg-white/40 border-b border-[#8b6b4c]/20 flex justify-between items-center">
                <h3 className="font-bold text-[#2f3e2c] flex items-center">
                  <Crosshair className="w-5 h-5 mr-2 text-[#8b6b4c]" /> Active Tasks ({activeRescues.length})
                </h3>
              </div>

              <div className="divide-y divide-[#8b6b4c]/10 max-h-[40vh] overflow-y-auto">
                {activeRescues.map(rescue => (
                  <div 
                    key={rescue.id} 
                    className="p-4 hover:bg-white/35 cursor-pointer transition-colors"
                    onClick={() => setSelectedRescue(rescue)}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <span className="font-bold text-[#2f3e2c]">{rescue.id}</span>
                      <PriorityBadge priority={rescue.priority} />
                    </div>

                    <p className="text-sm font-medium text-[#4e5f4a] capitalize mb-2">
                      {rescue.problemType}
                    </p>

                    <RescueStatusBadge status={rescue.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Active Volunteers List */}
            <div
              className="rounded-3xl overflow-hidden shrink-0
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <div className="p-4 bg-white/40 border-b border-[#8b6b4c]/20 flex justify-between items-center">
                <h3 className="font-bold text-[#2f3e2c] flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#5f7d5a]" /> On-Duty Team ({activeVolunteers.length})
                </h3>
              </div>

              <div className="divide-y divide-[#8b6b4c]/10 p-2">
                {activeVolunteers.map(vol => (
                  <div
                    key={vol.id}
                    className="flex justify-between items-center p-3 rounded-2xl hover:bg-white/35 transition"
                  >
                    <div>
                      <p className="font-bold text-[#2f3e2c] text-sm">{vol.name}</p>
                      <p className="text-xs text-[#6b7d67] font-medium">{vol.activeCases} active cases</p>
                    </div>

                    <span className="w-2.5 h-2.5 rounded-full bg-[#7fa37a] shadow-[0_0_8px_rgba(127,163,122,0.6)]"></span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueMapPage;