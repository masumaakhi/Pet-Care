// src/utils/donationHelpers.js

/**
 * Formats a number to a currency string (USD).
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculates the progress percentage for a donation campaign.
 * @param {number} raised - Amount raised.
 * @param {number} goal - Funding goal.
 * @returns {number} Percentage between 0 and 100.
 */
export const calculateProgressPercentage = (raised, goal) => {
  if (!goal || goal <= 0) return 0;
  const percentage = (raised / goal) * 100;
  return Math.min(Math.round(percentage), 100);
};

/**
 * Returns color classes for a given donation payment status.
 * @param {string} status - 'pending', 'paid', or 'failed'.
 * @returns {string} Tailwind CSS class string.
 */
export const getStatusColorClasses = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Returns human-readable label and color classes for a donation type.
 * @param {string} type - 'general', 'rescue', 'pet_specific', 'sponsor'.
 * @returns {Object} { label: string, colorClass: string }
 */
export const getDonationTypeDetails = (type) => {
  switch (type?.toLowerCase()) {
    case 'general':
      return { label: 'General Fund', colorClass: 'bg-blue-100 text-blue-800' };
    case 'rescue':
      return { label: 'Emergency Rescue', colorClass: 'bg-red-100 text-red-800' };
    case 'pet_specific':
      return { label: 'Pet Specific', colorClass: 'bg-purple-100 text-purple-800' };
    case 'sponsor':
      return { label: 'Sponsorship', colorClass: 'bg-teal-100 text-teal-800' };
    default:
      return { label: 'Other', colorClass: 'bg-gray-100 text-gray-800' };
  }
};

/**
 * Formats a date string into a readable format.
 * @param {string|Date} dateString - The date to format.
 * @returns {string} Formatted date (e.g., "Oct 24, 2023").
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
