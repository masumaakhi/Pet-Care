// src/data/donationMockData.js

export const mockCampaigns = [
  {
    id: 'camp_1',
    title: 'Emergency Surgery for Max',
    description: 'Max the Golden Retriever was found with severe injuries. He needs immediate life-saving surgery.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'pet_specific',
    goal: 5000,
    raised: 3250,
    supporters: 42,
    status: 'active',
  },
  {
    id: 'camp_2',
    title: 'Winter Shelter Drive',
    description: 'Help us provide warm beds, blankets, and heating for our rescue shelter before the winter hits.',
    image: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'general',
    goal: 10000,
    raised: 8500,
    supporters: 115,
    status: 'active',
  },
  {
    id: 'camp_3',
    title: 'Food for 100 Puppies',
    description: 'We recently rescued 100 stray puppies and need funding to provide high-quality nutritious puppy food for them.',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'rescue',
    goal: 2500,
    raised: 2500,
    supporters: 89,
    status: 'completed',
  }
];

export const mockSponsorPets = [
  {
    id: 'pet_101',
    name: 'Bella',
    breed: 'Beagle Cross',
    age: '3 years',
    image: 'https://images.unsplash.com/photo-1537151625747-768ad6cfbfc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    story: 'Bella needs consistent medical care for a chronic condition.',
    monthlySponsorshipAmount: 30,
    status: 'needs_sponsor'
  },
  {
    id: 'pet_102',
    name: 'Charlie',
    breed: 'Tabby Cat',
    age: '5 months',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    story: 'Charlie was found abandoned and requires special dietary food.',
    monthlySponsorshipAmount: 20,
    status: 'needs_sponsor'
  }
];

export const mockDonationHistory = [
  {
    id: 'don_001',
    campaignName: 'Emergency Surgery for Max',
    type: 'pet_specific',
    amount: 100,
    status: 'paid',
    date: '2023-10-15T14:30:00Z',
    receiptUrl: '/receipts/don_001.pdf'
  },
  {
    id: 'don_002',
    campaignName: 'General Rescue Fund',
    type: 'general',
    amount: 50,
    status: 'paid',
    date: '2023-09-02T09:15:00Z',
    receiptUrl: '/receipts/don_002.pdf'
  },
  {
    id: 'don_003',
    campaignName: 'Sponsor: Bella',
    type: 'sponsor',
    amount: 30,
    status: 'pending',
    date: '2023-10-24T10:00:00Z',
    receiptUrl: null
  },
  {
    id: 'don_004',
    campaignName: 'Winter Shelter Drive',
    type: 'general',
    amount: 25,
    status: 'failed',
    date: '2023-10-20T16:45:00Z',
    receiptUrl: null
  }
];

export const mockAdminStats = {
  totalDonations: 125430,
  monthlyTotal: 15400,
  averageDonation: 65,
  activeCampaigns: 12,
  activeSponsors: 45,
  pendingPayments: 1250
};

export const mockFundDistribution = [
  { category: 'Medical/Veterinary', percentage: 45, amount: 56443, color: 'bg-blue-500' },
  { category: 'Food & Supplies', percentage: 25, amount: 31357, color: 'bg-green-500' },
  { category: 'Shelter Maintenance', percentage: 15, amount: 18814, color: 'bg-yellow-500' },
  { category: 'Rescue Operations', percentage: 10, amount: 12543, color: 'bg-red-500' },
  { category: 'Admin/Platform', percentage: 5, amount: 6271, color: 'bg-gray-500' }
];

export const mockAllDonations = [
    {
        id: '1',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        campaignName: 'Emergency Surgery for Max',
        type: 'pet_specific',
        amount: 500,
        status: 'paid',
        date: '2023-11-01T10:00:00Z',
    },
    {
        id: '2',
        donorName: 'Jane Smith',
        donorEmail: 'jane@example.com',
        campaignName: 'General Rescue Fund',
        type: 'general',
        amount: 250,
        status: 'pending',
        date: '2023-11-02T14:30:00Z',
    },
    {
        id: '3',
        donorName: 'Alice Johnson',
        donorEmail: 'alice@example.com',
        campaignName: 'Winter Shelter Drive',
        type: 'general',
        amount: 100,
        status: 'paid',
        date: '2023-11-03T09:15:00Z',
    },
    {
        id: '4',
        donorName: 'Bob Brown',
        donorEmail: 'bob@example.com',
        campaignName: 'Bella (Sponsor)',
        type: 'sponsor',
        amount: 30,
        status: 'failed',
        date: '2023-11-04T16:45:00Z',
    },
    {
        id: '5',
        donorName: 'Anonymous',
        donorEmail: 'hidden@example.com',
        campaignName: 'Food for 100 Puppies',
        type: 'rescue',
        amount: 1500,
        status: 'paid',
        date: '2023-11-05T11:20:00Z',
    }
];
