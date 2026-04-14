import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../../components/rescue/SectionHeader";
import RescueMapPanel from "../../components/rescue/RescueMapPanel";
import { Camera, MapPin, AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import rescueService from "../../utils/rescueService";
import { toast } from "react-hot-toast";
import { geocodeAddress, reverseGeocode } from "../../utils/geocoding";

const RescueRequestPage = () => {
  const [formData, setFormData] = useState({
    problemType: "",
    priority: "",
    petCondition: "",
    description: "",
    incidentAddress: "",
    incidentLat: 23.8103,
    incidentLng: 90.4125,
    locationNote: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddressBlur = async () => {
    if (formData.incidentAddress.length > 5) {
      const coords = await geocodeAddress(formData.incidentAddress);
      if (coords) {
        setFormData(prev => ({
          ...prev,
          incidentLat: coords.lat,
          incidentLng: coords.lng
        }));
        toast.success("Location pinned from address!");
      }
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setFormData(prev => ({
          ...prev,
          incidentLat: latitude,
          incidentLng: longitude,
          incidentAddress: address || prev.incidentAddress
        }));
        setLoading(false);
        toast.success("Current location detected!");
      }, () => {
        setLoading(false);
        toast.error("Geolocation failed. Please pin manually.");
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.incidentLat || !formData.incidentLng) {
      toast.error("Please select a location on the map");
      return;
    }
    if (!formData.incidentAddress) {
      toast.error("Please provide an incident address");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("problemType", formData.problemType);
      data.append("priority", formData.priority);
      if (formData.petCondition?.trim()) {
        data.append("petCondition", formData.petCondition.trim());
      }
      data.append("description", formData.description);
      data.append("incidentAddress", formData.incidentAddress);
      data.append("incidentLat", formData.incidentLat);
      data.append("incidentLng", formData.incidentLng);
      if (formData.locationNote) data.append("locationNote", formData.locationNote);
      if (imageFile) data.append("image", imageFile);

      const res = await rescueService.submitRequest(data);

      if (res.data.success) {
        setRequestId(res.data.data.id);
        setIsSubmitted(true);
        toast.success("Emergency alert sent!");
      }
    } catch (error) {
      console.error("Rescue Request Error:", error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-2xl 
              bg-white/40 border border-[#8b6b4c]/30
              focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/20 
              text-[#2f3e2c] outline-none transition backdrop-blur-md`;

  const labelClass = "block text-sm font-bold text-[#4e5f4a] mb-2";

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-[6rem] pb-[5rem]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[130px] opacity-70 pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/50 p-10 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white shadow-xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-[#2f3e2c] mb-4">Request Sent!</h2>
          <p className="text-[#6b7d67] mb-8 text-lg">
            Ticket <span className="font-bold text-[#2f3e2c]">#{requestId.toString().slice(0, 8).toUpperCase()}</span>. Verified volunteers are being notified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rescue/my-requests" className="px-8 py-4 rounded-2xl bg-[#2f3e2c] text-white font-bold hover:bg-[#1a251a] transition shadow-lg">View My Requests</Link>
            <Link to={`/rescue/tracking/${requestId}`} className="px-8 py-4 rounded-2xl bg-white border-2 border-[#5f7d5a] text-[#5f7d5a] font-bold hover:bg-[#f3eee8] transition shadow-lg">Track Progress</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 relative overflow-hidden pt-[6rem] pb-[5rem]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7fa37a]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8b6b4c]/10 rounded-full blur-[120px] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto uppercase">
        <SectionHeader title="Emergency Rescue Request" description="Report a pet in distress. We connect you with local nearby heroes." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2">
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 p-8 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Emergency Type</label>
                  <select required value={formData.problemType} onChange={(e) => setFormData({ ...formData, problemType: e.target.value })} className={inputClass}>
                    <option value="">Choose issue</option>
                    <option value="injured">Injured</option>
                    <option value="bleeding">Bleeding</option>
                    <option value="sick">Sick / Lethargic</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={inputClass}>
                    <option value="">Urgency level</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Pet condition (visible injuries, behavior, size)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Small dog, limping left leg, bleeding from paw…"
                  value={formData.petCondition}
                  onChange={(e) => setFormData({ ...formData, petCondition: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Incident Details</label>
                <textarea required rows={4} placeholder="Description of the pet and situation..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Incident Location</label>
                  <button type="button" onClick={handleUseMyLocation} className="text-xs font-bold text-[#5f7d5a] flex items-center gap-1 hover:underline">
                    <MapPin className="w-3 h-3" /> Pin My Current Pos
                  </button>
                </div>
                <input
                  required
                  type="text"
                  placeholder="Approximate address or landmark..."
                  value={formData.incidentAddress}
                  onChange={(e) => setFormData({ ...formData, incidentAddress: e.target.value })}
                  onBlur={handleAddressBlur}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location Note (optional)</label>
                <input type="text" placeholder="e.g. Near the blue gate, 2nd floor entrance..." value={formData.locationNote} onChange={(e) => setFormData({ ...formData, locationNote: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Visual Evidence (Photo)</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center ${imagePreview ? 'border-transparent' : 'border-[#8b6b4c]/40 hover:border-[#5f7d5a] bg-white/30'}`}
                >
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-xl">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-3xl bg-[#7fa37a]/20 flex items-center justify-center text-[#5f7d5a] group-hover:scale-110 transition duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-[#6b7d67]">Tap to upload incident photo</p>
                      <p className="text-[10px] text-[#8b6b4c] mt-1 italic font-medium">JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-[#2f3e2c] to-[#4e5f4a] text-white font-bold text-lg hover:scale-[1.02] transition shadow-2xl disabled:opacity-50">
                {loading ? "Transmitting..." : "Broadcast Rescue Alert"}
              </button>
            </motion.form>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl">
              <h3 className="text-xl font-bold text-[#2f3e2c] mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#8b6b4c]" /> Rescue Protocol
              </h3>
              <div className="space-y-4">
                {[
                  "Stay safe. Do not approach hostile animals without gear.",
                  "Keep visual on the subject until help arrives if possible.",
                  "Share precise details to reduce response time."
                ].map((note, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#7fa37a]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5f7d5a]" />
                    </div>
                    <p className="text-sm font-medium text-[#4e5f4a] leading-relaxed lowercase">{note}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <RescueMapPanel
                height="h-[320px]"
                title={formData.incidentAddress ? "Target Acquired" : "Pin Extraction Point"}
                center={[formData.incidentLat, formData.incidentLng]}
                markers={[{ lat: formData.incidentLat, lng: formData.incidentLng, label: "Rescue Target", isMain: true }]}
                onMapClick={(latlng) => { setFormData({ ...formData, incidentLat: latlng.lat, incidentLng: latlng.lng }); }}
                onMarkerDrag={(latlng) => { setFormData({ ...formData, incidentLat: latlng.lat, incidentLng: latlng.lng }); }}
                isDraggable={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueRequestPage;