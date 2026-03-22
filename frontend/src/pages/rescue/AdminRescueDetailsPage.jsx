import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import VolunteerInfoCard from '../../components/rescue/VolunteerInfoCard';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import { rescueRequests, volunteers } from '../../data/rescueMockData';
import { formatDate } from '../../utils/rescueHelpers';
import { ChevronLeft, MapPin, AlertTriangle, ShieldCheck, User, Stethoscope } from 'lucide-react';

const AdminRescueDetailsPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const targetId = id || "REQ-002"; // Fallback to Req 002 (Pending, Unassigned)

  useEffect(() => {
    setTimeout(() => {
      const found = rescueRequests.find(r => r.id === targetId);
      setRescue(found || rescueRequests[1]);
      setLoading(false);
    }, 400);
  }, [targetId]);

  if (loading) return <LoadingState />;
  if (!rescue) return <div>Data not found</div>;

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
        {/* Header */}
        <div className="mb-6 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/rescues"
              className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/35
              text-[#6b7d67] hover:text-[#2f3e2c] hover:bg-white/75
              shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#2f3e2c]">
                  Rescue Profile #{rescue.id}
                </h1>
                <RescueStatusBadge status={rescue.status} />
                <PriorityBadge priority={rescue.priority} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl
              bg-white/55 border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold
              hover:bg-white/70 hover:shadow-md transition"
            >
              Cancel Request
            </button>

            <button
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              border border-[#d6e2d3]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Middle Column (Detail Focus) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Info Card */}
            <div
              className="rounded-3xl overflow-hidden flex flex-col sm:flex-row
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="sm:w-2/5 h-64 sm:h-auto shrink-0 bg-white/30 flex items-center justify-center p-4">
                <img
                  src={rescue.image}
                  alt="Rescue Condition"
                  className="w-full h-full object-cover rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="mb-2">
                  <p className="text-xs font-bold text-[#6b7d67] tracking-wider uppercase">
                    Problem Type
                  </p>
                  <h2 className="text-2xl font-bold text-[#2f3e2c] capitalize">
                    {rescue.problemType} condition
                  </h2>
                </div>
                 
                <div
                  className="bg-white/55 border border-[#8b6b4c]/25 p-4 rounded-2xl mt-4 mb-4
                  backdrop-blur-md"
                >
                  <p className="text-sm text-[#4e5f4a] italic font-medium leading-relaxed">
                    "{rescue.description}"
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#4e5f4a]">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-[#6b7d67]" />
                    <span className="font-semibold text-[#2f3e2c] truncate">
                      {rescue.location.address}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-[#8b6b4c]" />
                    <span>Reported: {formatDate(rescue.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Tracking */}
            <div
              className="rounded-3xl p-6 sm:p-8
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="text-lg font-bold text-[#2f3e2c] mb-6">
                Master Dispatch Timeline
              </h3>
              <RescueTimeline currentStatus={rescue.status} updates={rescue.updates} />
            </div>

            <div
              className="rounded-3xl p-1
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <RescueMapPanel height="h-80" className="rounded-[1.3rem] border-none" title="Location Context" />
            </div>
          </div>

          {/* Right Sidebar (Admin Logs & Controls) */}
          <div className="space-y-6">
            
            {/* Reporter block */}
            <div
              className="rounded-3xl p-5
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="flex items-center text-sm font-bold text-[#2f3e2c] mb-4 uppercase tracking-wider">
                <User className="w-4 h-4 mr-2 text-[#5f7d5a]" /> Original Reporter
              </h3>

              <div className="bg-white/55 rounded-2xl p-3 border border-[#8b6b4c]/25">
                <p className="font-bold text-[#2f3e2c]">{rescue.requester.name}</p>
                <p className="text-sm text-[#6b7d67] mt-1">{rescue.requester.phone}</p>
                <span
                  className="inline-block mt-2 text-xs font-bold
                  bg-white/65 text-[#2f3e2c] px-2.5 py-1 rounded-full capitalize
                  border border-[#8b6b4c]/30"
                >
                  {rescue.requester.type} Account
                </span>
              </div>
            </div>

            {/* Assignment block */}
            <div
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div
                className="p-4 bg-white/45 border-b border-[#8b6b4c]/20
                flex justify-between items-center"
              >
                <h3 className="flex items-center text-sm font-bold text-[#2f3e2c] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 mr-2 text-[#7fa37a]" /> Assigned Volunteer
                </h3>

                {!rescue.assignedVolunteer && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b6b4c] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8b6b4c]"></span>
                  </span>
                )}
              </div>
            
              <div className="p-4">
                {rescue.assignedVolunteer ? (
                  <>
                    <VolunteerInfoCard volunteer={rescue.assignedVolunteer} minimal />
                    <button
                      className="w-full mt-3 py-2.5 rounded-xl
                      bg-white/55 border border-[#8b6b4c]/40
                      text-[#2f3e2c] font-semibold text-sm
                      hover:bg-white/70 hover:shadow-md transition"
                    >
                      Reassign Volunteer
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="w-8 h-8 text-[#8b6b4c] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#2f3e2c] mb-1">Needs Assignment</p>
                    <p className="text-xs text-[#6b7d67] mb-4 px-4">
                      This profile is waiting for a volunteer to accept.
                    </p>
                        
                    <div className="text-left mb-2 text-xs font-bold text-[#6b7d67] uppercase">
                      Manual Override
                    </div>

                    <select
                      className="w-full text-sm rounded-xl
                      border border-[#8b6b4c]/35 bg-white/55 backdrop-blur-xl
                      text-[#2f3e2c] mb-3 px-3 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]"
                    >
                      <option value="">Select Volunteer to Force-Assign</option>
                      {volunteers.map(v => <option key={v.id} value={v.id}>{v.name} ({v.status})</option>)}
                    </select>

                    <button
                      className="w-full py-2.5 rounded-xl
                      bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                      border border-[#d6e2d3]
                      text-black/75 font-semibold text-sm
                      hover:scale-[1.01] hover:shadow-lg transition duration-300"
                    >
                      Assign Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clinic Block */}
            {rescue.assignedClinic && (
              <div
                className="rounded-3xl p-5
                bg-white/55 backdrop-blur-2xl
                border border-[#8b6b4c]/45
                shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
              >
                <h3 className="flex items-center text-sm font-bold text-[#2f3e2c] mb-4 uppercase tracking-wider">
                  <Stethoscope className="w-4 h-4 mr-2 text-[#8b6b4c]" /> Destination Vet/Clinic
                </h3>

                <div className="bg-white/55 border border-[#8b6b4c]/25 rounded-2xl p-3">
                  <p className="font-bold text-[#2f3e2c]">{rescue.assignedClinic}</p>
                  <button className="mt-3 text-sm text-[#8b6b4c] font-semibold hover:underline">
                    Change Destination
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueDetailsPage;