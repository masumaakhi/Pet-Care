// src/pages/donations/DonationCampaignDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import DonationTypeBadge from '../../components/donations/DonationTypeBadge';
import DonationProgressCard from '../../components/donations/DonationProgressCard';
import DonationForm from '../../components/donations/DonationForm';
import { mockCampaigns } from '../../data/donationMockData';

const DonationCampaignDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const found = mockCampaigns.find(c => c.id === id);
    if (found) {
      setCampaign(found);
    } else {
      setCampaign(mockCampaigns[0]);
    }
  }, [id]);

  if (!campaign) {
    return <div className="min-h-screen bg-[#f3f4f3] flex items-center justify-center text-[#6b7d67]">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative flex flex-col font-sans overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6b7d67] hover:text-[#2f3e2c] font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Campaigns
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Campaign Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="relative h-80 md:h-[400px]">
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
                <div className="absolute top-6 left-6">
                  <DonationTypeBadge type={campaign.type} />
                </div>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h1 className="text-3xl md:text-4xl font-black text-[#2f3e2c] leading-tight">
                    {campaign.title}
                  </h1>
                  <button className="p-3 bg-white/55 border border-[#8b6b4c]/40 hover:bg-white/75 text-[#2f3e2c] rounded-full transition-colors shrink-0">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Mobile progress */}
                <div className="block lg:hidden mb-8">
                  <DonationProgressCard goal={campaign.goal} raised={campaign.raised} />
                  <div className="mt-4 flex items-center gap-2 text-[#6b7d67] bg-white/55 backdrop-blur-md p-3 rounded-xl border border-[#8b6b4c]/35">
                    <Heart className="w-5 h-5 text-[#8b6b4c] fill-[#8b6b4c]" />
                    <span className="font-bold text-[#2f3e2c]">{campaign.supporters}</span> generous supporters so far.
                  </div>
                </div>

                <div className="prose max-w-none text-[#4e5f4a]">
                  <p className="text-xl font-medium text-[#2f3e2c] mb-6">
                    {campaign.description}
                  </p>
                  <p className="mb-4">
                    Every day, animals arrive at our shelter needing urgent care. Whether it's 
                    life-saving surgery, medication for chronic illnesses, or simply the time and 
                    resources to rehabilitate them, these animals rely entirely on our rescue fund.
                  </p>
                  <p className="mb-4">
                    By contributing to this campaign, you are directly paying for the medical bills, 
                    specialized diet, and ongoing rehabilitation needed to give this animal a 
                    chance at a happy, healthy life in a forever home.
                  </p>
                  <h3 className="text-lg font-bold text-[#2f3e2c] mt-8 mb-4">How your funds are used:</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>Immediate veterinary assessment and stabilize critical conditions.</li>
                    <li>Surgical procedures, medications, and specialized treatments.</li>
                    <li>High-quality, specialized nutrition for recovery.</li>
                    <li>Post-operative therapy and behavioral rehabilitation.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Recent Supporters */}
            <motion.div 
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-3xl p-8
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="text-xl font-bold text-[#2f3e2c] mb-6">Recent Supporters</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-[#8b6b4c]/35 rounded-2xl bg-white/40 backdrop-blur-md">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7fa37a]/30 to-[#8b6b4c]/20 rounded-full flex items-center justify-center text-[#2f3e2c]">
                      <Heart className="w-5 h-5 fill-[#8b6b4c]/50 text-[#8b6b4c]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2f3e2c]">Anonymous Donor</p>
                      <p className="text-sm text-[#6b7d67]">Donated $50 • 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <motion.div 
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="hidden lg:block bg-white/55 backdrop-blur-2xl p-6 rounded-3xl border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
              >
                <DonationProgressCard goal={campaign.goal} raised={campaign.raised} />
                <div className="mt-6 pt-6 border-t border-[#8b6b4c]/30 flex items-center justify-center gap-2 text-[#6b7d67]">
                  <Heart className="w-5 h-5 text-[#8b6b4c] fill-[#8b6b4c]" />
                  Join <span className="font-bold text-[#2f3e2c]">{campaign.supporters}</span> others who care.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
              >
                <DonationForm 
                  initialType={campaign.type} 
                  campaignId={campaign.id}
                  onSubmit={(data) => alert(`Mock Donation to ${campaign.title} Processed:\n${JSON.stringify(data, null, 2)}`)}
                />
              </motion.div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonationCampaignDetailsPage;
