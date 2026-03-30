// src/components/donations/DonationFilters.jsx
import React from 'react';

const DonationFilters = ({ activeTab, setActiveTab, tabs = [] }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 border-b border-gray-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-emerald-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DonationFilters;
