// src/pages/admin/AdminDonationsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, Search, Settings2, HandCoins, Activity, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DonationStatsCard from '../../components/donations/DonationStatsCard';
import DonationTypeBadge from '../../components/donations/DonationTypeBadge';
import DonationStatusBadge from '../../components/donations/DonationStatusBadge';
import { formatCurrency, formatDate } from '../../utils/donationHelpers';
import api from '../../utils/api';

const AdminDonationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [dRes, sRes] = await Promise.all([
        api.get('/donations/admin/all'),
        api.get('/donations/admin/stats'),
      ]);
      if (dRes.data?.success && Array.isArray(dRes.data.data)) setDonations(dRes.data.data);
      if (sRes.data?.success && sRes.data.data) setStats(sRes.data.data);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter((don) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        don.donorName.toLowerCase().includes(q) ||
        don.id.toLowerCase().includes(q) ||
        don.campaignName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || don.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donations, searchTerm, statusFilter]);

  const exportCsv = async () => {
    try {
      const res = await api.get('/donations/admin/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Export failed');
    }
  };

  const markPaid = async (id) => {
    try {
      const res = await api.patch(`/donations/admin/${id}/status`, { status: 'paid' });
      if (res.data?.success) {
        toast.success('Marked as paid');
        load();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-10 font-sans relative overflow-hidden bg-transparent">
      <div
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2
        w-[800px] h-[800px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[160px] opacity-60 pointer-events-none -z-10"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">Donations Management</h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">Monitor, review, and manage all platform contributions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCsv}
              className="px-5 py-2.5 rounded-xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/70 hover:shadow-md transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <Link
              to="/admin/donations/reports"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a]/80 to-[#8b6b4c]/70 text-black/80 font-bold border border-[#d6e2d3]/50 hover:shadow-lg hover:scale-[1.02] transition duration-300 flex items-center h-full"
            >
              Generate Report
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DonationStatsCard
            title="Total Raised"
            value={formatCurrency(stats?.totalDonations ?? 0)}
            trend="up"
            trendValue="—"
            icon={<HandCoins className="w-6 h-6" />}
          />
          <DonationStatsCard
            title="Active Campaigns"
            value={stats?.activeCampaigns ?? 0}
            icon={<Activity className="w-6 h-6" />}
          />
          <DonationStatsCard
            title="Avg. Donation"
            value={formatCurrency(stats?.averageDonation ?? 0)}
            trend="up"
            trendValue="—"
            icon={<CheckCircle2 className="w-6 h-6" />}
          />
          <DonationStatsCard
            title="Pending Processing"
            value={formatCurrency(stats?.pendingPayments ?? 0)}
            trend="down"
            trendValue="—"
            icon={<Clock className="w-6 h-6" />}
          />
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="p-5 border-b border-[#8b6b4c]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-5 h-5 text-[#6b7d67] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by donor, ID, or campaign..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-[#8b6b4c]/40 rounded-xl text-sm font-medium text-[#2f3e2c] focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/50 placeholder:text-[#6b7d67]/70 transition-all backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                className="bg-white/60 border border-[#8b6b4c]/40 text-[#2f3e2c] text-sm font-medium rounded-xl focus:ring-[#7fa37a]/50 focus:border-[#7fa37a]/50 block p-2.5 backdrop-blur-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                type="button"
                onClick={load}
                className="p-2.5 border border-[#8b6b4c]/40 rounded-xl bg-white/60 text-[#2f3e2c] hover:bg-white/80 transition-colors"
                title="Refresh"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-[#6b7d67]">Loading…</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#e5e3df]/40 border-b border-[#8b6b4c]/30">
                  <tr>
                    <th className="py-4 px-6 font-bold text-[#4e5f4a] text-sm tracking-wide">Txn ID</th>
                    <th className="py-4 px-6 font-bold text-[#4e5f4a] text-sm tracking-wide">Donor Info</th>
                    <th className="py-4 px-6 font-bold text-[#4e5f4a] text-sm tracking-wide">Designation</th>
                    <th className="py-4 px-6 font-bold text-[#4e5f4a] text-sm tracking-wide">Amount & Status</th>
                    <th className="py-4 px-6 font-bold text-[#4e5f4a] text-sm tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8b6b4c]/20 text-sm">
                  {filteredDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[#6b7d67] font-semibold text-xs">#{don.id.slice(0, 8)}…</span>
                        <div className="text-xs text-[#6b7d67] mt-1">{formatDate(don.date)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#2f3e2c]">{don.donorName}</div>
                        <div className="text-[#6b7d67] font-medium">{don.donorEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#2f3e2c] mb-1 line-clamp-1">{don.campaignName}</div>
                        <DonationTypeBadge type={don.type} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-black text-[#5f7d5a] text-base mb-1">{formatCurrency(don.amount)}</div>
                        <DonationStatusBadge status={don.status} />
                      </td>
                      <td className="py-4 px-6 text-right space-y-1">
                        {don.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => markPaid(don.id)}
                            className="block w-full text-left sm:text-right text-[#5f7d5a] hover:text-[#2f3e2c] font-bold text-sm"
                          >
                            Mark paid
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            toast(
                              `${don.donorName} • ${formatCurrency(don.amount)} • ${don.campaignName}`,
                              { duration: 4000 }
                            )
                          }
                          className="block w-full text-left sm:text-right text-[#7fa37a] hover:text-[#2f3e2c] font-bold text-sm"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredDonations.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-[#6b7d67] font-medium">
                        No donations found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-[#8b6b4c]/30 flex items-center justify-between text-sm text-[#6b7d67] font-medium bg-[#e5e3df]/20">
            <span>
              Showing {filteredDonations.length} of {donations.length} loaded entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonationsPage;
