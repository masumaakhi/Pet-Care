import React from 'react';
import { Filter, Search } from 'lucide-react';

const RescueFilters = ({ filters, setFilters, searchPlaceholder = "Search...", tabs = [] }) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Tabs */}
      {tabs.length > 0 && (
        <div
          className="rounded-2xl overflow-x-auto hide-scrollbar
          bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35
          shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
        >
          <nav className="flex space-x-1 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, status: tab.id })}
                className={`
                  whitespace-nowrap px-4 py-4 border-b-2 font-semibold text-sm transition-all
                  ${
                    filters.status === tab.id 
                      ? 'border-[#7fa37a] text-[#2f3e2c] bg-white/35' 
                      : 'border-transparent text-[#6b7d67] hover:text-[#2f3e2c] hover:border-[#8b6b4c]/35'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#6b7d67]" />
          </div>

          <input
            type="text"
            placeholder={searchPlaceholder}
            className="block w-full pl-10 pr-3 py-3 rounded-xl
            bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35
            text-[#2f3e2c] placeholder-[#6b7d67]
            focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]
            sm:text-sm"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="flex gap-4 sm:w-auto w-full">
          <div className="relative flex-1 sm:w-40 shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-3 text-base rounded-xl
              border border-[#8b6b4c]/35 bg-white/55 backdrop-blur-xl
              text-[#2f3e2c] focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]
              sm:text-sm appearance-none"
              value={filters.priority || ""}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          
          <div className="relative flex-1 sm:w-40 shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-3 text-base rounded-xl
              border border-[#8b6b4c]/35 bg-white/55 backdrop-blur-xl
              text-[#2f3e2c] focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30 focus:border-[#5f7d5a]
              sm:text-sm appearance-none"
              value={filters.problemType || ""}
              onChange={(e) => setFilters({ ...filters, problemType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="injured">Injured</option>
              <option value="abandoned">Abandoned</option>
              <option value="sick">Sick</option>
              <option value="bleeding">Bleeding</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueFilters;