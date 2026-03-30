import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({
  title = "No Data Found",
  message = "We couldn't find anything matching your criteria.",
  icon: Icon = SearchX,
  actionButton
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center
      rounded-3xl border border-[#8b6b4c]/35
      bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20
      backdrop-blur-2xl"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4
        bg-white/65 border border-[#8b6b4c]/30
        shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
      >
        <Icon className="w-8 h-8 text-[#6b7d67]" />
      </div>

      <h3 className="text-lg font-semibold text-[#2f3e2c] mb-1">{title}</h3>
      <p className="text-sm text-[#6b7d67] max-w-sm mb-6">{message}</p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;