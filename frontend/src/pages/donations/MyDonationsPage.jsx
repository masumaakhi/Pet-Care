// src/pages/donations/MyDonationsPage.jsx
import React, { useState } from 'react';
import { Heart, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '../../components/donations/SectionHeader';
import DonationStatsCard from '../../components/donations/DonationStatsCard';
import DonationFilters from '../../components/donations/DonationFilters';
import DonationHistoryTable from '../../components/donations/DonationHistoryTable';
import EmptyDonationState from '../../components/donations/EmptyDonationState';
import { mockDonationHistory } from '../../data/donationMockData';

const MyDonationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const totalDonated = mockDonationHistory.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
  const activeSponsorships = mockDonationHistory.filter(d => d.type === 'sponsor').length;
  const successfulDonations = mockDonationHistory.filter(d => d.status === 'paid').length;
  const pendingPayments = mockDonationHistory.filter(d => d.status === 'pending').length;

  const filteredDonations = mockDonationHistory.filter(donation => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sponsorships') return donation.type === 'sponsor';
    return donation.status === activeFilter;
  });

  const filterTabs = [
    { id: 'all', label: 'All Donations' },
    { id: 'paid', label: 'Successful' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
    { id: 'sponsorships', label: 'Sponsorships' }
  ];

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative flex flex-col font-sans overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
           initial={{ opacity: 0, y: 18 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <SectionHeader 
            title="My Support Portfolio" 
            subtitle="Track your impact. Here you can view your past donations, download receipts, and manage your active sponsorships." 
          />
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <DonationStatsCard title="Total Impact" value={`$${totalDonated}`} icon={<Heart className="w-6 h-6" />} color="emerald" />
          <DonationStatsCard title="Active Sponsorships" value={activeSponsorships} icon={<Activity className="w-6 h-6" />} color="blue" />
          <DonationStatsCard title="Successful Donations" value={successfulDonations} icon={<CheckCircle2 className="w-6 h-6" />} color="purple" />
          <DonationStatsCard title="Pending Payments" value={pendingPayments} icon={<AlertCircle className="w-6 h-6" />} color="amber" />
        </motion.div>

        {/* Filters and Table Area */}
        <motion.div 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="rounded-3xl p-6 md:p-8
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="mb-6">
             <DonationFilters 
                activeTab={activeFilter} 
                setActiveTab={setActiveFilter} 
                tabs={filterTabs} 
              />
          </div>

          {filteredDonations.length > 0 ? (
            <DonationHistoryTable donations={filteredDonations} />
          ) : (
            <EmptyDonationState 
              title="No records found" 
              message={`You don't have any ${activeFilter !== 'all' ? activeFilter : ''} donations to display.`}
              actionText={activeFilter === 'all' ? "Make your first donation" : null}
            />
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default MyDonationsPage;
