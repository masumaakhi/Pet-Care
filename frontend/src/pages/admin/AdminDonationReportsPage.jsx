// src/pages/admin/AdminDonationReportsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, PieChart, TrendingUp, BarChart3, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DonationStatsCard from '../../components/donations/DonationStatsCard';
import DonationReportsChartPlaceholder from '../../components/donations/DonationReportsChartPlaceholder';
import FundDistributionTable from '../../components/donations/FundDistributionTable';
import { formatCurrency } from '../../utils/donationHelpers';
import api from '../../utils/api';

const AdminDonationReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [rep, st] = await Promise.all([
          api.get('/donations/admin/reports/summary'),
          api.get('/donations/admin/stats'),
        ]);
        if (cancelled) return;
        if (rep.data?.success) setSummary(rep.data.data);
        if (st.data?.success) setStats(st.data.data);
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error(e.response?.data?.message || 'Failed to load reports');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const exportCsv = async () => {
    try {
      const res = await api.get('/donations/admin/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (e) {
      toast.error('Export failed');
    }
  };

  const distribution = summary?.distribution || [];
  const topCampaigns = summary?.topCampaigns || [];

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-10 font-sans relative overflow-hidden bg-transparent">
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2
        w-[700px] h-[700px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[150px] opacity-50 pointer-events-none -z-10"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">Donation Analytics & Reports</h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">
              Funding performance and estimated distribution (based on total paid donations).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-5 py-2.5 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Live data
            </span>
            <button
              type="button"
              onClick={exportCsv}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a]/80 to-[#8b6b4c]/70 text-black/80 font-bold border border-[#d6e2d3]/50 hover:shadow-lg hover:scale-[1.02] transition duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#6b7d67]">Loading reports…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DonationStatsCard
                title="Monthly Gross"
                value={formatCurrency(summary?.monthlyGross ?? 0)}
                trend="up"
                trendValue="—"
                icon={<TrendingUp className="w-6 h-6" />}
              />
              <DonationStatsCard
                title="Unique sponsors (paid)"
                value={stats?.activeSponsors ?? 0}
                trend="up"
                trendValue="—"
                icon={<PieChart className="w-6 h-6" />}
              />
              <DonationStatsCard
                title="Total paid gifts"
                value={stats?.donationCount ?? 0}
                trend="down"
                trendValue="—"
                icon={<Users className="w-6 h-6" />}
              />
              <DonationStatsCard
                title="Avg. Gift Size"
                value={formatCurrency(summary?.avgGift ?? 0)}
                trend="up"
                trendValue="—"
                icon={<BarChart3 className="w-6 h-6" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)] overflow-hidden">
                <DonationReportsChartPlaceholder title="Revenue Trend (Last 6 Months)" type="line" />
              </div>
              <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)] overflow-hidden">
                <DonationReportsChartPlaceholder title="Donations by Category" type="bar" />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <FundDistributionTable distribution={distribution} />
              </div>

              <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] h-full flex flex-col">
                <h3 className="text-xl font-bold text-[#2f3e2c] mb-6">Top Performing Campaigns</h3>
                <div className="space-y-4 flex-grow">
                  {topCampaigns.length === 0 ? (
                    <p className="text-[#6b7d67] text-sm">No campaign data yet.</p>
                  ) : (
                    topCampaigns.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 border border-[#8b6b4c]/30 rounded-2xl bg-white/40 backdrop-blur-sm flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-[#2f3e2c] line-clamp-1">{c.title}</p>
                          <p className="text-xs font-semibold text-[#5f7d5a] mt-1">{c.supporters} Supporters</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-black text-[#8b6b4c] text-lg">{formatCurrency(c.raised)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/donate#campaigns"
                  className="w-full mt-6 py-3 text-sm font-bold text-[#2f3e2c] border border-[#8b6b4c]/40 rounded-xl bg-white/55 hover:bg-white/80 hover:shadow-md transition-all text-center block"
                >
                  View public campaigns
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDonationReportsPage;
