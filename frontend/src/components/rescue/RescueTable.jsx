import React from 'react';

const RescueTable = ({ headers, children }) => {
  return (
    <div
      className="overflow-x-auto rounded-3xl
      bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20
      backdrop-blur-2xl border border-[#8b6b4c]/35
      shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
    >
      <table className="min-w-full divide-y divide-[#8b6b4c]/15">
        <thead className="bg-white/40 border-b border-[#8b6b4c]/20">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold
                text-[#6b7d67] uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#8b6b4c]/10 bg-transparent">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default RescueTable;