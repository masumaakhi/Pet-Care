import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

/**
 * Returns to the previous route in history (browser back).
 */
export default function BackNavButton({ label = "Back", className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-[#5f7d5a] hover:text-[#4e5f4a] font-semibold text-sm transition mb-1 ${className}`}
    >
      <FaArrowLeft className="text-xs shrink-0" aria-hidden />
      {label}
    </button>
  );
}
