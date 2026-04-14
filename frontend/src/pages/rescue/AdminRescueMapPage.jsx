import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import { Layers, RefreshCw, Crosshair, Users } from 'lucide-react';
import rescueService from '../../utils/rescueService';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminRescueMapPage = () => {
  const [rescues, setRescues] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRescue, setSelectedRescue] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  // Real-time auto-refresh
  useEffect(() => {
    if (!socket) return;
    socket.emit('join:admin');
    const refresh = () => fetchData();
    socket.on('rescue:new', refresh);
    socket.on('rescue:status-updated', refresh);
    socket.on('rescue:location-updated', refresh);
    return () => {
      socket.off('rescue:new', refresh);
      socket.off('rescue:status-updated', refresh);
      socket.off('rescue:location-updated', refresh);
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getMapData();
      if (res.data.success) {
        setRescues(res.data.data.rescues || []);
        setVolunteers(res.data.data.volunteers || []);
      }
    } catch (error) {
      toast.error("Failed to sync mission data");
    } finally {
      setLoading(false);
    }
  };

  const activeRescues = rescues.filter(r => ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status));

  const mapMarkers = [
    ...rescues.filter(r => r.incidentLat).map(r => ({
      lat: r.incidentLat,
      lng: r.incidentLng,
      label: `Task: ${r.id.split('-')[0]} (${r.status})`,
      description: r.problemType,
      type: 'rescue',
      data: r
    })),
    ...volunteers.filter(v => v.lastLat).map(v => ({
      lat: v.lastLat,
      lng: v.lastLng,
      label: `Vol: ${v.user?.fullName}`,
      type: 'volunteer',
      data: v
    }))
  ];

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader 
          title="Live Dispatch Radar" 
          description="Monitor active rescues and volunteer positions in real-time."
          actions={
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2.5 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold text-sm hover:bg-white/70 transition">
                <Layers className="w-4 h-4 mr-2" /> Layers
              </button>
              <button 
                onClick={fetchData}
                className="flex items-center px-4 py-2.5 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold text-sm hover:bg-white/70 transition"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync
              </button>
            </div>
          }
        />

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] min-h-[600px] mt-4">
          <div className="flex-1 rounded-3xl overflow-hidden relative border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
            <RescueMapPanel 
              height="h-full" 
              title="City Overview" 
              markers={mapMarkers} 
              className="border-none rounded-none" 
              center={rescues[0]?.incidentLat ? [rescues[0].incidentLat, rescues[0].incidentLng] : [23.8103, 90.4125]}
            />
            
            <div className="absolute bottom-6 left-6 bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#8b6b4c]/25 z-[1000]">
              <h4 className="text-xs font-bold text-[#6b7d67] uppercase tracking-wider mb-3">Map Legend</h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                  <span className="w-3 h-3 rounded-full bg-[#8b6b4c] mr-3" /> Rescue Spot
                </div>
                <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                  <span className="w-3 h-3 rounded-full bg-[#5f7d5a] mr-3" /> Volunteer Pos
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
            <div className="rounded-3xl overflow-hidden bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]">
              <div className="p-4 bg-white/40 border-b border-[#8b6b4c]/20">
                <h3 className="font-bold text-[#2f3e2c] flex items-center">
                  <Crosshair className="w-5 h-5 mr-2 text-[#8b6b4c]" /> Active Tasks ({activeRescues.length})
                </h3>
              </div>
              <div className="divide-y divide-[#8b6b4c]/10 max-h-[35vh] overflow-y-auto">
                {activeRescues.map(rescue => (
                  <div key={rescue.id} className="p-4 hover:bg-white/35 cursor-pointer transition-colors" onClick={() => setSelectedRescue(rescue)}>
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <span className="font-bold text-[#2f3e2c]">{rescue.id.split('-')[0]}</span>
                      <PriorityBadge priority={rescue.priority} />
                    </div>
                    <p className="text-sm font-medium text-[#4e5f4a] capitalize mb-2">{rescue.problemType}</p>
                    <RescueStatusBadge status={rescue.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]">
              <div className="p-4 bg-white/40 border-b border-[#8b6b4c]/20">
                <h3 className="font-bold text-[#2f3e2c] flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#5f7d5a]" /> On-Duty Team ({volunteers.length})
                </h3>
              </div>
              <div className="divide-y divide-[#8b6b4c]/10 p-2">
                {volunteers.map(vol => (
                  <div key={vol.userId} className="flex justify-between items-center p-3 rounded-2xl hover:bg-white/35 transition">
                    <div>
                      <p className="font-bold text-[#2f3e2c] text-sm">{vol.user?.fullName}</p>
                      <p className="text-xs text-[#6b7d67] font-medium">Online & Active</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7fa37a] shadow-[0_0_8px_rgba(127,163,122,0.6)]" />
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