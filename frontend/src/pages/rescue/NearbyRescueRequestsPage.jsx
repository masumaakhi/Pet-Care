import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueCard from '../../components/rescue/RescueCard';
import RescueFilters from '../../components/rescue/RescueFilters';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import EmptyState from '../../components/rescue/EmptyState';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Power } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const NearbyRescueRequestsPage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'nearby', priority: '', problemType: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchRescues();
    fetchProfile();
  }, []);

  // Real-time: new rescue assignments via socket
  useEffect(() => {
    if (!socket) return;
    socket.on('rescue:new', () => fetchRescues());
    return () => socket.off('rescue:new');
  }, [socket]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) setCurrentUser(res.data.data);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
    }
  };

  const fetchRescues = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getNearbyRescues();
      if (res.data.success) {
        setRescues(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load rescues");
    } finally {
      setLoading(false);
    }
  };

  const updateMyLocation = async () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await api.put('/auth/profile', { latitude, longitude });
        if (res.data.success) {
          setCurrentUser(res.data.data);
          toast.success("Location updated on radar");
          setIsOnline(true);
        }
      } catch (error) {
        toast.error("Failed to update location");
      }
    });
  };

  const displayRequests = rescues.filter((req) => {
    const tab = filters.status || 'nearby';
    if (tab === 'urgent') {
      if (String(req.priority).toUpperCase() !== 'CRITICAL') return false;
    } else if (tab === 'my_cases') {
      if (req.assignedVolunteerId !== currentUser?.id) return false;
      if (!['ASSIGNED', 'IN_PROGRESS', 'PICKED', 'VET'].includes(req.status)) return false;
    } else if (tab === 'nearby') {
      if (req.assignedVolunteerId === currentUser?.id) return true;
      if (req.status !== 'PENDING') return false;
    }

    if (filters.priority && req.priority?.toLowerCase() !== filters.priority.toLowerCase()) return false;
    if (filters.problemType && req.problemType?.toLowerCase() !== filters.problemType.toLowerCase()) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!req.description?.toLowerCase().includes(s) && !req.problemType?.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const stats = {
    activeNearby: rescues.filter((r) => r.status === 'PENDING').length,
    criticalNearby: rescues.filter(
      (r) => r.status === 'PENDING' && r.priority?.toUpperCase() === 'CRITICAL'
    ).length,
    myActive: rescues.filter(
      (r) =>
        ['ASSIGNED', 'IN_PROGRESS', 'PICKED', 'VET'].includes(r.status) &&
        r.assignedVolunteerId === currentUser?.id
    ).length,
  };

  const mapMarkers = [
    ...displayRequests.filter(r => r.incidentLat).map(r => ({
      lat: r.incidentLat,
      lng: r.incidentLng,
      label: `${r.problemType} (${r.priority})`,
      description: r.incidentAddress,
      type: 'rescue'
    })),
    ...(currentUser?.latitude ? [{
      lat: currentUser.latitude,
      lng: currentUser.longitude,
      label: "You (Online)",
      type: 'volunteer',
      isMain: true
    }] : [])
  ];

  if (loading) return <LoadingState message="Loading nearby missions..." />;

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          title="Volunteer Dispatch Dashboard"
          description="View and accept nearby emergency rescue requests."
          actions={
            <button
              onClick={updateMyLocation}
              className={`flex items-center px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all border ${
                isOnline ? 'bg-white/65 text-[#5f7d5a] border-[#8b6b4c]/30' : 'bg-white/55 text-[#6b7d67] border-[#8b6b4c]/30'
              }`}
            >
              <Power className="w-4 h-4 mr-2" />
              {isOnline ? 'Update My Radar' : 'Go Online'}
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <KPIStatCard title="Nearby Active Calls" value={stats.activeNearby} color="blue" />
          <KPIStatCard title="Critical Needs" value={stats.criticalNearby} color="red" />
          <KPIStatCard title="My Active Cases" value={stats.myActive} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 rounded-3xl bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]">
              <RescueFilters
                filters={filters}
                setFilters={setFilters}
                tabs={[
                  { id: 'nearby', label: 'Nearby Alerts' },
                  { id: 'urgent', label: 'Urgent/Critical' },
                  { id: 'my_cases', label: 'My Cases' }
                ]}
              />
            </div>

            {displayRequests.length > 0 ? (
              <div className="space-y-4">
                {displayRequests.map(rescue => (
                  <RescueCard
                    key={rescue.id}
                    rescue={rescue}
                    linkTo={`/rescue/assigned/${rescue.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No Rescues Found" message="Check back later for new alerts." />
            )}
          </div>

          <div className="lg:block hidden h-[calc(100vh-160px)] sticky top-24">
            <RescueMapPanel
              height="h-full"
              title="Live Radar"
              markers={mapMarkers}
              center={currentUser?.latitude ? [currentUser.latitude, currentUser.longitude] : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyRescueRequestsPage;