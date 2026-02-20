

import React from "react";
import {
  Heart,
  HelpingHand,
  Shield,
  BookOpen,
  Gift,
} from "lucide-react";
// import care from "../assets/care.png"
// import find from "../assets/find.png"
// import rescue from "../assets/rescue.png"
// import milo from "../assets/milo.png"
// import luna from "../assets/luna.png"
// import tiger from "../assets/tiger.png"
// import sechero from "../assets/sechero.jpg"
// ===================== MAIN =====================
export default function SecondHero() {
  return (
    <div className="min-h-screen relative px-6 text-[#3b3b3b] bg-cover bg-center"
    
  //     style={{
  //   backgroundImage: `url(${sechero})`,
  // }}
    >
      {/* Top Navigation */}
      <div className="mx-auto max-w-8xl px-6 lg:px-16">
        <div className="flex gap-6 flex-wrap mb-8">
          {navItems.map((item) => (
            <NavPill key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-8xl px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pets for Adoption */}
        <GlassCard title="Pets for Adoption" action="View All">
          <div className="flex gap-4">
            {pets.map((pet) => (
              <PetCard key={pet.name} {...pet} />
            ))}
          </div>
        </GlassCard>

        {/* Urgent Rescue Alerts */}
        <GlassCard title="Urgent Rescue Alerts">
          <div className="space-y-3">
            <Alert label="Injured Kitten – Downtown" level="Critical" />
            <Alert label="Sick Cat – Riverside" level="High" />
            <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-xl font-semibold shadow">
              Report a Rescue
            </button>
          </div>
        </GlassCard>

        {/* Health Tips */}
        <GlassCard title="Health Tips & Advice"  action="Read Articles">
          <ul className="space-y-2 text-sm">
            <li className="w-full py-2 bg-gray-200 rounded-2xl px-4">Vaccination Reminders</li>
            <li className="w-full py-2 bg-gray-200 rounded-2xl px-4">Litter Training Tips</li>
            <li className="w-full py-2 bg-gray-200 rounded-2xl px-4">Seasonal Care Tips</li>
          </ul>
        </GlassCard>
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-auto max-w-8xl px-6 lg:px-12 mt-14 pb-12">
        <h2 className="text-center text-xl font-semibold mb-8">───────────────────── How It Works ─────────────────────</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <HowCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== COMPONENTS =====================

function NavPill({ label, icon: Icon }) {
  return (
    <button className="flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur-md px-4 py-5 shadow border border-white/30 hover:scale-[1.02] transition">
      <Icon className="w-6 h-6 text-orange-500" />
      <span className="text-medium font-medium">{label}</span>
    </button>
  );
}

function GlassCard({ title, action, children }) {
  return (
    <div className="rounded-2xl bg-white/60 backdrop-blur-lg p-5 shadow-xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{title}</h3>
        {action && (
          <button className="text-sm text-orange-500 font-medium">
            {action} →
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function PetCard({ name, status, img }) {
  return (
    <div className="text-center">
      <img
        src={img}
        alt={name}
        className="w-24 h-24 rounded-xl mx-auto mb-2 object-cover shadow"
      />
      <p className="font-semibold text-sm">{name}</p>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          status === "Adopted"
            ? "bg-gray-200 text-gray-600"
            : "bg-green-100 text-green-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function Alert({ label, level }) {
  const styles =
    level === "Critical"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="flex justify-between items-center bg-white/70 rounded-xl px-3 py-2 text-sm">
      <span>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles}`}>
        {level}
      </span>
    </div>
  );
}

function HowCard({title, img }) {
  return (
    <div 
      className="group relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-3xl"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '300px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Overlay gradient for better text readability */}
      <div className="absolute  group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/70 transition-all duration-500 pb-5"></div>
      
      {/* 3D depth effect  inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80*/}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white z-10">
        {/* Step number badge */}
        {/* <div className="flex justify-start transform group-hover:scale-110 transition-transform duration-300">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white text-base font-bold flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/40 ring-2 ring-orange-300/50">
            {no}
          </span>
        </div> */}
        
        {/* Title */}
        <div className="mt-auto transform group-hover:translate-y-[-4px] transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-orange-50 transition-colors duration-300">
            {title}
          </h3>
          <div className="h-1.5 w-20 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-lg transform group-hover:w-24 transition-all duration-300"></div>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}

// ===================== DATA =====================

const navItems = [
  { label: "Adopt a Pet", icon: Heart },
  { label: "Rescue a Pet", icon: HelpingHand },
  { label: "Pet Health Care", icon: Shield },
  { label: "Book Pet Services", icon: BookOpen },
  { label: "Donate & Support", icon: Gift },
];

const pets = [
  { name: "Milo", status: "Adopt Me", img: "https://6971273ec0356527951e30fc.imgix.net/milo.png?auto=format,compress&w=300" },
  { name: "Luna", status: "Adopt Me", img: "https://6971273ec0356527951e30fc.imgix.net/luna.png?auto=format,compress&w=300" },
  { name: "Tiger", status: "Adopted", img: "https://6971273ec0356527951e30fc.imgix.net/tiger.png?auto=format,compress&w=300" },
];

const steps = [
  { title: "Find & Adopt", img: "https://6971273ec0356527951e30fc.imgix.net/find.png?auto=format,compress&w=800" },
  { title: "Request Rescue", img: "https://6971273ec0356527951e30fc.imgix.net/rescue.png?auto=format,compress&w=800" },
  { title: "Smart Pet Care", img: "https://6971273ec0356527951e30fc.imgix.net/care.png?auto=format,compress&w=800" },
];
