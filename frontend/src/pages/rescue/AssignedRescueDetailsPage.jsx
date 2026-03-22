import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import { rescueRequests } from '../../data/rescueMockData';
import { ChevronLeft, Info, Phone, Camera, Navigation, MessageSquare, CheckCircle, Navigation2 } from 'lucide-react';

const AssignedRescueDetailsPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState('');

  // Fallback map
  const targetId = id || "REQ-003";

  useEffect(() => {
    setTimeout(() => {
      const found = rescueRequests.find(r => r.id === targetId);
      setRescue(found || rescueRequests[2]); // fall back to req 003 which is in progress
      setLoading(false);
    }, 500);
  }, [targetId]);

  if (loading) return <LoadingState />;
  if (!rescue) return <div>Rescue not found.</div>;

  const handleUpdateStatus = (newStatus) => {
    // In real app, call API
    setRescue({ ...rescue, status: newStatus });
  };

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
              to="/rescue/nearby"
              className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/35
              text-[#6b7d67] hover:text-[#2f3e2c] hover:bg-white/75
              shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#2f3e2c]">Task #{rescue.id}</h1>
                <RescueStatusBadge status={rescue.status} />
                <PriorityBadge priority={rescue.priority} />
              </div>
              <p className="text-sm text-[#6b7d67] mt-1">
                Dispatched: {new Date(rescue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center px-4 py-2.5 rounded-xl
              bg-white/55 border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold text-sm
              hover:bg-white/70 hover:shadow-md transition"
            >
              <Navigation2 className="w-4 h-4 mr-2" /> Open Maps
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Action Control Panel */}
            <div
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="bg-white/40 border-b border-[#8b6b4c]/20 p-4">
                <h3 className="font-bold text-[#2f3e2c] mb-1">Operational Actions</h3>
                <p className="text-xs text-[#6b7d67]">
                  Update status as you progress carefully through the rescue.
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/35 p-2 rounded-2xl border border-[#8b6b4c]/15">
                  <button 
                    onClick={() => handleUpdateStatus('in_progress')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      rescue.status === 'in_progress'
                        ? 'bg-white/80 border-[#5f7d5a] text-[#5f7d5a] shadow-sm'
                        : 'border-transparent text-[#6b7d67] hover:bg-white/60 hover:border-[#8b6b4c]/20'
                    }`}
                  >
                    <Navigation className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold text-center">En Route</span>
                  </button>

                  <button 
                    onClick={() => handleUpdateStatus('picked')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      rescue.status === 'picked'
                        ? 'bg-white/80 border-[#8b6b4c] text-[#8b6b4c] shadow-sm'
                        : 'border-transparent text-[#6b7d67] hover:bg-white/60 hover:border-[#8b6b4c]/20'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold text-center">Picked Up</span>
                  </button>

                  <button 
                    onClick={() => handleUpdateStatus('vet')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      rescue.status === 'vet'
                        ? 'bg-white/80 border-[#8b6b4c] text-[#8b6b4c] shadow-sm'
                        : 'border-transparent text-[#6b7d67] hover:bg-white/60 hover:border-[#8b6b4c]/20'
                    }`}
                  >
                    <Info className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold text-center">At Vet</span>
                  </button>

                  <button 
                    onClick={() => handleUpdateStatus('shelter')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      ['rescued', 'shelter'].includes(rescue.status)
                        ? 'bg-white/80 border-[#7fa37a] text-[#5f7d5a] shadow-sm'
                        : 'border-transparent text-[#6b7d67] hover:bg-white/60 hover:border-[#8b6b4c]/20'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold text-center">Completed</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-[#8b6b4c]/15 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2f3e2c] mb-2">
                      Log Update / Note
                    </label>
                    <textarea 
                      rows={2}
                      className="w-full rounded-2xl px-4 py-3
                      bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35
                      text-[#2f3e2c] placeholder-[#6b7d67]
                      focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]"
                      placeholder="Add a quick note about animal condition..."
                      value={currentNote}
                      onChange={e => setCurrentNote(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-3 flex-wrap">
                    <button
                      className="flex items-center text-sm font-semibold
                      text-[#2f3e2c] bg-white/55 px-4 py-2.5 rounded-xl
                      border border-[#8b6b4c]/35 hover:bg-white/70 hover:shadow-md transition"
                    >
                      <Camera className="w-4 h-4 mr-2" /> Attach Photo Proof
                    </button>

                    <button
                      className="px-6 py-2.5 rounded-xl
                      bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                      border border-[#d6e2d3]
                      text-black/75 font-semibold
                      hover:scale-[1.02] hover:shadow-lg transition duration-300"
                    >
                      Save Log Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl overflow-hidden
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <RescueMapPanel height="h-[300px]" title="Navigation & Routing" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Target Info */}
            <div
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="p-5 border-b border-[#8b6b4c]/20 flex justify-between items-center bg-white/35">
                <h3 className="font-bold text-[#2f3e2c]">Incident Details</h3>
              </div>
            
              <div className="p-5 space-y-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-white/40 flex items-center justify-center border border-[#8b6b4c]/20">
                    {rescue.image ? (
                      <img src={rescue.image} alt="Reported" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-[#6b7d67]" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#2f3e2c] capitalize leading-tight">
                      {rescue.problemType}
                    </h4>
                    <p className="text-sm font-medium text-[#6b7d67] mt-1">Ref: {rescue.id}</p>
                  </div>
                </div>

                <div className="bg-white/55 p-3 rounded-2xl border border-[#8b6b4c]/25">
                  <p className="text-xs font-bold text-[#6b7d67] uppercase mb-1 flex items-center">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> Initial Report
                  </p>
                  <p className="text-sm text-[#4e5f4a]">&quot;{rescue.description}&quot;</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#6b7d67] uppercase mb-1">
                    Destination Clinic
                  </p>
                  <div
                    className="bg-white/55 text-[#2f3e2c] font-bold px-3 py-2.5 rounded-xl text-sm
                    border border-[#8b6b4c]/25"
                  >
                    {rescue.assignedClinic || "Not Assigned"}
                  </div>
                </div>
              </div>
            </div>

            {/* Requester Contact */}
            <div
              className="rounded-3xl p-5
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-4 text-sm uppercase tracking-wider">
                Reporter Contact
              </h3>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#2f3e2c]">{rescue.requester.name}</p>
                  <p className="text-sm text-[#6b7d67]">{rescue.requester.phone}</p>
                </div>

                {rescue.requester.phone !== 'N/A' && (
                  <a
                    href={`tel:${rescue.requester.phone}`}
                    className="w-10 h-10 rounded-full bg-white/65 text-[#5f7d5a]
                    border border-[#8b6b4c]/25 flex items-center justify-center
                    hover:bg-white/80 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedRescueDetailsPage;