import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Plus, Edit2, Trash2, 
  ChevronLeft, ChevronRight, X, AlertCircle 
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const MODEL_CONFIG = {
  user: {
    label: "Users",
    columns: [
      { key: "profilePicture", label: "Image", isImage: true },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Joined", format: "date" },
    ],
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role", type: "select", options: ["user", "volunteer", "vet", "admin", "owner"] },
      { name: "status", label: "Status", type: "select", options: ["active", "suspended", "pending"] },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "profilePicture", label: "Profile Picture URL", type: "text" },
    ]
  },
  pet: {
    label: "Pets",
    columns: [
      { key: "photos.0.url", label: "Photo", isImage: true },
      { key: "name", label: "Name" },
      { key: "species", label: "Species" },
      { key: "breed", label: "Breed" },
      { key: "owner.fullName", label: "Owner" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Pet Name", type: "text", required: true },
      { name: "species", label: "Species", type: "text", required: true },
      { name: "breed", label: "Breed", type: "text" },
      { name: "age_months", label: "Age (Months)", type: "number" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Unknown"] },
      { name: "weight_kg", label: "Weight (kg)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["PENDING", "APPROVED", "REJECTED", "FLAGGED"] },
      { name: "adoptionStatus", label: "Adoption Status", type: "select", options: ["NONE", "PENDING", "APPROVED", "REJECTED", "ADOPTED"] },
      { name: "description", label: "Description", type: "textarea" },
    ]
  },
  adoptionpet: {
    label: "Adoption Listings",
    columns: [
      { key: "image", label: "Image", isImage: true },
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "gender", label: "Gender" },
      { key: "status", label: "Status" },
      { key: "tag", label: "Tag" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "text" },
      { name: "breed", label: "Breed", type: "text" },
      { name: "age", label: "Age", type: "text" },
      { name: "gender", label: "Gender", type: "text" },
      { name: "size", label: "Size", type: "text" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "tag", label: "Display Tag", type: "text" },
      { name: "status", label: "Listing Status", type: "select", options: ["PENDING", "APPROVED", "REJECTED", "ADOPTED"] },
    ]
  },
  adoptionapplication: {
    label: "Adoption Applications",
    columns: [
      { key: "fullName", label: "Applicant" },
      { key: "email", label: "Email" },
      { key: "adoptionPet.name", label: "Applied Pet" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Date", format: "date" },
    ],
    fields: [
      { name: "fullName", label: "Full Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "livingSituation", label: "Living Situation", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["PENDING", "APPROVED", "REJECTED"] },
    ]
  },
  rescuerequest: {
    label: "Rescue Requests",
    columns: [
      { key: "photoUrl", label: "Image", isImage: true },
      { key: "problemType", label: "Problem" },
      { key: "priority", label: "Priority" },
      { key: "status", label: "Status" },
      { key: "reporter.fullName", label: "Reporter" },
      { key: "incidentAddress", label: "Location" },
    ],
    fields: [
      { name: "problemType", label: "Problem Type", type: "text" },
      { name: "priority", label: "Priority", type: "select", options: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
      { name: "status", label: "Rescue Status", type: "select", options: ["PENDING", "ASSIGNED", "IN_PROGRESS", "PICKED", "VET", "RESCUED", "SHELTER", "COMPLETED", "CANCELLED"] },
      { name: "description", label: "Description", type: "textarea" },
      { name: "photoUrl", label: "Photo URL", type: "text" },
      { name: "incidentAddress", label: "Address", type: "text" },
    ]
  },
  donation: {
    label: "Donations Log",
    columns: [
      { key: "donorName", label: "Donor" },
      { key: "donorEmail", label: "Email" },
      { key: "amount", label: "Amount ($)" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Date", format: "date" },
    ],
    fields: [
      { name: "donorName", label: "Donor Name", type: "text" },
      { name: "donorEmail", label: "Donor Email", type: "email" },
      { name: "amount", label: "Amount", type: "number" },
      { name: "type", label: "Type", type: "text" },
      { name: "status", label: "Payment Status", type: "select", options: ["pending", "paid", "failed"] },
      { name: "message", label: "Message", type: "textarea" },
    ]
  },
  donationcampaign: {
    label: "Donation Campaigns",
    columns: [
      { key: "image", label: "Image", isImage: true },
      { key: "title", label: "Title" },
      { key: "type", label: "Type" },
      { key: "goalAmount", label: "Goal ($)" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Campaign Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "goalAmount", label: "Goal Amount", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["active", "paused", "completed"] },
    ]
  },
  donationsponsorpet: {
    label: "Sponsor Pets",
    columns: [
      { key: "image", label: "Image", isImage: true },
      { key: "name", label: "Name" },
      { key: "breed", label: "Breed" },
      { key: "age", label: "Age" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "breed", label: "Breed", type: "text" },
      { name: "age", label: "Age", type: "text" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "story", label: "Story", type: "textarea" },
      { name: "monthlySponsorshipAmount", label: "Monthly $", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["needs_sponsor", "sponsored"] },
    ]
  },
  communitypost: {
    label: "Community Posts",
    columns: [
      { key: "image", label: "Image", isImage: true },
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "author.fullName", label: "Author" },
      { key: "createdAt", label: "Posted At", format: "date" },
    ],
    fields: [
      { name: "title", label: "Post Title", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "content", label: "Content", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
    ]
  }
};

const getNestedValue = (obj, path) => {
  if (!obj || !path) return "—";
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj) ?? "—";
};

export default function ManageModelPage() {
  const { model } = useParams();
  const navigate = useNavigate();
  const config = MODEL_CONFIG[model?.toLowerCase()] || null;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (config) fetchRecords();
  }, [model, page]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/data/${model}?page=${page}&q=${searchTerm}`);
      if (res.data.success) {
        setData(res.data.data.records);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/admin/data/${model}/${id}`);
      if (res.data.success) {
        toast.success("Record deleted");
        fetchRecords();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const apiCall = selectedItem?.id 
        ? api.patch(`/admin/data/${model}/${selectedItem.id}`, formData)
        : api.post(`/admin/data/${model}`, formData);
      
      const res = await apiCall;
      if (res.data.success) {
        toast.success(selectedItem?.id ? "Updated" : "Created");
        setIsModalOpen(false);
        fetchRecords();
      }
    } catch (err) {
      toast.error("Save failed. Verify required fields and formatting.");
    }
  };

  if (!config) return <div className="p-10 text-center">Invalid Model Selection</div>;

  return (
    <div className="relative pt-6 pb-20">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/15 to-[#8b6b4c]/10 rounded-full blur-[150px] opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/admin/data")}
              className="p-2.5 rounded-xl bg-white/60 hover:bg-white/90 border border-[#8b6b4c]/30 text-[#2f3e2c] transition shadow-md"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#2f3e2c]">{config.label} Management</h1>
              <p className="text-sm text-[#6b7d67]">Database CRUD Operations</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7d67]" size={18} />
              <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] w-full md:w-64"
              />
            </form>
            <button 
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition active:scale-95"
            >
              <Plus size={18} />
              Add Record
            </button>
          </div>
        </div>

        {/* Table Rendering */}
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2f3e2c]/5 border-b border-[#8b6b4c]/10">
                  {config.columns.map(col => (
                    <th key={col.key} className="py-4 px-6 text-[#2f3e2c] font-bold text-sm uppercase tracking-wider">{col.label}</th>
                  ))}
                  <th className="py-4 px-6 text-[#2f3e2c] font-bold text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-[#8b6b4c]/5">
                      {Array(config.columns.length + 1).fill(0).map((__, j) => (
                        <td key={j} className="py-4 px-6"><div className="h-4 bg-[#6b7d67]/10 rounded w-full"></div></td>
                      ))}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="py-12 text-center text-[#6b7d67]">No records found.</td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-[#8b6b4c]/10 hover:bg-white/40 transition-colors group"
                    >
                      {config.columns.map(col => {
                        const rawValue = getNestedValue(item, col.key);

                        return (
                          <td key={col.key} className="py-4 px-6 text-[#2f3e2c]">
                            {col.isImage ? (
                                <div className="w-12 h-12 rounded-lg bg-[#2f3e2c]/5 border border-[#8b6b4c]/20 overflow-hidden">
                                  {rawValue !== "—" ? (
                                    <img 
                                      src={rawValue.startsWith('http') ? rawValue : `http://localhost:5000${rawValue}`} 
                                      alt="Thumbnail" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=No+Img"; }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#6b7d67]">No IMG</div>
                                  )}
                                </div>
                            ) : (
                              <div className="max-w-[200px] truncate" title={String(rawValue)}>
                                {col.format === "date" 
                                  ? new Date(rawValue).toLocaleDateString() 
                                  : String(rawValue)}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl bg-white/60 border border-[#8b6b4c]/20 disabled:opacity-30 text-[#2f3e2c]"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#2f3e2c] font-bold">Page {page} of {pagination.totalPages}</span>
            <button 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl bg-white/60 border border-[#8b6b4c]/20 disabled:opacity-30 text-[#2f3e2c]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition text-[#2f3e2c]"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-[#2f3e2c] mb-6">
                {selectedItem ? "Update Record" : "Create New Record"}
              </h2>

              <DataForm 
                fields={config.fields} 
                initialData={selectedItem} 
                onSave={handleSave} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataForm({ fields, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map(field => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4e5f4a] flex items-center gap-1">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>
          
          {field.type === "select" ? (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              className="w-full px-4 py-3 bg-[#2f3e2c]/5 border border-[#8b6b4c]/20 rounded-xl outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium"
            >
              <option value="">Select Option</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              value={formData[field.name] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              rows={4}
              className="w-full px-4 py-3 bg-[#2f3e2c]/5 border border-[#8b6b4c]/20 rounded-xl outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium resize-none"
            />
          ) : (
            <input 
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              className="w-full px-4 py-3 bg-[#2f3e2c]/5 border border-[#8b6b4c]/20 rounded-xl outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium"
            />
          )}
        </div>
      ))}

      <div className="pt-6 flex gap-3">
        <button 
          type="submit"
          className="flex-1 py-3.5 bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition active:scale-95"
        >
          {initialData ? "Save Changes" : "Create Record"}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 bg-[#2f3e2c]/5 text-[#4e5f4a] font-bold rounded-xl hover:bg-[#2f3e2c]/10 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
