import React, { useState } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueCard from '../../components/rescue/RescueCard';
import EmptyState from '../../components/rescue/EmptyState';
import { rescueRequests } from '../../data/rescueMockData';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRescueRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter mock data for user "John Doe" / "Alice Smith" etc. We'll just show all mock data as if it's theirs for demonstration.
  const myRequests = rescueRequests.filter(r => r.requester.type === 'user');

  const filteredRequests = myRequests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'in_progress', 'picked', 'vet'].includes(req.status);
    if (activeTab === 'completed') return ['rescued', 'shelter'].includes(req.status);
    return req.status === activeTab;
  });

  const stats = {
    total: myRequests.length,
    active: myRequests.filter(r => ['pending', 'in_progress', 'picked', 'vet'].includes(r.status)).length,
    completed: myRequests.filter(r => ['rescued', 'shelter'].includes(r.status)).length
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
        <SectionHeader 
          title="My Rescue Requests" 
          description="Track the status of animals you've reported for rescue."
          actions={
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
  );
};

export default MyRescueRequestsPage;