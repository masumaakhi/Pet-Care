// src/pages/admin/AdminDonationReportsPage.jsx
import React from 'react';
import { Calendar, Download, PieChart, TrendingUp, BarChart3, Users } from 'lucide-react';
import DonationStatsCard from '../../components/donations/DonationStatsCard';
import DonationReportsChartPlaceholder from '../../components/donations/DonationReportsChartPlaceholder';
import FundDistributionTable from '../../components/donations/FundDistributionTable';
import { mockAdminStats, mockFundDistribution } from '../../data/donationMockData';
import { formatCurrency } from '../../utils/donationHelpers';

const AdminDonationReportsPage = () => {
  return (
    <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-10 font-sans relative overflow-hidden bg-transparent">
      
      {/* Background Glow */}
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2
        w-[700px] h-[700px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[150px] opacity-50 pointer-events-none -z-10"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">Donation Analytics & Reports</h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">Deep dive into funding performance and financial distribution.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/70 hover:shadow-md transition flex items-center gap-2">
              <Calendar className="w-4 h-4" /> This Month
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a]/80 to-[#8b6b4c]/70 text-black/80 font-bold border border-[#d6e2d3]/50 hover:shadow-lg hover:scale-[1.02] transition duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DonationStatsCard 
            title="Monthly Gross" 
            value={formatCurrency(mockAdminStats.monthlyTotal)} 
            trend="up"
            trendValue="18.5%"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <DonationStatsCard 
            title="Conversion Rate" 
            value="4.2%" 
            trend="up"
            trendValue="0.8%"
            icon={<PieChart className="w-6 h-6" />}
          />
          <DonationStatsCard 
            title="Retention (Sponsors)" 
            value="92%" 
            trend="down"
            trendValue="1.2%"
            icon={<Users className="w-6 h-6" />}
          />
          <DonationStatsCard 
            title="Avg. Gift Size" 
            value={formatCurrency(mockAdminStats.averageDonation)} 
            trend="up"
            trendValue="5.0%"
            icon={<BarChart3 className="w-6 h-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)] overflow-hidden">
            <DonationReportsChartPlaceholder title="Revenue Trend (Last 6 Months)" type="line" />
          </div>
          <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)] overflow-hidden">
            <DonationReportsChartPlaceholder title="Donations by Category" type="bar" />
          </div>
        </div>

        {/* Distribution & Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <FundDistributionTable distribution={mockFundDistribution} />
          </div>
          
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] h-full flex flex-col">
            <h3 className="text-xl font-bold text-[#2f3e2c] mb-6">Top Performing Campaigns</h3>
            <div className="space-y-4 flex-grow">
              <div className="p-4 border border-[#8b6b4c]/30 rounded-2xl bg-white/40 backdrop-blur-sm flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-[#2f3e2c] line-clamp-1">Winter Shelter Drive</p>
                  <p className="text-xs font-semibold text-[#5f7d5a] mt-1">115 Supporters</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-black text-[#8b6b4c] text-lg">$8,500</p>
                </div>
              </div>
              <div className="p-4 border border-[#8b6b4c]/30 rounded-2xl bg-white/40 backdrop-blur-sm flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-[#2f3e2c] line-clamp-1">Emergency Surgery - Max</p>
                  <p className="text-xs font-semibold text-[#5f7d5a] mt-1">42 Supporters</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-black text-[#8b6b4c] text-lg">$3,250</p>
                </div>
              </div>
              <div className="p-4 border border-[#8b6b4c]/30 rounded-2xl bg-white/40 backdrop-blur-sm flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-[#2f3e2c] line-clamp-1">Food for 100 Puppies</p>
                  <p className="text-xs font-semibold text-[#5f7d5a] mt-1">89 Supporters</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-black text-[#8b6b4c] text-lg">$2,500</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-[#2f3e2c] border border-[#8b6b4c]/40 rounded-xl bg-white/55 hover:bg-white/80 hover:shadow-md transition-all">
              View All Campaigns
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDonationReportsPage;
