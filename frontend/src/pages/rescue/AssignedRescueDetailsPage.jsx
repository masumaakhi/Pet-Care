import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import api from '../../utils/api';
import { ChevronLeft, Camera, Navigation, CheckCircle, Navigation2, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AssignedRescueDetailsPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState('');
  const [locationWatchId, setLocationWatchId] = useState(null);
  const [me, setMe] = useState(null);
  const watchRef = useRef(null);

  useEffect(() => {
    fetchRescue();
    api
      .get('/auth/me')
      .then((r) => {
        if (r.data.success) setMe(r.data.data);
      })
      .catch(() => {});
    return () => {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
  }, [id]);

  const fetchRescue = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getRescueDetails(id);
      if (res.data.success) setRescue(res.data.data);
    } catch (error) {
      toast.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await rescueService.acceptRescue(id);
      if (res.data.success) {
        setRescue(res.data.data);
        toast.success('Mission accepted — you are en route');
        startBroadcastingLocation();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not accept mission');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await rescueService.updateMissionStatus(id, newStatus, currentNote);
      if (res.data.success) {
        setRescue(res.data.data);
        toast.success(`Position marked: ${newStatus.replace(/_/g, ' ')}`);
        if (newStatus === 'IN_PROGRESS') startBroadcastingLocation();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const startBroadcastingLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    if (watchRef.current != null) return;
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await rescueService.updateVolunteerLiveLocation(id, { lat: latitude, lng: longitude });
        } catch (_) {}
      },
      null,
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    watchRef.current = watchId;
    setLocationWatchId(watchId);
    toast.success('Live location broadcasting started');
  };

  if (loading) return <LoadingState />;
  if (!rescue) return <div className="min-h-screen pt-40 text-center">Rescue task not found.</div>;

  const incidentLat = rescue.incidentLat || rescue.latitude;
  const incidentLng = rescue.incidentLng || rescue.longitude;

  const apiBaseURL = api.defaults.baseURL.replace('/api', '');
  const getPhotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = apiBaseURL.endsWith('/') ? apiBaseURL.slice(0, -1) : apiBaseURL;
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  const photoSrc = getPhotoUrl(rescue.photoUrl);

  const canAccept =
    me?.id &&
    rescue.assignedVolunteerId === me.id &&
    rescue.status === 'ASSIGNED';

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <Link to="/rescue/nearby" className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/35 text-[#6b7d67] hover:text-[#2f3e2c] transition shadow-md">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#2f3e2c]">Task #{rescue.id.split('-')[0]}</h1>
                <RescueStatusBadge status={rescue.status} />
                <PriorityBadge priority={rescue.priority} />
              </div>
              <p className="text-sm text-[#6b7d67] mt-1">Dispatched: {new Date(rescue.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {canAccept && (
              <button
                type="button"
                onClick={handleAccept}
                className="flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm border bg-[#2f3e2c] text-white border-[#2f3e2c] hover:bg-[#1a251a]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept mission
              </button>
            )}
            <button
              type="button"
              onClick={startBroadcastingLocation}
              disabled={!!locationWatchId}
              className={`flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm border ${
                locationWatchId
                  ? 'bg-[#5f7d5a]/20 border-[#5f7d5a]/40 text-[#5f7d5a] cursor-default'
                  : 'bg-white/55 border-[#8b6b4c]/40 text-[#2f3e2c] hover:bg-white/70'
              }`}
            >
              <Navigation2 className="w-4 h-4 mr-2" />
              {locationWatchId ? 'Broadcasting Location' : 'Start Location Broadcast'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Control - Status Updates */}
            <div className="rounded-3xl overflow-hidden bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-xl">
              <div className="bg-white/40 border-b border-[#8b6b4c]/20 p-4">
                <h3 className="font-bold text-[#2f3e2c] mb-1">Mission Control</h3>
                <p className="text-xs text-[#6b7d67]">Update your progress as you move through the rescue stages.</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/35 p-2 rounded-2xl border border-[#8b6b4c]/15">
                  {[
                    { id: 'IN_PROGRESS', icon: Navigation2, label: 'En Route' },
                    { id: 'PICKED', icon: Navigation, label: 'Picked Up' },
                    { id: 'VET', icon: CheckCircle, label: 'At Vet' },
                    { id: 'RESCUED', icon: CheckCircle, label: 'Rescued' },
                  ].map(step => (
                    <button
                      key={step.id}
                      onClick={() => handleUpdateStatus(step.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        rescue.status === step.id
                          ? 'bg-white/80 border-[#5f7d5a] text-[#5f7d5a] shadow-sm'
                          : 'border-transparent text-[#6b7d67] hover:bg-white/60'
                      }`}
                    >
                      <step.icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold text-center">{step.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#8b6b4c]/15 space-y-4">
                  <label className="block text-sm font-semibold text-[#2f3e2c]">Case Log & Observations</label>
                  <textarea
                    rows={2}
                    className="w-full rounded-2xl px-4 py-3 bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 text-[#2f3e2c] placeholder-[#6b7d67] focus:ring-2 focus:ring-[#7fa37a]/30 outline-none"
                    placeholder="Describe condition upon arrival..."
                    value={currentNote}
                    onChange={e => setCurrentNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-xl">
              <RescueMapPanel
                height="h-[350px]"
                title="Navigation Radar"
                center={incidentLat ? [incidentLat, incidentLng] : null}
                markers={incidentLat ? [{ lat: incidentLat, lng: incidentLng, label: "Extraction Point", type: 'rescue' }] : []}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Incident Intelligence */}
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-xl">
              <div className="p-5 border-b border-[#8b6b4c]/20 flex justify-between items-center bg-white/35 font-bold text-[#2f3e2c]">Incident Intelligence</div>
              <div className="p-5 space-y-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-white/40 flex items-center justify-center border border-[#8b6b4c]/20">
                    {photoSrc ? <img src={photoSrc} alt="Subject" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-[#6b7d67]" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2f3e2c] capitalize leading-tight">{rescue.problemType}</h4>
                    <p className="text-sm font-medium text-[#6b7d67] mt-1">Ref: {rescue.id.split('-')[0]}</p>
                  </div>
                </div>
                <div className="bg-white/55 p-3 rounded-2xl border border-[#8b6b4c]/25">
                  <p className="text-xs font-bold text-[#6b7d67] uppercase mb-1 flex items-center"><MessageSquare className="w-3.5 h-3.5 mr-1" /> Field Note</p>
                  <p className="text-sm text-[#4e5f4a]">"{rescue.description}"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1">Pick-up Address</p>
                  <p className="font-bold text-[#2f3e2c] text-sm">{rescue.incidentAddress || rescue.address}</p>
                </div>
                {rescue.locationNote && (
                  <div className="bg-[#5f7d5a]/10 p-3 rounded-2xl border border-[#5f7d5a]/20">
                    <p className="text-xs font-bold text-[#5f7d5a] uppercase mb-1">Location Note</p>
                    <p className="text-sm text-[#4e5f4a]">{rescue.locationNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Contact */}
            <div className="rounded-3xl p-5 bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-lg flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#2f3e2c] mb-1 text-sm uppercase tracking-wider">Reporter Contact</h3>
                <p className="font-bold text-[#2f3e2c]">{rescue.reporter?.fullName || 'Anonymous'}</p>
              </div>
              {rescue.reporter?.phone && (
                <a href={`tel:${rescue.reporter.phone}`} className="w-10 h-10 rounded-full bg-white/65 text-[#5f7d5a] border border-[#8b6b4c]/25 flex items-center justify-center hover:bg-white/80 transition-shadow">
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedRescueDetailsPage;