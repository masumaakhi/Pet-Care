// src/pages/donations/SponsorPetDonatePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SectionHeader from '../../components/donations/SectionHeader';
import DonationForm from '../../components/donations/DonationForm';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/donationHelpers';

export default function SponsorPetDonatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/donations/sponsor-pets/${id}`);
        if (cancelled) return;
        if (res.data?.success && res.data.data) setPet(res.data.data);
        else toast.error('Pet not found');
      } catch (e) {
        if (!cancelled) toast.error(e.response?.data?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex justify-center text-[#6b7d67]">
        Loading…
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen pt-28 px-6 text-center">
        <p className="text-[#6b7d67] mb-4">This sponsor pet was not found.</p>
        <Link to="/donate" className="text-[#5f7d5a] font-bold underline">
          Back to Donate
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10 relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20 rounded-full blur-[140px] opacity-60 pointer-events-none"
      />
      <div className="relative z-10 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6b7d67] hover:text-[#2f3e2c] font-medium mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <SectionHeader
            title={`Sponsor ${pet.name}`}
            subtitle={`Suggested monthly support ${formatCurrency(pet.monthlySponsorshipAmount)} — adjust amount and choose one-time or monthly below.`}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden border border-[#8b6b4c]/35 shadow-lg">
            <img src={pet.image} alt={pet.name} className="w-full h-56 object-cover" />
            <div className="p-6 bg-white/70 backdrop-blur-md">
              <h2 className="text-2xl font-black text-[#2f3e2c]">{pet.name}</h2>
              <p className="text-sm text-[#6b7d67] font-bold mt-1">
                {pet.breed} • {pet.age}
              </p>
              <p className="text-[#4e5f4a] mt-4 text-sm leading-relaxed">{pet.story}</p>
            </div>
          </div>

          <DonationForm
            sponsorPetId={pet.id}
            suggestedAmount={pet.monthlySponsorshipAmount}
            initialType="sponsor"
          />
        </div>
      </div>
    </div>
  );
}
