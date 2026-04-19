import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const defaultPets = [
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

function unwrapList(res) {
  const payload = res?.data?.data ?? res?.data ?? [];
  return Array.isArray(payload) ? payload : [];
}

export default function useHomeIntegrationData() {
  const [featuredPets, setFeaturedPets] = useState(defaultPets);
  const [adoptionCount, setAdoptionCount] = useState(250);
  const [campaignCount, setCampaignCount] = useState(200);
  const [urgentAlerts, setUrgentAlerts] = useState([
    { id: "fallback-1", label: "Injured Kitten - Downtown", level: "Critical" },
    { id: "fallback-2", label: "Sick Cat - Riverside", level: "High" },
  ]);

  useEffect(() => {
    let active = true;

    async function fetchHomeData() {
      const [adoptionsRes, campaignsRes, alertsRes] = await Promise.allSettled([
        api.get("/adoptions"),
        api.get("/donations/campaigns"),
        api.get("/rescues/public-alerts"),
      ]);

      if (!active) return;

      if (adoptionsRes.status === "fulfilled") {
        const adoptions = unwrapList(adoptionsRes.value);
        if (adoptions.length > 0) {
          setAdoptionCount(adoptions.length);
          setFeaturedPets(
            adoptions.slice(0, 3).map((item, idx) => ({
              name: item.name || `Pet ${idx + 1}`,
              status: item.tag || "Adopt Me",
              img: item.image || defaultPets[idx % defaultPets.length].img,
            }))
          );
        }
      }

      if (campaignsRes.status === "fulfilled") {
        const campaigns = unwrapList(campaignsRes.value);
        if (campaigns.length > 0) {
          setCampaignCount(campaigns.length);
        }
      }

      if (alertsRes.status === "fulfilled") {
        const alerts = unwrapList(alertsRes.value);
        if (alerts.length > 0) {
          setUrgentAlerts(
            alerts.slice(0, 2).map((item) => {
              const rawPriority = String(item.priority || "").toUpperCase();
              const level = rawPriority === "CRITICAL" ? "Critical" : "High";
              const location = item.incidentAddress || item.address || "Unknown area";
              return {
                id: item.id,
                label: `${item.problemType || "Pet Rescue"} - ${location}`,
                level,
              };
            })
          );
        }
      }
    }

    fetchHomeData().catch(() => {
      // Fallback UI data already set in state defaults.
    });

    return () => {
      active = false;
    };
  }, []);

  return useMemo(
    () => ({
      featuredPets,
      adoptionCount,
      campaignCount,
      urgentAlerts,
    }),
    [featuredPets, adoptionCount, campaignCount, urgentAlerts]
  );
}

