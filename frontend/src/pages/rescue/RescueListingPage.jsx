import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import SectionHeader from "../../components/rescue/SectionHeader";
import RescueTable from "../../components/rescue/RescueTable";
import rescueService from "../../utils/rescueService";
import { formatDate } from "../../utils/rescueHelpers";

const RescueListingPage = () => {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const params = {};
        if (query.trim()) params.q = query.trim();
        const res = await rescueService.getRescueListing(params);
        if (res.data?.success) {
          setVolunteers(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load rescue listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [query]);

  const rows = useMemo(() => volunteers, [volunteers]);

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          title="Rescue Listing"
          description="Publicly view volunteers and how many rescue missions they completed."
        />

        <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 p-4 mb-6 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search volunteer or location..."
              className="w-full rounded-xl border border-[#8b6b4c]/35 bg-white/75 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
            />
          </div>
        </div>

        <RescueTable
          headers={[
            "Volunteer",
            "Completed Rescue",
            "Recent Rescued Pets/Cases",
            "Last Rescue",
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-sm text-[#6b7d67]">
                Loading rescue listing...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-sm text-[#6b7d67]">
                No rescue listing data found.
              </td>
            </tr>
          ) : (
            rows.map((item) => {
              const lastRescue = item.rescuedPets?.[0];
              return (
                <tr key={item.volunteer?.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-[#2f3e2c] whitespace-nowrap">
                    {item.volunteer?.fullName || "Volunteer"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e5f4a]">
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-white/70 border border-[#8b6b4c]/25 font-semibold text-[#2f3e2c]">
                      {item.rescueCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e5f4a]">
                    <div className="space-y-1">
                      {(item.rescuedPets || []).slice(0, 3).map((petCase) => (
                        <div key={petCase.rescueId} className="text-xs bg-white/55 rounded-lg px-2 py-1">
                          {petCase.problemType} - {petCase.incidentAddress}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                    {lastRescue ? formatDate(lastRescue.createdAt) : "—"}
                  </td>
                </tr>
              );
            })
          )}
        </RescueTable>
      </div>
    </div>
  );
};

export default RescueListingPage;

