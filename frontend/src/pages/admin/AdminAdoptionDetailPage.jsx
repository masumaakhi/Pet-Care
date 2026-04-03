// src/pages/admin/AdminAdoptionDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

/**
 * Admin Adoption Detail View
 * Sections: Applicant Info, Home Environment, Experience, Notes, Decision Box
 */
export default function AdminAdoptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");

  // Mock data for detail view
  const application = {
    id: id,
    status: "pending",
    applicant: {
      name: "Sarah Ahmed",
      email: "sarah@example.com",
      phone: "+880 1712-345678",
      address: "Bashundhara R/A, Dhaka",
      profession: "Software Engineer",
      avatar: "SA",
    },
    pet: {
      name: "Bella",
      id: "PET-992",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&h=200&auto=format&fit=crop",
      species: "Dog",
      breed: "Golden Retriever",
      age: "2 years",
    },
    homeInfo: {
      type: "Apartment",
      ownership: "Owned",
      hasYard: "Small Balcony",
      otherPets: "None",
      children: "No children",
    },
    experience: "Had a family dog growing up. Looking for a companion as I work from home. I've researched Golden Retrievers and their activity needs.",
    matchScore: 92,
    date: "2024-03-28",
  };

  const handleDecision = (decision) => {
    toast.success(`Application ${decision} successfully.`);
    navigate("/admin/adoptions");
  };

  return (
    <div className="relative min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/15 via-[#5f7d5a]/10 to-[#8b6b4c]/10 rounded-full blur-[170px] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/admin/adoptions"
            className="flex items-center gap-2 text-[#2f3e2c] font-black uppercase text-[10px] tracking-widest hover:opacity-70 transition"
          >
            ← Back to Requests
          </Link>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            application.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            {application.status}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Applicant & Pet Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pet Card */}
            <GlassCard className="p-6 text-center">
              <div className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest mb-4">Target Pet</div>
              <img 
                src={application.pet.image} 
                alt={application.pet.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#7fa37a]/30 shadow-xl mb-4"
              />
              <h2 className="text-xl font-extrabold text-[#2f3e2c]">{application.pet.name}</h2>
              <p className="text-xs font-bold text-[#6b7d67] uppercase tracking-wider">{application.pet.species} • {application.pet.breed}</p>
              <div className="mt-4 pt-4 border-t border-[#8b6b4c]/10 text-[10px] font-black text-[#5f7d5a] tracking-widest">
                PET ID: {application.pet.id}
              </div>
            </GlassCard>

            {/* Applicant Profile */}
            <GlassCard className="p-6">
              <div className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest mb-4">Applicant</div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-[#f3eee8] flex items-center justify-center text-[#2f3e2c] font-black text-sm border border-[#8b6b4c]/20">
                   {application.applicant.avatar}
                 </div>
                 <div>
                   <div className="font-extrabold text-[#2f3e2c]">{application.applicant.name}</div>
                   <div className="text-[10px] font-bold text-[#6b7d67] italic uppercase tracking-wider">{application.applicant.profession}</div>
                 </div>
              </div>
              <div className="space-y-4">
                 <InfoRow label="Email" value={application.applicant.email} />
                 <InfoRow label="Phone" value={application.applicant.phone} />
                 <InfoRow label="Location" value={application.applicant.address} />
              </div>
            </GlassCard>

            {/* Match Insight */}
            <GlassCard className="p-6 bg-gradient-to-br from-[#5f7d5a]/20 to-[#7fa37a]/20">
              <div className="text-[10px] font-black uppercase text-[#2f3e2c] tracking-widest mb-4">Compatibility Score</div>
              <div className="text-5xl font-black text-[#2f3e2c] mb-2">{application.matchScore}%</div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] transition-all duration-1000"
                  style={{ width: `${application.matchScore}%` }}
                />
              </div>
              <p className="text-[9px] font-bold text-[#4e5f4a] mt-3 uppercase tracking-tighter italic opacity-70">
                Score based on lifestyle survey vs pet needs.
              </p>
            </GlassCard>
          </div>

          {/* Right Column: Detailed Application & Decision */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Content */}
            <GlassCard className="p-8">
              <section className="mb-10">
                <SectionHeader icon="🏠" title="Home Environment" />
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                   <DetailBox label="Type of Residence" value={application.homeInfo.type} />
                   <DetailBox label="Ownership Status" value={application.homeInfo.ownership} />
                   <DetailBox label="Yard / Outdoor Space" value={application.homeInfo.hasYard} />
                   <DetailBox label="Other Household Pets" value={application.homeInfo.otherPets} />
                   <DetailBox label="Children in Home" value={application.homeInfo.children} />
                </div>
              </section>

              <section className="mb-10">
                <SectionHeader icon="🐕" title="Pet Ownership Experience" />
                <div className="mt-6 p-5 rounded-2xl bg-[#f3eee8]/50 border border-[#8b6b4c]/20">
                   <p className="text-sm text-[#2f3e2c] leading-relaxed font-medium italic">
                     "{application.experience}"
                   </p>
                </div>
              </section>

              <section>
                <SectionHeader icon="📝" title="Internal Assessment" />
                <textarea 
                  placeholder="Notes for fellow admins..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-6 p-5 rounded-2xl bg-white/40 border border-[#8b6b4c]/30 outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium h-32"
                />
              </section>
            </GlassCard>

            {/* Decision Box */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
               <GlassCard className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                     <div className="text-lg font-black text-[#2f3e2c]">Final Decision</div>
                     <p className="text-[10px] font-bold text-[#6b7d67] uppercase tracking-widest mt-1">Approve application or Reject for reconsidering.</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                     <button 
                        onClick={() => handleDecision("approved")}
                        className="flex-1 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:scale-[1.03] transition"
                     >
                        Approve
                     </button>
                     <button 
                        onClick={() => handleDecision("rejected")}
                        className="flex-1 sm:px-8 py-3 rounded-2xl bg-white/60 border-2 border-rose-500/30 text-rose-600 font-extrabold uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition"
                     >
                        Reject
                     </button>
                  </div>
               </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- UI Pieces ------------------------- */

function GlassCard({ className = "", children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`rounded-[2rem] bg-white/65 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl p-2 rounded-xl bg-white border border-[#8b6b4c]/10 shadow-sm">{icon}</span>
      <h3 className="text-lg font-black text-[#2f3e2c] uppercase tracking-tight">{title}</h3>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black uppercase text-[#6b7d67] tracking-widest opacity-60">{label}</span>
      <span className="text-xs font-bold text-[#2f3e2c]">{value}</span>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/40 border border-[#8b6b4c]/10">
      <div className="text-[9px] font-black uppercase text-[#6b7d67] tracking-widest mb-1 opacity-70">{label}</div>
      <div className="text-sm font-extrabold text-[#2f3e2c]">{value}</div>
    </div>
  );
}
