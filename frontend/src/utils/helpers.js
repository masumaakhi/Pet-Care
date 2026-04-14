// frontend/src/utils/helpers.js

/**
 * Resolves the full URL for a pet photo.
 * Handles relative paths from the server and provides a fallback placeholder.
 * 
 * @param {Object|Array} photos - The pet's photos array or a single photo object
 * @returns {string} The full URL for the image
 */
export const getPetImageUrl = (photos) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5250";
  
  // If no photos or empty array
  if (!photos || (Array.isArray(photos) && photos.length === 0)) {
    return "https://res.cloudinary.com/ddgbit2hg/image/upload/v1740924765/no-image-placeholder_e9w8f0.png";
  }

  // Get the first photo object
  const photo = Array.isArray(photos) ? photos[0] : photos;
  const url = photo.url;

  if (!url) return "https://res.cloudinary.com/ddgbit2hg/image/upload/v1740924765/no-image-placeholder_e9w8f0.png";

  // If the URL is already absolute (e.g., Cloudinary or Unsplash)
  if (url.startsWith("http")) {
    return url;
  }

  // If the URL is relative (e.g., /uploads/pets/...)
  // Ensure the relative URL starts with / for consistency
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${SERVER_URL}${cleanUrl}`;
};

/**
 * Image for adoption grid/detail: API listing (pet.photos or AdoptionPet.image) or local mock (image import/string).
 */
export const getAdoptionListingImage = (pet) => {
  if (pet?.pet?.photos?.length) {
    return getPetImageUrl(pet.pet.photos);
  }
  if (typeof pet?.image === "string" && pet.image.trim()) {
    return getPetImageUrl([{ url: pet.image }]);
  }
  if (pet?.image) {
    return pet.image;
  }
  return getPetImageUrl();
};
