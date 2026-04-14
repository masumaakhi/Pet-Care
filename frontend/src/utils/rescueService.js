import api from "./api";

/**
 * Rescue + notification API layer (paths match backend contract).
 * Includes canonical names from spec plus legacy aliases.
 */
const rescueService = {
  createRescueRequest: (formData) =>
    api.post("/rescues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  submitRequest: (formData) =>
    api.post("/rescues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getMyRescueRequests: () => api.get("/rescues/my-requests"),
  getMyRequests: () => api.get("/rescues/my-requests"),

  getRescueDetails: (id) => api.get(`/rescues/${id}`),

  getRescueTracking: (id) => api.get(`/rescues/${id}/tracking`),
  getTrackingData: (id) => api.get(`/rescues/${id}/tracking`),

  updateMyRequest: (id, payload) => api.patch(`/rescues/${id}`, payload),
  cancelMyRequest: (id) => api.delete(`/rescues/${id}`),

  getNearbyRescues: () => api.get("/rescues/volunteer/nearby"),

  acceptRescue: (id) => api.post(`/rescues/${id}/accept`),
  acceptMission: (id) => api.post(`/rescues/${id}/accept`),

  updateRescueStatus: (id, payload) =>
    api.patch(`/rescues/${id}/status`, payload),
  updateMissionStatus: (id, status, note = "") =>
    api.patch(`/rescues/${id}/status`, { status, note }),

  updateVolunteerLiveLocation: (id, payload) =>
    api.patch(`/rescues/${id}/live-location`, payload),
  updateLiveLocation: (id, lat, lng) =>
    api.patch(`/rescues/${id}/live-location`, { lat, lng }),

  getVolunteerRescueHistory: () => api.get("/rescues/volunteer/history"),
  getVolunteerHistory: () => api.get("/rescues/volunteer/history"),

  getAdminRescues: (params) => api.get("/rescues/admin/all", { params }),
  getAllRescues: (params) => api.get("/rescues/admin/all", { params }),

  getAdminRescueAnalytics: () => api.get("/rescues/admin/analytics"),
  getAnalytics: () => api.get("/rescues/admin/analytics"),

  getAdminRescueMapData: () => api.get("/rescues/admin/map"),
  getMapData: () => api.get("/rescues/admin/map"),

  getAdminDuplicateReports: () => api.get("/rescues/admin/duplicates"),
  getDuplicateReports: () => api.get("/rescues/admin/duplicates"),

  handleDuplicateAction: (id, payload) =>
    api.patch(`/rescues/admin/duplicate/${id}`, payload),

  manualAssignRescue: (id, payload) =>
    api.patch(`/rescues/admin/${id}/assign`, payload),
  manualAssign: (id, volunteerId) =>
    api.patch(`/rescues/admin/${id}/assign`, { volunteerId }),

  getAdminNotificationLogs: () => api.get("/rescues/admin/notifications"),

  getNotifications: () => api.get("/notifications"),
  markNotificationAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch("/notifications/read-all"),
};

export default rescueService;
