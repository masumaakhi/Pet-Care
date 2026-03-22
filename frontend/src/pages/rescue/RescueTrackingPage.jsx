import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VolunteerInfoCard from '../../components/rescue/VolunteerInfoCard';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import { rescueRequests } from '../../data/rescueMockData';
import { formatDate } from '../../utils/rescueHelpers';
import { ChevronLeft, Info, Calendar, MapPin, Map } from 'lucide-react';

const RescueTrackingPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the ID from useParams, fallback to REQ-001 if testing without exact router setup yet
  const targetId = id || "REQ-001";

  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => {
      const found = rescueRequests.find(r => r.id === targetId);
      setRescue(found || rescueRequests[0]);
      setLoading(false);
    }, 600);
  }, [targetId]);

  if (loading) return <LoadingState message="Connecting to live dispatch..." />;
  if (!rescue) return <div>Rescue not found.</div>;

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
        {/* Top Nav/Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/rescue/my-requests"
              className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/35
              text-[#6b7d67] hover:text-[#2f3e2c] hover:bg-white/75
              shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-[#2f3e2c] flex items-center gap-3 flex-wrap">
                Request #{rescue.id}
                <RescueStatusBadge status={rescue.status} className="text-sm font-medium" />
              </h1>

              <p className="text-sm text-[#6b7d67] mt-1 flex items-center gap-4 flex-wrap">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" /> {formatDate(rescue.createdAt)}
                </span>
                <PriorityBadge priority={rescue.priority} />
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tracking & People */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Section */}
            <div
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="p-4 border-b border-[#8b6b4c]/20 flex justify-between items-center bg-white/35">
                <h3 className="font-bold text-[#2f3e2c] flex items-center">
                  <Map className="w-5 h-5 mr-2 text-[#5f7d5a]" /> Live Tracking Map
                </h3>

                {rescue.assignedVolunteer?.eta && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full animate-pulse
                    bg-white/65 text-[#8b6b4c] border border-[#8b6b4c]/25"
                  >
                    ETA: {rescue.assignedVolunteer.eta}
                  </span>
                )}
              </div>

              <RescueMapPanel 
                height="h-[400px]" 
                title="Incident Location" 
                className="border-none rounded-none"
                markers={[
                  { top: '50%', left: '50%', label: "Rescue Subject" },
                  ...(rescue.status === 'in_progress' ? [{ top: '65%', left: '40%', label: "Volunteer Approaching" }] : [])
                ]}
              />
            </div>

            {/* Timeline */}
            <div
              className="rounded-3xl p-6 sm:p-8
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="text-lg font-bold text-[#2f3e2c] mb-6">Status Timeline</h3>
              <RescueTimeline currentStatus={rescue.status} updates={rescue.updates} />
            </div>

          </div>

          {/* Right Column: Details & Assigned Personnel */}
          <div className="space-y-6">
            
            {/* Assigned Volunteer */}
            <div>
              <h3 className="text-sm font-bold text-[#6b7d67] uppercase tracking-wider mb-3 ml-1">
                Assigned Volunteer
              </h3>

              {rescue.assignedVolunteer ? (
                <VolunteerInfoCard volunteer={rescue.assignedVolunteer} />
              ) : (
                <div
                  className="rounded-3xl p-6 flex items-center justify-center text-center
                  bg-white/55 backdrop-blur-2xl
                  border border-[#8b6b4c]/45
                  shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
                >
                  <div>
                    <div
                      className="w-12 h-12 bg-white/65 rounded-full flex items-center justify-center
                      mx-auto mb-3 border border-[#8b6b4c]/20"
                    >
                      <Info className="w-6 h-6 text-[#6b7d67]" />
                    </div>
                    <p className="text-sm text-[#4e5f4a] font-medium tracking-wide">
                      Looking for nearby volunteers...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Rescue Details Summary */}
            <div
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="p-5 border-b border-[#8b6b4c]/20 flex justify-between items-center bg-white/35">
                <h3 className="font-bold text-[#2f3e2c]">Incident Details</h3>
              </div>
            
              <div className="p-5">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5 border border-[#8b6b4c]/20">
                  <img src={rescue.image} alt="Reported condition" className="w-full h-full object-cover" />
                </div>
              
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1">Issue</p>
                    <p className="text-sm font-medium text-[#2f3e2c] capitalize">
                      {rescue.problemType} condition
                    </p>
                  </div>
                
                  <div>
                    <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1">Description</p>
                    <p
                      className="text-sm text-[#4e5f4a] leading-relaxed
                      bg-white/55 p-3 rounded-2xl border border-[#8b6b4c]/25"
                    >
                      "{rescue.description}"
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> Location
                    </p>
                    <p className="text-sm font-medium text-[#2f3e2c]">{rescue.location.address}</p>
                  </div>

                  {rescue.assignedClinic && (
                    <div className="pt-4 border-t border-[#8b6b4c]/15">
                      <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1">
                        Destination Clinic
                      </p>
                      <p
                        className="text-sm font-bold text-[#2f3e2c]
                        bg-white/55 px-3 py-2 rounded-xl border border-[#8b6b4c]/25"
                      >
                        {rescue.assignedClinic}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueTrackingPage;