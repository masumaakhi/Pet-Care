import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, Heart, ShieldAlert, DollarSign, 
  ShoppingBag, MessageSquare, Bone, ClipboardList 
} from "lucide-react";

const modules = [
  { id: "user", name: "User Management", icon: Users, desc: "Manage platform users, roles, and account statuses.", color: "from-[#7fa37a] to-[#5f7d5a]" },
  { id: "pet", name: "Pet Records", icon: Bone, desc: "CRUD operations on all registered pets and their details.", color: "from-[#8b6b4c] to-[#6d4c3d]" },
  { id: "adoptionpet", name: "Adoption Listings", icon: Heart, desc: "Manage pets currently listed for adoption.", color: "from-emerald-500 to-teal-600" },
  { id: "adoptionapplication", name: "Adoption Applications", icon: ClipboardList, desc: "Review and manage adopter applications.", color: "from-sky-500 to-indigo-600" },
  { id: "rescuerequest", name: "Rescue Operations", icon: ShieldAlert, desc: "Manage active and historical rescue requests.", color: "from-rose-500 to-red-700" },
  { id: "donation", name: "Donations Log", icon: DollarSign, desc: "View and edit individual donation records.", color: "from-amber-500 to-orange-600" },
  { id: "donationcampaign", name: "Campaigns", icon: ShoppingBag, desc: "Manage fundraising campaigns and goals.", color: "from-purple-500 to-pink-600" },
  { id: "communitypost", name: "Community Posts", icon: MessageSquare, desc: "Moderate community discussions and posts.", color: "from-[#5f7d5a] to-[#8b6b4c]" },
];

export default function AdminDataHub() {
  const navigate = useNavigate();

  return (
    <div className="relative pt-6 pb-20">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#7fa37a]/20 via-[#5f7d5a]/10 to-[#8b6b4c]/10 rounded-full blur-[160px] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <header className="mb-10 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-[#2f3e2c]"
          >
            Data Management Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#6b7d67] mt-2 text-lg"
          >
            A centralized environment for administrative CRUD operations across all modules.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => navigate(`/admin/data/${m.id}`)}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl blur-xl" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              
              <div className="relative h-full p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <m.icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-[#2f3e2c] mb-2">{m.name}</h3>
                <p className="text-sm text-[#6b7d67] leading-relaxed">
                  {m.desc}
                </p>

                <div className="mt-6 w-full pt-4 border-t border-[#8b6b4c]/10 flex justify-between items-center text-[#5f7d5a] font-semibold text-sm">
                  <span>Manage Data</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
