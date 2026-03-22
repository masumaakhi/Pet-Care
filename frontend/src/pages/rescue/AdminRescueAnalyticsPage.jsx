import React from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import { adminAnalytics } from '../../data/rescueMockData';
import { Activity, Clock, ShieldCheck, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const AdminRescueAnalyticsPage = () => {

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
          title="Rescue Operations Analytics" 
          description="High-level metrics and performance data for rescue operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Overall Success Rate" value={adminAnalytics.successRate} icon={ShieldCheck} color="green" trend="up" trendValue="+2.4%" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Active Rescues Avg" value={adminAnalytics.activeCount} icon={Activity} color="orange" trend="down" trendValue="-1" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Avg Dispatch Time" value={adminAnalytics.avgResponseTime} icon={Clock} color="blue" trend="up" trendValue="-3 mins" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Active Volunteers (Weekly)" value="45" icon={TrendingUp} color="purple" trend="up" trendValue="+5" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Placeholder Bar Chart */}
          <div
            className="rounded-3xl overflow-hidden
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl
            border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="p-5 border-b border-[#8b6b4c]/20 flex justify-between items-center gap-3">
              <h3 className="font-bold text-[#2f3e2c] flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-[#5f7d5a]" />
                Monthly Rescue Volume
              </h3>

              <select
                className="text-sm rounded-xl py-2 px-3
                border border-[#8b6b4c]/35 bg-white/55 backdrop-blur-xl
                text-[#2f3e2c] focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]"
              >
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
              </select>
            </div>

            <div className="p-6 h-80 flex items-end justify-center gap-8 border-b-4 border-[#8b6b4c]/10 pb-0">
              {adminAnalytics.monthlyTrend.map((data, i) => (
                <div key={i} className="flex flex-col items-center group w-16">
                  <span className="text-xs font-bold text-[#6b7d67] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.rescues}
                  </span>
                  <div 
                    className="w-full rounded-t-2xl transition-all duration-500
                    bg-gradient-to-t from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c]
                    group-hover:scale-y-[1.03]
                    shadow-[0_12px_30px_rgba(95,125,90,0.25)]"
                    style={{ height: `${(data.rescues / 60) * 100}%` }}
                  ></div>
                  <span className="mt-4 mb-2 text-sm font-medium text-[#4e5f4a]">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder Pie Chart Area */}
          <div
            className="rounded-3xl overflow-hidden
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl
            border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="p-5 border-b border-[#8b6b4c]/20">
              <h3 className="font-bold text-[#2f3e2c] flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-[#8b6b4c]" />
                Rescues by Priority Level
              </h3>
            </div>

            <div className="p-8 flex items-center justify-center h-80 relative">
              <div className="w-48 h-48 rounded-full border-[16px] border-white/50 relative shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
                {/* Fake donut chart segments through css conic-gradient */}
                <div
                  className="absolute inset-[-16px] rounded-full"
                  style={{
                    background: 'conic-gradient(#8b6b4c 0% 15%, #7fa37a 15% 45%, #5f7d5a 45% 100%)',
                    maskImage: 'radial-gradient(transparent 55%, black 56%)',
                    WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                  }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-[#2f3e2c]">Total</span>
                  <span className="text-sm font-medium text-[#6b7d67]">100</span>
                </div>
              </div>
               
              <div className="ml-12 space-y-4">
                {adminAnalytics.byPriority.map((p, i) => (
                  <div key={i} className="flex items-center">
                    <span
                      className={`w-4 h-4 rounded mr-3 ${
                        p.name === 'Critical'
                          ? 'bg-[#8b6b4c]'
                          : p.name === 'High'
                          ? 'bg-[#7fa37a]'
                          : 'bg-[#5f7d5a]'
                      }`}
                    ></span>
                    <div>
                      <p className="font-bold text-[#2f3e2c]">{p.name}</p>
                      <p className="text-sm text-[#6b7d67]">{p.value}% of rescues</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Heatmap Placeholder */}
        <div
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl
          border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="p-5 border-b border-[#8b6b4c]/20">
            <h3 className="font-bold text-[#2f3e2c]">Incident Heatmap (Placeholder)</h3>
          </div>

          <div className="h-64 bg-white/35 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-5"></div>

            <p
              className="text-[#6b7d67] font-medium z-10 bg-white/80 px-4 py-2 rounded-xl
              border border-[#8b6b4c]/25 backdrop-blur-sm shadow-sm"
            >
              A real project would integrate a heatmap layer via Google Maps or Mapbox.
            </p>
             
            {/* Fake heatmap blur drops */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-[#8b6b4c]/25 rounded-full blur-[32px]"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#7fa37a]/25 rounded-full blur-[48px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#5f7d5a]/20 rounded-full blur-[24px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueAnalyticsPage;