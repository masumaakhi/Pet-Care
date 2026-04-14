import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Stethoscope, 
  Home,
  Activity
} from "lucide-react";

export const getStatusConfig = (status) => {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "pending":
      return { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock };
    case "assigned":
      return { label: "Assigned", color: "bg-amber-100 text-amber-900 border-amber-200", icon: Activity };
    case "in_progress":
      return { label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Activity };
    case "picked":
      return { label: "Picked Up", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck };
    case "vet":
      return { label: "At Vet", color: "bg-red-100 text-red-800 border-red-200", icon: Stethoscope };
    case "rescued":
      return { label: "Rescued", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 };
    case "shelter":
      return { label: "In Shelter", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Home };
    case "completed":
      return { label: "Completed", color: "bg-green-100 text-green-900 border-green-200", icon: CheckCircle2 };
    case "cancelled":
      return { label: "Cancelled", color: "bg-gray-200 text-gray-800 border-gray-300", icon: Info };
    default:
      return {
        label: status ? String(status).replace(/_/g, " ") : "Unknown",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Info,
      };
  }
};

export const getPriorityConfig = (priority) => {
  const p = String(priority || "").toLowerCase();
  switch (p) {
    case 'critical':
      return { label: 'Critical', color: 'bg-red-500 text-white', icon: AlertCircle };
    case 'high':
      return { label: 'High', color: 'bg-orange-500 text-white', icon: AlertTriangle };
    case 'normal':
      return { label: 'Normal', color: 'bg-blue-500 text-white', icon: Info };
    default:
      return { label: 'Normal', color: 'bg-gray-500 text-white', icon: Info };
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Visual steps (matches business workflow). Maps backend RescueStatus enums.
 */
export const TIMELINE_STAGES = [
  { id: "PENDING", label: "Pending" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "PICKED", label: "Picked Up" },
  { id: "VET", label: "Vet" },
  { id: "RESCUED", label: "Rescued / Shelter" },
];

/**
 * Map API status → timeline column index (0–4). ASSIGNED shares “In Progress” column.
 */
export function getRescueTimelineIndex(status) {
  const s = String(status || "").toUpperCase();
  if (s === "CANCELLED") return -1;
  if (s === "PENDING") return 0;
  if (s === "ASSIGNED" || s === "IN_PROGRESS") return 1;
  if (s === "PICKED") return 2;
  if (s === "VET") return 3;
  if (s === "RESCUED" || s === "SHELTER" || s === "COMPLETED") return 4;
  return 0;
}
