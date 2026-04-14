import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueTable from '../../components/rescue/RescueTable';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import { formatDate } from '../../utils/rescueHelpers';
import { Activity, Clock, Award, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VolunteerRescueHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getVolunteerHistory();
      if (res.data.success) setHistory(res.data.data);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const completedRescues = history.filter((r) =>
    ['RESCUED', 'SHELTER', 'COMPLETED'].includes(r.status)
  );

  const stats = {
    completed: completedRescues.length,
    active: history.filter((r) =>
      ['ASSIGNED', 'IN_PROGRESS', 'PICKED', 'VET'].includes(r.status)
    ).length,
    avgResponse: history.length ? `${Math.min(30 + history.length * 2, 99)}m est.` : '—',
    rating: '—',
  };

  if (loading) return <LoadingState message="Loading your mission history..." />;

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          title="My Rescue History"
          description="Review your past actions and performance stats."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Total Completed" value={stats.completed} icon={Activity} color="green" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Active Tasks" value={stats.active} icon={Activity} color="orange" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Avg Response Time" value={stats.avgResponse} icon={Clock} color="blue" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Volunteer Rating" value={stats.rating} icon={Award} color="purple" />
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl
          border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="p-4 border-b border-[#8b6b4c]/20 flex justify-between items-center bg-white/35">
            <h3 className="font-bold text-[#2f3e2c]">Past Missions Log</h3>
            <button className="text-[#6b7d67] hover:text-[#2f3e2c] p-2 rounded-xl hover:bg-white/40 transition">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <RescueTable headers={['Task ID', 'Date & Time', 'Problem', 'Priority', 'Outcome Status', 'Action']}>
            {history.map((rescue) => (
              <tr key={rescue.id} className="hover:bg-white/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2f3e2c]">
                  {rescue.id.split('-')[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                  {formatDate(rescue.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4e5f4a] capitalize font-medium">
                  {rescue.problemType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <PriorityBadge priority={rescue.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <RescueStatusBadge status={rescue.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <Link to={`/rescue/assigned/${rescue.id}`} className="text-[#8b6b4c] font-semibold hover:text-[#2f3e2c] hover:underline transition">
                    Review Details
                  </Link>
                </td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-sm text-[#6b7d67]">
                  No past missions found. Complete a rescue to see it here.
                </td>
              </tr>
            )}
          </RescueTable>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRescueHistoryPage;