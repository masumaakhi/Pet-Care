import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#e9dfcf] to-[#5b5f3a] text-[#3b3b2a]">
      {/* Top Links */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          {[
            "About Us",
            "FAQ",
            "Blog",
            "Contact Us",
            "Privacy Policy",
            "Terms of Service",
          ].map((item, i) => (
            <button
              key={i}
              className="hover:text-[#7a6f2f] transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black/20" />

      {/* Social Icons */}
      <div className="flex justify-center gap-5 py-6">
        <SocialIcon icon={<FaFacebookF />} />
        <SocialIcon icon={<FaTwitter />} />
        <SocialIcon icon={<FaInstagram />} />
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-[#e8e6d5] pb-6">
        © 2026 Pet-Care. All Rights Reserved.
      </p>
    </footer>
  );
}

/* ================= SUB COMPONENT ================= */

function SocialIcon({ icon }) {
  return (
    <button className="w-9 h-9 rounded-full bg-[#6a6f3f] text-[#f5f2e8] flex items-center justify-center hover:bg-[#8b8f52] transition">
      {icon}
    </button>
  );
}
