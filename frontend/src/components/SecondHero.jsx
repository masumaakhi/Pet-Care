import React from "react";
import { Heart, HelpingHand, Shield, BookOpen, Gift } from "lucide-react";

// ===================== MAIN =====================
export default function SecondHero() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8">
  <div className="grid ls:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:flex lg:grid-cols-5 lg:gap-6 lg:justify-center">
    {navItems.map((item) => (
      <NavPill key={item.label} {...item} />
    ))}
  </div>
</div>
  );
}

// ===================== COMPONENTS =====================

function NavPill({ label, icon: Icon }) {
  return (
    <button
      className="
        w-full lg:w-auto
        flex items-center justify-center lg:justify-start
        gap-2 sm:gap-3
        rounded-2xl bg-white/60 backdrop-blur-md
        px-3 sm:px-4 lg:px-6
        py-3 sm:py-4
        shadow border border-white/30
        hover:scale-[1.02] transition
        lg:min-w-[220px]
      "
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
      <span className="text-sm sm:text-base font-medium whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function GlassCard({ title, action, children }) {
  return (
    <div className="rounded-2xl bg-white/60 backdrop-blur-lg p-4 sm:p-5 shadow-xl border border-white/30">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        {action && (
          <button className="text-xs sm:text-sm text-orange-500 font-medium">
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
    <div className="text-center shrink-0 w-[120px] sm:w-auto">
      <img
        src={img}
        alt={name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl mx-auto mb-2 object-cover shadow"
      />
      <p className="font-semibold text-sm">{name}</p>
      <span
        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
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
      <span className="pr-3">{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles}`}>
        {level}
      </span>
    </div>
  );
}

function HowCard({ title, img }) {
  return (
    <div
      className="group relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "220px",
      }}
    >
      {/* ✅ overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 group-hover:from-black/75 transition-all duration-500" />

      {/* depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 text-white z-10">
        <div className="mt-auto transform group-hover:translate-y-[-4px] transition-transform duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
          <div className="h-1.5 w-16 sm:w-20 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-lg group-hover:w-24 transition-all duration-300" />
        </div>
      </div>

      {/* Shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
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
  {
    name: "Milo",
    status: "Adopt Me",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142582/milo_dxkdxw.png?auto=format,compress&w=300",
  },
  {
    name: "Luna",
    status: "Adopt Me",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142598/luna_ved9nl.png?auto=format,compress&w=300",
  },
  {
    name: "Tiger",
    status: "Adopted",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142616/tiger_omeuoi.png?auto=format,compress&w=300",
  },
];

const steps = [
  {
    title: "Find & Adopt",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142744/find_g8cjeq.png?auto=format,compress&w=800",
  },
  {
    title: "Request Rescue",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142779/rescue_slympa.png?auto=format,compress&w=800",
  },
  {
    title: "Smart Pet Care",
    img: "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142762/care_jlus4c.png?auto=format,compress&w=800",
  },
];