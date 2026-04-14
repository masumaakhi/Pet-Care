// src/components/donations/DonationForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DonationOptionCard from './DonationOptionCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const presets = [10, 25, 50, 100];

/**
 * @param {string} initialType - general | rescue | pet_specific
 * @param {string|null} campaignId
 * @param {string|null} sponsorPetId
 * @param {number} suggestedAmount - e.g. monthly sponsor default
 * @param {function} onSuccess - optional (donation) => void
 */
const DonationForm = ({
  initialType = 'general',
  campaignId = null,
  sponsorPetId = null,
  suggestedAmount = null,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState(() =>
    suggestedAmount && suggestedAmount > 0 ? suggestedAmount : 50
  );
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [type, setType] = useState(initialType);
  const [message, setMessage] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (sponsorPetId && suggestedAmount && suggestedAmount > 0) {
      setAmount(suggestedAmount);
      setCustomAmount('');
    }
  }, [sponsorPetId, suggestedAmount]);

  useEffect(() => {
    if (user?.fullName) setDonorName(user.fullName);
    if (user?.email) setDonorEmail(user.email);
  }, [user]);

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) setAmount(Number(val));
  };

  const handlePresetSelect = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Please choose a valid amount');
      return;
    }
    if (!user && (!donorName.trim() || !donorEmail.trim())) {
      toast.error('Please enter your name and email, or sign in');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        amount,
        frequency,
        message: message.trim() || undefined,
        campaignId: campaignId || undefined,
        sponsorPetId: sponsorPetId || undefined,
      };
      if (!campaignId && !sponsorPetId) {
        payload.type = type === 'rescue' ? 'rescue' : 'general';
      }
      if (!user) {
        payload.donorName = donorName.trim();
        payload.donorEmail = donorEmail.trim();
      }

      const res = await api.post('/donations', payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Thank you!');
        if (onSuccess) onSuccess(res.data.data);
        else navigate('/donations');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const baseInputClass = `w-full px-4 py-3 sm:py-4 rounded-xl
    bg-gradient-to-br from-white/65 via-[#7fa37a]/10 to-[#a18463]/10
    border border-[#8b6b4c]/45
    focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40
    text-[#2f3e2c] font-bold text-lg outline-none transition backdrop-blur-md`;

  const showFundChoice = !campaignId && !sponsorPetId;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
      <form onSubmit={handleSubmit}>
        <div className="flex p-1.5 bg-white/40 border border-[#8b6b4c]/30 rounded-2xl mb-8 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setFrequency('one-time')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition ${frequency === 'one-time' ? 'bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a] to-[#8b6b4c]/80 text-[#2f3e2c] shadow-sm border border-[#d6e2d3]/50' : 'text-[#6b7d67] hover:text-[#2f3e2c] hover:bg-white/30'}`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${frequency === 'monthly' ? 'bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a] to-[#8b6b4c]/80 text-[#2f3e2c] shadow-sm border border-[#d6e2d3]/50' : 'text-[#6b7d67] hover:text-[#2f3e2c] hover:bg-white/30'}`}
          >
            <Heart className={`w-4 h-4 ${frequency === 'monthly' ? 'fill-[#2f3e2c]' : ''}`} /> Monthly (Sponsor)
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-[#4e5f4a] mb-4">Select Amount</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`py-4 rounded-xl font-bold text-xl border-2 transition-all ${
                  amount === preset && !customAmount
                    ? 'border-[#5f7d5a] bg-gradient-to-br from-[#7fa37a]/30 to-[#5f7d5a]/20 text-[#2f3e2c] shadow-inner'
                    : 'border-[#8b6b4c]/30 bg-white/40 hover:border-[#5f7d5a]/50 text-[#6b7d67]'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6b7d67] font-bold text-xl">$</span>
            <input
              type="text"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={`${baseInputClass} pl-10 pr-4 ${customAmount ? 'border-[#5f7d5a] bg-white/70' : ''}`}
            />
          </div>
        </div>

        {showFundChoice && (
          <div className="mb-8">
            <label className="block text-sm font-bold text-[#4e5f4a] mb-4">Where should your donation go?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DonationOptionCard
                type="general"
                title="General Rescue Fund"
                description="Supports wherever the need is greatest right now."
                selected={type === 'general'}
                onClick={setType}
              />
              <DonationOptionCard
                type="rescue"
                title="Emergency Operations"
                description="Directly funds active rescue missions."
                selected={type === 'rescue'}
                onClick={setType}
              />
            </div>
          </div>
        )}

        {!user && (
          <div className="mb-8 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#4e5f4a] mb-2">Your name</label>
              <input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className={`${baseInputClass} font-medium text-base`}
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#4e5f4a] mb-2">Email (for receipt)</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className={`${baseInputClass} font-medium text-base`}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-bold text-[#4e5f4a] mb-2">Leave a message (Optional)</label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send some love and support..."
            className={`${baseInputClass} font-normal text-base resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 text-black/90 text-lg rounded-xl bg-gradient-to-r from-[#5f7d5a]/80 via-[#7fa37a]/90 to-[#8b6b4c]/80 border border-[#d6e2d3]/50 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 backdrop-blur-md disabled:opacity-50"
        >
          {submitting ? 'Processing…' : `Donate $${amount || 0}`}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6b7d67] font-medium">
          <Lock className="w-4 h-4" />
          <span>Payments are simulated in this demo; no card is charged.</span>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
