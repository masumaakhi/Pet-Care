import React from 'react';

const SectionHeader = ({ title, description, actions, className = "" }) => {
  return (
    <div
      className={`mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 ${className}`}
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm sm:text-base text-[#6b7d67]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;