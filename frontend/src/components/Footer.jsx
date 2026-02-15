import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-[#3b3b2a]">
      {/* Top Links */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium py-3">
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
      <div className="border-t border-black/20 py-2" />

      {/* Social Icons */}
      <div className="flex justify-center gap-5 py-2">
        <SocialIcon icon={<FaFacebookF />} />
        <SocialIcon icon={<FaTwitter />} />
        <SocialIcon icon={<FaInstagram />} />
      </div>

      {/* Copyright */}
      <p className="text-center font-md text-xs text-black pb-6">
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
