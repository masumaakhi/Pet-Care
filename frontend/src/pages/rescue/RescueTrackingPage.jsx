import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VolunteerInfoCard from '../../components/rescue/VolunteerInfoCard';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import { resolveApiMediaUrl } from '../../utils/helpers';
import { formatDate } from '../../utils/rescueHelpers';
import { ChevronLeft, Calendar, MapPin, Navigation, Shield, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

const RescueTrackingPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const [detailRes, trackRes] = await Promise.all([
          rescueService.getRescueDetails(id),
          rescueService.getRescueTracking(id),
        ]);
        if (cancelled) return;
        if (detailRes.data.success) setRescue(detailRes.data.data);
        else setLoadError(detailRes.data.message || 'Could not load rescue');
        if (trackRes.data.success) setTracking(trackRes.data.data);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.response?.data?.message || error.message || 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    socket.emit('join:rescue', id);

    const onStatus = (payload) => {
      const rid = payload.rescueId;
      if (rid && rid !== id) return;
      setRescue((prev) => (prev ? { ...prev, status: payload.status } : prev));
    };

    const onLocation = (payload) => {
      const rid = payload.rescueId;
      if (rid && rid !== id) return;
      setTracking((prev) =>
        prev
          ? {
              ...prev,
              volunteer: prev.volunteer
                ? {
                    ...prev.volunteer,
                    location: { lat: payload.lat, lng: payload.lng },
                  }
                : prev.volunteer,
            }
          : prev
      );
    };

    const onEta = (payload) => {
      const rid = payload.rescueId;
      if (rid && rid !== id) return;
      setTracking((prev) =>
        prev ? { ...prev, eta: payload.etaMinutes ?? payload.eta ?? prev.eta } : prev
      );
    };

    socket.on('rescue:status-updated', onStatus);
    socket.on('rescue:location-updated', onLocation);
    socket.on('rescue:eta-updated', onEta);

    return () => {
      socket.off('rescue:status-updated', onStatus);
      socket.off('rescue:location-updated', onLocation);
      socket.off('rescue:eta-updated', onEta);
    };
  }, [socket, id]);

  if (loading) return <LoadingState message="Connecting to live dispatch..." />;

  if (loadError && !rescue) return (
    <div className="min-h-screen flex items-center justify-center pt-[8rem] px-4">
      <div className="text-center bg-white/55 backdrop-blur-2xl p-10 rounded-3xl border border-[#8b6b4c]/30 shadow-2xl max-w-md w-full">
        <h2 className="text-xl font-bold text-[#2f3e2c] mb-2">Unable to load tracking</h2>
        <p className="text-[#6b7d67] mb-6 text-sm">{loadError}</p>
        <Link to="/rescue/my-requests" className="inline-block px-8 py-3 rounded-xl bg-[#2f3e2c] text-white font-semibold">Back to My Requests</Link>
      </div>
    </div>
  );

  if (!rescue) return (
    <div className="min-h-screen flex items-center justify-center pt-[8rem] px-4">
       <div className="text-center bg-white/55 backdrop-blur-2xl p-10 rounded-3xl border border-[#8b6b4c]/30 shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#2f3e2c] mb-2">Rescue Mission Not Found</h2>
          <p className="text-[#6b7d67] mb-8 text-sm">We couldn't locate mission #{id}.</p>
          <Link to="/rescue/my-requests" className="inline-block px-8 py-3 rounded-xl bg-[#2f3e2c] text-white font-semibold hover:bg-[#1a251a] transition shadow-lg">Back to My Requests</Link>
       </div>
    </div>
  );

  const incidentLat = rescue.incidentLat || rescue.latitude;
  const incidentLng = rescue.incidentLng || rescue.longitude;
  const volunteerLat = tracking?.volunteer?.location?.lat;
  const volunteerLng = tracking?.volunteer?.location?.lng;

  const mapMarkers = [
    ...(incidentLat ? [{
      lat: incidentLat,
      lng: incidentLng,
      label: "Rescue Incident Spot",
      type: 'rescue',
      isMain: true
    }] : []),
    ...(volunteerLat ? [{
      lat: volunteerLat,
      lng: volunteerLng,
      label: `Rescue Team: ${tracking.volunteer?.fullName}`,
      type: 'volunteer'
    }] : [])
  ];

  const getMapCenter = () => {
    if (incidentLat && volunteerLat) {
      return [(incidentLat + volunteerLat) / 2, (incidentLng + volunteerLng) / 2];
    }
    return incidentLat ? [incidentLat, incidentLng] : [23.8103, 90.4125];
  };

  const getPhotoUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600";
    return resolveApiMediaUrl(path);
  };

  return (
    <div className="min-h-screen pt-[6.5rem] pb-[5rem] px-4 md:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#7fa37a]/15 via-[#5f7d5a]/10 to-[#8b6b4c]/10 rounded-full blur-[150px] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/rescue/my-requests" className="p-3 rounded-2xl bg-white/70 border border-[#8b6b4c]/30 text-[#6b7d67] hover:text-[#2f3e2c] shadow-sm transition hover:scale-110">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#2f3e2c]">Mission #{rescue.id.toString().slice(0, 8).toUpperCase()}</h1>
                <RescueStatusBadge status={rescue.status} />
              </div>
              <p className="text-sm text-[#6b7d67] mt-1 flex items-center gap-4 font-medium uppercase tracking-wider">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-[#5f7d5a]" /> {formatDate(rescue.createdAt)}</span>
                <PriorityBadge priority={rescue.priority} />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#5f7d5a]/10 border border-[#5f7d5a]/30 rounded-full text-[#5f7d5a] text-[10px] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#5f7d5a] animate-ping" />
            Live Dispatch Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map + Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden bg-white/60 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-xl p-2">
              <div className="p-4 flex justify-between items-center border-b border-[#8b6b4c]/10">
                <h3 className="text-sm font-bold text-[#2f3e2c] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#5f7d5a]" /> Live Radar
                </h3>
                {tracking?.eta && (
                  <div className="text-xs font-bold text-[#5f7d5a] bg-[#5f7d5a]/10 px-3 py-1 rounded-full">
                    ETA: ~{tracking.eta} mins
                  </div>
                )}
              </div>
              <div className="rounded-2xl overflow-hidden">
                <RescueMapPanel
                  height="h-[450px]"
                  title="Rescue Location"
                  className="border-none rounded-none shadow-none"
                  markers={mapMarkers}
                  center={getMapCenter()}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl p-8 bg-white/60 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-lg">
              <h3 className="text-lg font-bold text-[#2f3e2c] mb-8 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#8b6b4c]" /> Rescue Timeline
              </h3>
              <RescueTimeline currentStatus={rescue.status} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl overflow-hidden bg-white/60 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-xl">
              <div className="relative aspect-video">
                <img
                  src={getPhotoUrl(rescue.photoUrl)}
                  alt="Incident"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                  <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Incident Photo Evidence</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#8b6b4c]/5 p-3 rounded-xl border border-[#8b6b4c]/10">
                  <p className="text-sm font-medium text-[#4e5f4a] italic leading-relaxed">"{rescue.description}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#6b7d67] uppercase mb-1">Incident Type</p>
                    <p className="text-sm font-bold text-[#2f3e2c] capitalize">{rescue.problemType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6b7d67] uppercase mb-1">Status</p>
                    <p className="text-sm font-bold text-[#2f3e2c]">{rescue.status?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-[#8b6b4c]/10">
                  <div className="mt-1 p-1.5 rounded-lg bg-[#5f7d5a]/10 text-[#5f7d5a]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6b7d67] uppercase mb-1">Extraction Address</p>
                    <p className="text-sm font-semibold text-[#4e5f4a] leading-tight">{rescue.incidentAddress || rescue.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Volunteer Info */}
            <div>
              <h3 className="text-xs font-bold text-[#6b7d67] uppercase mb-3 ml-1 tracking-widest">Dispatched Team</h3>
              {tracking?.volunteer ? (
                <VolunteerInfoCard volunteer={tracking.volunteer} eta={tracking.eta} />
              ) : rescue.assignedVolunteer ? (
                <VolunteerInfoCard volunteer={rescue.assignedVolunteer} />
              ) : (
                <div className="rounded-2xl p-6 text-center bg-white/60 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-md">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <div className="w-2 h-2 bg-[#8b6b4c] rounded-full animate-ping" />
                  </div>
                  <p className="text-xs font-bold text-[#4e5f4a] uppercase tracking-wider">Assigning Personnel...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueTrackingPage;