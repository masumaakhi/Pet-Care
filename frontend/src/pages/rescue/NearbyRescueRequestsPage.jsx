import React, { useState } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueCard from '../../components/rescue/RescueCard';
import RescueFilters from '../../components/rescue/RescueFilters';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import EmptyState from '../../components/rescue/EmptyState';
import { rescueRequests } from '../../data/rescueMockData';
import { Power, MapPin } from 'lucide-react';

const NearbyRescueRequestsPage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'nearby', priority: '', problemType: '' });

  // Filter unassigned requests or requests assigned to me
  // We'll pretend VOL-001 (Sarah) is logged in for the demo
  const volunteerId = "VOL-001";
  
  const relevantRequests = rescueRequests.filter(req => {
    // Show pending requests (nobody assigned) OR requests assigned to me
    return req.status === 'pending' || req.assignedVolunteer?.id === volunteerId;
  });

  const displayRequests = relevantRequests.filter(req => {
    if (filters.status === 'my_cases' && req.assignedVolunteer?.id !== volunteerId) return false;
    if (filters.status === 'urgent' && !['critical', 'high'].includes(req.priority)) return false;
    if (filters.priority && req.priority !== filters.priority) return false;
    if (filters.problemType && req.problemType !== filters.problemType) return false;
    
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!req.description.toLowerCase().includes(s) && !req.problemType.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const stats = {
    activeNearby: rescueRequests.filter(r => r.status === 'pending').length,
    criticalNearby: rescueRequests.filter(r => r.status === 'pending' && r.priority === 'critical').length,
    myActive: rescueRequests.filter(r => ['in_progress', 'picked', 'vet'].includes(r.status) && r.assignedVolunteer?.id === volunteerId).length,
  };

  const mapMarkers = relevantRequests.map(r => ({
    top: `${40 + Math.random() * 40}%`, 
    left: `${40 + Math.random() * 40}%`,
    label: r.problemType + " - " + r.location.distance
  }));

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
          title="Volunteer Dispatch Dashboard" 
          description="View and accept nearby emergency rescue requests."
          actions={
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all border ${
                isOnline
                  ? 'bg-white/65 text-[#5f7d5a] border-[#8b6b4c]/30 hover:bg-white/80'
                  : 'bg-white/55 text-[#6b7d67] border-[#8b6b4c]/30 hover:bg-white/70'
              }`}
            >
              <Power className="w-4 h-4 mr-2" />
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          }
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Nearby Active Calls" value={stats.activeNearby} color="blue" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Critical Needs" value={stats.criticalNearby} color="red" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="My Active Cases" value={stats.myActive} color="orange" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="p-4 rounded-3xl
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <RescueFilters 
                filters={filters} 
                setFilters={setFilters} 
                searchPlaceholder="Search problem, keyword..."
                tabs={[
                  { id: 'nearby', label: 'Nearby Alerts' },
                  { id: 'urgent', label: 'Urgent/Critical' },
                  { id: 'my_cases', label: 'My Cases' }
                ]}
              />
            </div>

            {!isOnline ? (
              <div
                className="rounded-3xl p-12 text-center relative overflow-hidden
                bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20
                backdrop-blur-2xl border border-[#8b6b4c]/45
                shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
              >
                <div className="absolute inset-0 bg-white/20 z-0"></div>
                <div className="relative z-10">
                  <Power className="w-16 h-16 text-[#6b7d67] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#2f3e2c] mb-2">
                    You are currently Offline
                  </h3>
                  <p className="text-[#6b7d67] mb-6">
                    Go online to receive and accept new rescue requests in your area.
                  </p>
                  <button 
                    onClick={() => setIsOnline(true)}
                    className="px-6 py-3 rounded-xl
                    bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                    border border-[#d6e2d3]
                    text-black/75 font-semibold
                    hover:scale-[1.02] hover:shadow-lg transition duration-300"
                  >
                    Go Online Now
                  </button>
                </div>
              </div>
            ) : displayRequests.length > 0 ? (
              <div className="space-y-4">
                {displayRequests.map(rescue => (
                  <RescueCard 
                    key={rescue.id} 
                    rescue={rescue} 
                    linkTo={`/rescue/assigned/${rescue.id}`}
                    actionButton={
                      rescue.assignedVolunteer?.id === volunteerId ? (
                        <button
                          className="px-4 py-2 rounded-xl text-sm font-semibold
                          bg-white/65 text-[#5f7d5a] border border-[#8b6b4c]/30
                          pointer-events-none"
                        >
                          Active Case
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 rounded-xl text-sm font-semibold
                          bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                          border border-[#d6e2d3]
                          text-black/75 shadow-sm transition duration-300
                          cursor-pointer pointer-events-auto z-10 relative"
                        >
                          Accept Rescue
                        </button>
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No Rescues Found" message="There are no rescues matching your filters right now." />
            )}
          </div>

          {/* Right Column: Map Sidebar */}
          <div className="lg:block hidden h-[calc(100vh-160px)] sticky top-24">
            <RescueMapPanel 
              height="h-full" 
              title="Live Radar" 
              className="shadow-[0_25px_80px_rgba(0,0,0,0.12)] rounded-3xl overflow-hidden"
              markers={mapMarkers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyRescueRequestsPage;