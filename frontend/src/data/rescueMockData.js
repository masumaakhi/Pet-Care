export const rescueRequests = [
  {
    id: "REQ-001",
    requester: {
      name: "John Doe",
      phone: "+1 234 567 8900",
      type: "user",
    },
    problemType: "injured",
    priority: "critical",
    status: "in_progress",
    location: {
      address: "123 Main St, Springfield",
      lat: 39.7817,
      lng: -89.6501,
      distance: "2.5 km",
    },
    description: "Found a dog hit by a car, bleeding from the hind leg. Needs immediate attention.",
    image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-03-13T10:30:00Z",
    assignedVolunteer: {
      id: "VOL-001",
      name: "Sarah Jenkins",
      phone: "+1 987 654 3210",
      eta: "10 mins",
    },
    assignedClinic: "Springfield Vet Emergency",
    updates: [
      { time: "2026-03-13T10:30:00Z", status: "pending", note: "Request submitted by John Doe." },
      { time: "2026-03-13T10:35:00Z", status: "in_progress", note: "Sarah Jenkins accepted the rescue." },
    ]
  },
  {
    id: "REQ-002",
    requester: {
      name: "Alice Smith",
      phone: "+1 555 123 4567",
      type: "user",
    },
    problemType: "abandoned",
    priority: "normal",
    status: "pending",
    location: {
      address: "456 Elm St, Springfield",
      lat: 39.7900,
      lng: -89.6600,
      distance: "5.0 km",
    },
    description: "A box of kittens left near the dumpster. They look very young and hungry.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-03-13T11:00:00Z",
    assignedVolunteer: null,
    assignedClinic: null,
    updates: [
      { time: "2026-03-13T11:00:00Z", status: "pending", note: "Request submitted by Alice Smith." },
    ]
  },
  {
    id: "REQ-003",
    requester: {
      name: "Tom Harris",
      phone: "+1 444 987 6543",
      type: "user",
    },
    problemType: "sick",
    priority: "high",
    status: "picked",
    location: {
      address: "789 Oak Ave, Springfield",
      lat: 39.8000,
      lng: -89.6400,
      distance: "1.2 km",
    },
    description: "Stray cat looks extremely lethargic and is refusing to eat or drink.",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-03-13T09:15:00Z",
    assignedVolunteer: {
      id: "VOL-002",
      name: "Mike Ross",
      phone: "+1 222 333 4444",
      eta: "Arrived",
    },
    assignedClinic: "Downtown Animal Hospital",
    updates: [
      { time: "2026-03-13T09:15:00Z", status: "pending", note: "Request submitted." },
      { time: "2026-03-13T09:20:00Z", status: "in_progress", note: "Mike Ross accepted." },
      { time: "2026-03-13T09:45:00Z", status: "picked", note: "Animal secured, heading to vet." },
    ]
  },
  {
    id: "REQ-004",
    requester: {
      name: "Emma Wilson",
      phone: "+1 666 777 8888",
      type: "user",
    },
    problemType: "bleeding",
    priority: "critical",
    status: "rescued",
    location: {
      address: "321 Pine Rd, Springfield",
      lat: 39.7700,
      lng: -89.6300,
      distance: "4.1 km",
    },
    description: "Dog with a deep cut on its side, needs wrapping and vet care immediately.",
    image: "https://images.unsplash.com/photo-1537151608804-ea2d15a4eb3c?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-03-12T14:00:00Z",
    assignedVolunteer: {
      id: "VOL-001",
      name: "Sarah Jenkins",
      phone: "+1 987 654 3210",
      eta: "Completed",
    },
    assignedClinic: "Springfield Vet Emergency",
    updates: [
      { time: "2026-03-12T14:00:00Z", status: "pending", note: "Request submitted." },
      { time: "2026-03-12T14:05:00Z", status: "in_progress", note: "Sarah Jenkins en route." },
      { time: "2026-03-12T14:20:00Z", status: "picked", note: "Picked up, bleeding controlled." },
      { time: "2026-03-12T14:40:00Z", status: "vet", note: "Arrived at vet." },
      { time: "2026-03-12T16:00:00Z", status: "rescued", note: "Treated and stabilized, transferring to shelter." },
    ]
  },
  {
    id: "REQ-005",
    requester: {
      name: "Anonymous",
      phone: "N/A",
      type: "user",
    },
    problemType: "abandoned",
    priority: "normal",
    status: "shelter",
    location: {
      address: "101 Maple Blvd, Springfield",
      lat: 39.8100,
      lng: -89.6700,
      distance: "6.5 km",
    },
    description: "Older dog tied to a post in the park, owner nowhere to be seen for hours.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-03-11T08:00:00Z",
    assignedVolunteer: {
      id: "VOL-003",
      name: "David Chen",
      phone: "+1 333 555 7777",
      eta: "Completed",
    },
    assignedClinic: null,
    updates: [
      { time: "2026-03-11T08:00:00Z", status: "pending", note: "Report received." },
      { time: "2026-03-11T08:15:00Z", status: "in_progress", note: "David assigned." },
      { time: "2026-03-11T08:45:00Z", status: "picked", note: "Dog is friendly, picked up." },
      { time: "2026-03-11T09:30:00Z", status: "shelter", note: "Dropped off at Happy Paws Shelter." },
    ]
  }
];

export const volunteers = [
  { id: "VOL-001", name: "Sarah Jenkins", status: "active", activeCases: 1, phone: "+1 987 654 3210", rating: 4.8 },
  { id: "VOL-002", name: "Mike Ross", status: "active", activeCases: 1, phone: "+1 222 333 4444", rating: 4.9 },
  { id: "VOL-003", name: "David Chen", status: "offline", activeCases: 0, phone: "+1 333 555 7777", rating: 4.7 },
  { id: "VOL-004", name: "Emily White", status: "available", activeCases: 0, phone: "+1 888 999 0000", rating: 5.0 },
];

export const adminAnalytics = {
  successRate: "94%",
  activeCount: 12,
  avgResponseTime: "14 mins",
  activeVolunteers: 8,
  monthlyTrend: [
    { month: "Jan", rescues: 45 },
    { month: "Feb", rescues: 52 },
    { month: "Mar", rescues: 38 },
  ],
  byPriority: [
    { name: "Critical", value: 15 },
    { name: "High", value: 30 },
    { name: "Normal", value: 55 },
  ]
};

export const notificationLogs = [
  { id: "NOT-101", recipient: "Sarah Jenkins", rescueId: "REQ-001", channel: "sms", status: "delivered", time: "2026-03-13T10:31:00Z", error: null },
  { id: "NOT-102", recipient: "John Doe", rescueId: "REQ-001", channel: "email", status: "delivered", time: "2026-03-13T10:30:05Z", error: null },
  { id: "NOT-103", recipient: "Mike Ross", rescueId: "REQ-003", channel: "in_app", status: "read", time: "2026-03-13T09:16:00Z", error: null },
  { id: "NOT-104", recipient: "Emily White", rescueId: "REQ-002", channel: "whatsapp", status: "failed", time: "2026-03-13T11:01:00Z", error: "Invalid number" },
];

export const duplicatePairs = [
  {
    id: "DUP-001",
    score: "92%",
    request1: rescueRequests[0],
    request2: {
      ...rescueRequests[0],
      id: "REQ-006",
      requester: { name: "Jane Doe", phone: "+1 234 567 8901", type: "user" },
      createdAt: "2026-03-13T10:32:00Z",
      description: "Dog hit by car on Main st! Bleeding.",
      status: "pending",
      assignedVolunteer: null
    }
  }
];
