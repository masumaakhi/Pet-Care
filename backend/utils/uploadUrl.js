const getUploadedFileUrl = (file, fallbackRelativeUrl = null) => {
  if (!file) return fallbackRelativeUrl;

  // CloudinaryStorage commonly returns secure_url in path.
  if (typeof file.path === "string" && /^https?:\/\//i.test(file.path)) {
    return file.path;
  }
  if (typeof file.secure_url === "string" && /^https?:\/\//i.test(file.secure_url)) {
    return file.secure_url;
  }

  if (fallbackRelativeUrl && file.filename) {
    return fallbackRelativeUrl;
  }

  return fallbackRelativeUrl;
};

module.exports = { getUploadedFileUrl };
