import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueFilters from '../../components/rescue/RescueFilters';
import RescueTable from '../../components/rescue/RescueTable';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import { formatDate } from '../../utils/rescueHelpers';
import { Activity, ShieldAlert, CheckCircle2, MoreVertical, Eye } from 'lucide-react';
import rescueService from '../../utils/rescueService';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminRescueListPage = () => {
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', problemType: '' });
  const [duplicateOnly, setDuplicateOnly] = useState(false);
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();


  // Real-time admin socket room updates
  const fetchRescues = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = String(filters.priority).toUpperCase();
      if (duplicateOnly) params.duplicate = 'true';
      const res = await rescueService.getAdminRescues(params);
      if (res.data.success) {
        setRescues(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Rescues Error:", error);
      toast.error("Failed to load rescue requests");
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, duplicateOnly]);

  useEffect(() => {
    fetchRescues();
  }, [fetchRescues]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join:admin');
    const refresh = () => fetchRescues();
    socket.on('rescue:new', refresh);
    socket.on('rescue:status-updated', refresh);
    socket.on('rescue:duplicate-flagged', refresh);
    socket.on('rescue:unassigned', refresh);
    socket.on('notification:new', refresh);
    return () => {
      socket.off('rescue:new', refresh);
      socket.off('rescue:status-updated', refresh);
      socket.off('rescue:duplicate-flagged', refresh);
      socket.off('rescue:unassigned', refresh);
      socket.off('notification:new', refresh);
    };
  }, [socket, fetchRescues]);

  const filteredRequests = useMemo(() => {
    return rescues.filter(req => {
      if (filters.status && req.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.priority && req.priority.toLowerCase() !== filters.priority.toLowerCase()) return false;
      if (filters.problemType && req.problemType.toLowerCase() !== filters.problemType.toLowerCase()) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!req.id.toLowerCase().includes(s) && !req.description.toLowerCase().includes(s) && !req.reporter?.fullName?.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [rescues, filters]);

  const stats = useMemo(() => {
    const active = rescues.filter(r => r.status === 'PENDING' || r.status === 'ASSIGNED').length;
    const critical = rescues.filter(r => r.priority === 'CRITICAL').length;
    const completed = rescues.filter(r =>
      ['RESCUED', 'SHELTER', 'COMPLETED'].includes(r.status)
    ).length;
    return {
      total: rescues.length,
      active,
      critical,
      completed
    };
  }, [rescues]);

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
          title="Admin Rescue Command Center"
          description="Monitor, manage, and dispatch all incoming emergency requests."
        />

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-3 mb-6 mt-2 items-center">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-sm font-semibold text-[#2f3e2c] cursor-pointer">
            <input
              type="checkbox"
              checked={duplicateOnly}
              onChange={(e) => setDuplicateOnly(e.target.checked)}
              className="rounded border-[#8b6b4c]/40"
            />
            Duplicates only
          </label>
          <Link to="/admin/rescues/map" className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-sm font-bold text-[#5f7d5a] hover:bg-white/80 transition shadow-sm">
            🗺️ Live Radar Map
          </Link>
          <Link to="/admin/rescues/analytics" className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-sm font-bold text-[#8b6b4c] hover:bg-white/80 transition shadow-sm">
            📊 Mission Analytics
          </Link>
          <Link to="/admin/rescues/duplicates" className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-sm font-bold text-[#4e5f4a] hover:bg-white/80 transition shadow-sm">
            👯 Duplicate Reports
          </Link>
          <Link to="/admin/rescues/notifications" className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-sm font-bold text-[#2f3e2c] hover:bg-white/80 transition shadow-sm">
            🔔 Transmission Logs
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 mt-4">
          <KPIStatCard title="Total Rescues" value={stats.total} icon={Activity} color="blue" />
          <KPIStatCard title="Active Rescues" value={stats.active} icon={Activity} color="orange" />
          <KPIStatCard title="Critical Needs" value={stats.critical} icon={ShieldAlert} color="red" />
          <KPIStatCard title="Total Completed" value={stats.completed} icon={CheckCircle2} color="green" />
        </div>

        <div
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl
          border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="p-5 border-b border-[#8b6b4c]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/35">
            <h3 className="text-lg font-bold text-[#2f3e2c]">All Rescue Tasks</h3>

            <div className="flex bg-white/55 backdrop-blur-xl rounded-xl p-1 border border-[#8b6b4c]/25">
              <button
                onClick={() => setFilters({ ...filters, status: '' })}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${!filters.status
                    ? 'bg-white/80 text-[#2f3e2c] shadow-sm'
                    : 'text-[#6b7d67] hover:text-[#2f3e2c]'
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setFilters({ ...filters, status: 'PENDING' })}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${filters.status === 'PENDING'
                    ? 'bg-white/80 border text-[#8b6b4c] shadow-sm border-[#8b6b4c]/25'
                    : 'text-[#6b7d67] hover:text-[#2f3e2c]'
                  }`}
              >
                Pending
              </button>

              <button
                onClick={() => setFilters({ ...filters, status: 'ASSIGNED' })}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${filters.status === 'ASSIGNED'
                    ? 'bg-white/80 border text-[#5f7d5a] shadow-sm border-[#5f7d5a]/25'
                    : 'text-[#6b7d67] hover:text-[#2f3e2c]'
                  }`}
              >
                Assigned
              </button>
            </div>
          </div>

          <div className="p-5 border-b border-[#8b6b4c]/15 bg-white/20">
            <RescueFilters filters={filters} setFilters={setFilters} searchPlaceholder="Search ID, reporter, or desc..." />
          </div>

          <RescueTable headers={['Request ID', 'Reporter', 'Problem', 'Priority', 'Assigned To', 'Status', 'Started', 'Actions']}>
            {loading ? (
               <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-[#6b7d67]">Loading rescues...</p>
                  </td>
               </tr>
            ) : filteredRequests.map((rescue) => (
              <tr key={rescue.id} className="hover:bg-white/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#2f3e2c]">{rescue.id.split('-')[0]}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#2f3e2c]">{rescue.reporter?.fullName || "Anonymous"}</div>
                  <div className="text-xs text-[#6b7d67]">{rescue.reporter?.email}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4e5f4a] capitalize font-medium">
                  {rescue.problemType}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={rescue.priority} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {rescue.assignedVolunteer ? (
                    <div className="flex items-center text-sm font-medium text-[#2f3e2c]">
                      <div
                        className="w-6 h-6 rounded-full bg-white/65 border border-[#8b6b4c]/25
                        flex items-center justify-center text-[#8b6b4c] text-[10px] mr-2 shrink-0"
                      >
                        {rescue.assignedVolunteer.fullName.charAt(0)}
                      </div>
                      {rescue.assignedVolunteer.fullName}
                    </div>
                  ) : (
                    <span
                      className="text-xs font-bold text-[#8b6b4c]
                      bg-white/55 px-2.5 py-1 rounded-full border border-[#8b6b4c]/25"
                    >
                      Unassigned
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <RescueStatusBadge status={rescue.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                  {formatDate(rescue.createdAt)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/rescues/${rescue.id}`}
                      className="text-[#5f7d5a] hover:text-[#2f3e2c]
                      bg-white/55 hover:bg-white/75 p-2 rounded-xl transition-colors
                      border border-[#8b6b4c]/20"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button className="text-[#6b7d67] hover:text-[#2f3e2c] p-2 rounded-xl hover:bg-white/40 transition">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredRequests.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-sm text-[#6b7d67]">
                  No rescues found matching the current filters.
                </td>
              </tr>
            )}
          </RescueTable>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueListPage;