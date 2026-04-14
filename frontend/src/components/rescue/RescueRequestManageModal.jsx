import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import RescueMapPanel from "./RescueMapPanel";
import { geocodeAddress, reverseGeocode } from "../../utils/geocoding";
import { toast } from "react-hot-toast";

const inputClass = `w-full px-4 py-3 rounded-2xl 
  bg-white/40 border border-[#8b6b4c]/30
  focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/20 
  text-[#2f3e2c] outline-none transition backdrop-blur-md`;

const labelClass = "block text-sm font-bold text-[#4e5f4a] mb-2";

/**
 * Modal to edit a pending rescue request (same field styling as RescueRequestPage).
 */
const RescueRequestManageModal = ({ rescue, open, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    problemType: "",
    priority: "",
    description: "",
    incidentAddress: "",
    incidentLat: 23.8103,
    incidentLng: 90.4125,
    locationNote: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rescue || !open) return;
    setFormData({
      problemType: rescue.problemType || "",
      priority: (rescue.priority || "").toLowerCase(),
      description: rescue.description || "",
      incidentAddress: rescue.incidentAddress || rescue.address || "",
      incidentLat: rescue.incidentLat ?? rescue.latitude ?? 23.8103,
      incidentLng: rescue.incidentLng ?? rescue.longitude ?? 90.4125,
      locationNote: rescue.locationNote || "",
    });
  }, [rescue, open]);

  const handleAddressBlur = async () => {
    if (formData.incidentAddress.length > 5) {
      const coords = await geocodeAddress(formData.incidentAddress);
      if (coords) {
        setFormData((prev) => ({
          ...prev,
          incidentLat: coords.lat,
          incidentLng: coords.lng,
        }));
        toast.success("Location updated from address");
      }
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setFormData((prev) => ({
          ...prev,
          incidentLat: latitude,
          incidentLng: longitude,
          incidentAddress: address || prev.incidentAddress,
        }));
        setLoading(false);
        toast.success("Current location applied");
      },
      () => {
        setLoading(false);
        toast.error("Geolocation failed");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSaved || !rescue) return;
    if (!formData.incidentLat || !formData.incidentLng) {
      toast.error("Please set a location on the map");
      return;
    }
    try {
      setLoading(true);
      await onSaved(rescue.id, {
        problemType: formData.problemType,
        priority: formData.priority,
        description: formData.description,
        incidentAddress: formData.incidentAddress,
        incidentLat: formData.incidentLat,
        incidentLng: formData.incidentLng,
        locationNote: formData.locationNote || undefined,
      });
      onClose();
    } catch {
      /* toast handled by parent */
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && rescue && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rescue-edit-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white/75 backdrop-blur-2xl border border-[#8b6b4c]/35 shadow-[0_35px_90px_rgba(0,0,0,0.2)] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 id="rescue-edit-title" className="text-2xl font-extrabold text-[#2f3e2c]">
                  Edit rescue request
                </h2>
                <p className="text-sm text-[#6b7d67] mt-1">
                  Only pending requests can be updated. Volunteers are not notified again automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/60 border border-[#8b6b4c]/25 text-[#4e5f4a] hover:bg-white transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Emergency type</label>
                  <select
                    required
                    value={formData.problemType}
                    onChange={(e) => setFormData({ ...formData, problemType: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Choose issue</option>
                    <option value="injured">Injured</option>
                    <option value="bleeding">Bleeding</option>
                    <option value="sick">Sick / Lethargic</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Urgency level</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Incident details</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Incident location</label>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="text-xs font-bold text-[#5f7d5a] flex items-center gap-1 hover:underline"
                  >
                    <MapPin className="w-3 h-3" /> Use my location
                  </button>
                </div>
                <input
                  required
                  type="text"
                  value={formData.incidentAddress}
                  onChange={(e) => setFormData({ ...formData, incidentAddress: e.target.value })}
                  onBlur={handleAddressBlur}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location note (optional)</label>
                <input
                  type="text"
                  value={formData.locationNote}
                  onChange={(e) => setFormData({ ...formData, locationNote: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#8b6b4c]/25 shadow-inner">
                <RescueMapPanel
                  height="h-[220px]"
                  title="Adjust pin"
                  center={[formData.incidentLat, formData.incidentLng]}
                  markers={[
                    {
                      lat: formData.incidentLat,
                      lng: formData.incidentLng,
                      label: "Incident",
                      isMain: true,
                    },
                  ]}
                  onMapClick={(latlng) =>
                    setFormData({ ...formData, incidentLat: latlng.lat, incidentLng: latlng.lng })
                  }
                  onMarkerDrag={(latlng) =>
                    setFormData({ ...formData, incidentLat: latlng.lat, incidentLng: latlng.lng })
                  }
                  isDraggable
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-[#8b6b4c]/35 bg-white/50 font-semibold text-[#4e5f4a] hover:bg-white/80 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#2f3e2c] to-[#4e5f4a] text-white font-bold hover:scale-[1.01] transition shadow-lg disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RescueRequestManageModal;
