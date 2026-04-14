import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueCard from '../../components/rescue/RescueCard';
import EmptyState from '../../components/rescue/EmptyState';
import LoadingState from '../../components/rescue/LoadingState';
import RescueRequestManageModal from '../../components/rescue/RescueRequestManageModal';
import { PlusCircle, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import rescueService from '../../utils/rescueService';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const MyRescueRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRescue, setEditingRescue] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Real-time status updates via socket
  useEffect(() => {
    if (!socket) return;
    const handler = ({ rescueId, status }) => {
      setRequests(prev =>
        prev.map(r => r.id === rescueId ? { ...r, status } : r)
      );
    };
    socket.on('rescue:status-updated', handler);
    return () => socket.off('rescue:status-updated', handler);
  }, [socket]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getMyRequests();
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load your rescue requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id, payload) => {
    try {
      const res = await rescueService.updateMyRequest(id, payload);
      if (res.data.success) {
        toast.success(res.data.message || "Request updated");
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...res.data.data } : r)));
        return;
      }
      throw new Error(res.data?.message || "Update failed");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Update failed");
      throw error;
    }
  };

  const handleCancelRequest = async (rescue) => {
    if (!window.confirm("Cancel this rescue request? This cannot be undone.")) return;
    try {
      const res = await rescueService.cancelMyRequest(rescue.id);
      if (res.data.success) {
        toast.success(res.data.message || "Request cancelled");
        setRequests((prev) =>
          prev.map((r) => (r.id === rescue.id ? { ...r, status: "CANCELLED" } : r))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel request");
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'PICKED', 'VET'].includes(req.status);
    if (activeTab === 'completed') return ['RESCUED', 'SHELTER', 'COMPLETED'].includes(req.status);
    if (activeTab === 'pending') return req.status === 'PENDING';
    return true;
  });

  const stats = {
    total: requests.length,
    active: requests.filter(r => ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'PICKED', 'VET'].includes(r.status)).length,
    completed: requests.filter(r => ['RESCUED', 'SHELTER', 'COMPLETED'].includes(r.status)).length
  };

  if (loading) return <LoadingState message="Loading your rescue history..." />;

  return (
    <>
    <RescueRequestManageModal
      rescue={editingRescue}
      open={Boolean(editingRescue)}
      onClose={() => setEditingRescue(null)}
      onSaved={handleSaveEdit}
    />
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
          title="My Rescue Requests"
          description="Track the status of animals you've reported for rescue."
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMyRequests}
                className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-[#6b7d67] hover:text-[#2f3e2c] transition"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                to="/rescue"
                className="inline-flex items-center justify-center gap-2
                px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                border border-[#d6e2d3]
                text-black/75 text-sm font-semibold
                hover:scale-[1.02] hover:shadow-lg transition duration-300"
              >
                <PlusCircle className="w-4 h-4" />
                New Request
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Total Requests" value={stats.total} color="blue" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Active Rescues" value={stats.active} color="orange" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Completed Rescues" value={stats.completed} color="green" />
          </div>
        </div>

        <div
          className="mb-6 rounded-2xl overflow-hidden
          bg-white/55 backdrop-blur-xl
          border border-[#8b6b4c]/35
          shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
        >
          <div className="border-b border-[#8b6b4c]/20 flex overflow-x-auto">
            {['all', 'active', 'pending', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all duration-300 ${
                  activeTab === tab
                    ? 'border-[#7fa37a] text-[#2f3e2c] bg-white/40'
                    : 'border-transparent text-[#6b7d67] hover:text-[#2f3e2c] hover:border-[#8b6b4c]/40'
                }`}
              >
                {tab === 'all' ? 'All Requests' : tab}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(rescue => (
              <div
                key={rescue.id}
                className="rounded-3xl overflow-hidden
                bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
                backdrop-blur-2xl
                border border-[#8b6b4c]/45
                shadow-[0_25px_80px_rgba(0,0,0,0.12)]
                hover:shadow-[0_55px_160px_rgba(95,125,90,0.35)]
                transition duration-500"
              >
                <RescueCard
                  rescue={rescue}
                  linkTo={`/rescue/tracking/${rescue.id}`}
                />
                {rescue.status === 'PENDING' && (
                  <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-[#8b6b4c]/15 bg-white/35">
                    <button
                      type="button"
                      onClick={() => setEditingRescue(rescue)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-white/70 border border-[#5f7d5a]/35 text-[#2f3e2c] hover:bg-white transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelRequest(rescue)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-red-500/10 border border-red-400/40 text-red-800 hover:bg-red-500/15 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl p-6 sm:p-8
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl
            border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <EmptyState
              title="No Requests Found"
              message={`You have no ${activeTab === 'all' ? '' : activeTab} rescue requests at the moment.`}
              actionButton={
                <Link
                  to="/rescue"
                  className="inline-flex items-center justify-center gap-2
                  px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  border border-[#d6e2d3]
                  text-black/75 font-semibold
                  hover:scale-[1.02] hover:shadow-lg transition duration-300"
                >
                  Submit a Request
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MyRescueRequestsPage;