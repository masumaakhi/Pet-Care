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
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
    case 'in_progress':
      return { label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Activity };
    case 'picked':
      return { label: 'Picked Up', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck };
    case 'vet':
      return { label: 'At Vet', color: 'bg-red-100 text-red-800 border-red-200', icon: Stethoscope };
    case 'rescued':
      return { label: 'Rescued', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 };
    case 'shelter':
      return { label: 'In Shelter', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Home };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Info };
  }
};

export const getPriorityConfig = (priority) => {
  switch (priority) {
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

export const TIMELINE_STAGES = [
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'picked', label: 'Picked Up' },
  { id: 'vet', label: 'At Vet' },
  { id: 'rescued', label: 'Rescued / Shelter' } // combined for simplicity
];
