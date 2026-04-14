// src/pages/donations/DonatePage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SectionHeader from '../../components/donations/SectionHeader';
import DonationForm from '../../components/donations/DonationForm';
import DonationCampaignCard from '../../components/donations/DonationCampaignCard';
import SponsorPetCard from '../../components/donations/SponsorPetCard';
import TransparencyBreakdownCard from '../../components/donations/TransparencyBreakdownCard';
import api from '../../utils/api';

const DonatePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [sponsorPets, setSponsorPets] = useState([]);
  const [transparency, setTransparency] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [cRes, sRes, tRes] = await Promise.all([
          api.get('/donations/campaigns'),
          api.get('/donations/sponsor-pets'),
          api.get('/donations/transparency'),
        ]);
        if (cancelled) return;
        if (cRes.data?.success && Array.isArray(cRes.data.data)) setCampaigns(cRes.data.data);
        if (sRes.data?.success && Array.isArray(sRes.data.data)) setSponsorPets(sRes.data.data);
        if (tRes.data?.success && Array.isArray(tRes.data.data)) setTransparency(tRes.data.data);
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error(e.response?.data?.message || 'Could not load donation data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative flex flex-col font-sans overflow-hidden"
    >
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[800px] h-[800px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[160px] opacity-70 pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-0
        w-[600px] h-[600px]
        bg-gradient-to-br from-[#d6e2d3]/30 via-[#7fa37a]/20 to-transparent
        rounded-full blur-[120px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <section className="text-center py-16 lg:py-24 relative">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight text-[#2f3e2c]"
          >
            Every Life Deserves <br />
            <span className="text-[#5f7d5a]">A Second Chance.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-[#6b7d67] max-w-2xl mx-auto mb-10"
          >
            Your support directly provides medical care, food, and shelter for rescued animals who have nowhere else to turn.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href="#donate-form"
              className="px-8 py-3.5 bg-gradient-to-r from-[#5f7d5a]/80 via-[#7fa37a]/90 to-[#8b6b4c]/80 text-black/90 font-bold rounded-xl border border-[#d6e2d3]/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 backdrop-blur-md"
            >
              Give Today
            </a>
            <a
              href="#campaigns"
              className="px-8 py-3.5 bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-bold rounded-xl shadow-md hover:bg-white/70 hover:shadow-lg transition duration-300 backdrop-blur-xl"
            >
              View Campaigns
            </a>
          </motion.div>
        </section>

        <div id="donate-form" className="max-w-4xl mx-auto mb-20 scroll-mt-24">
          <DonationForm />
        </div>

        <section id="campaigns" className="mb-20 scroll-mt-24">
          <SectionHeader
            title="Urgent Rescue Campaigns"
            subtitle="These animals need your immediate help. Review our active campaigns and choose where your support goes."
          />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-white/40 animate-pulse border border-[#d0ddcc]" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <p className="text-center text-[#6b7d67] py-12">No campaigns yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <DonationCampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              title="Sponsor a Pet"
              subtitle="Become a monthly sponsor and provide ongoing care for animals with special or chronic needs."
            />
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-80 rounded-3xl bg-white/40 animate-pulse border border-[#d0ddcc]" />
              <div className="h-80 rounded-3xl bg-white/40 animate-pulse border border-[#d0ddcc]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sponsorPets.map((pet, idx) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <SponsorPetCard pet={pet} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10 max-w-4xl mx-auto">
          <TransparencyBreakdownCard data={transparency} />
        </section>
      </div>
    </div>
  );
};

export default DonatePage;
