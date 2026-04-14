import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RescueMapPanel from '../../components/rescue/RescueMapPanel';
import VolunteerInfoCard from '../../components/rescue/VolunteerInfoCard';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import RescueStatusBadge from '../../components/rescue/RescueStatusBadge';
import PriorityBadge from '../../components/rescue/PriorityBadge';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import api from '../../utils/api';
import { formatDate } from '../../utils/rescueHelpers';
import { ChevronLeft, MapPin, AlertTriangle, ShieldCheck, User, Stethoscope } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminRescueDetailsPage = () => {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [rescueRes, userRes] = await Promise.all([
        rescueService.getRescueDetails(id),
        api.get('/auth/users'),
      ]);

      if (rescueRes.data.success) {
        setRescue(rescueRes.data.data);
      } else {
        setRescue(null);
      }

      if (userRes.data.success) {
        setVolunteers(userRes.data.data.filter((u) => u.role === 'volunteer'));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load details');
      setRescue(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (volunteerId) => {
    if (!volunteerId || !rescue) return;
    try {
      const res = await rescueService.manualAssignRescue(rescue.id, { volunteerId });
      if (res.data.success) {
        toast.success('Volunteer assigned!');
        fetchDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  const apiBaseURL = api.defaults.baseURL.replace('/api', '');
  const getPhotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = apiBaseURL.endsWith('/') ? apiBaseURL.slice(0, -1) : apiBaseURL;
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) return <LoadingState />;
  if (!rescue) {
    return (
      <div className="min-h-screen pt-40 text-center px-4">
        <p className="text-[#6b7d67] mb-4">Rescue not found or you may not have access.</p>
        <Link to="/admin/rescues" className="text-[#5f7d5a] font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  const incidentLat = rescue.incidentLat ?? rescue.latitude;
  const incidentLng = rescue.incidentLng ?? rescue.longitude;
  const photoSrc = getPhotoUrl(rescue.photoUrl);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/rescues" className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/35 text-[#6b7d67] hover:text-[#2f3e2c] transition shadow-md">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#2f3e2c]">Rescue Profile #{rescue.id.split('-')[0]}</h1>
                <RescueStatusBadge status={rescue.status} />
                <PriorityBadge priority={rescue.priority} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl overflow-hidden flex flex-col sm:flex-row bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-xl">
              <div className="sm:w-2/5 h-64 sm:h-auto shrink-0 bg-white/30 flex items-center justify-center p-4">
                {photoSrc ? (
                  <img src={photoSrc} alt="Rescue" className="w-full h-full object-cover rounded-2xl shadow-md" />
                ) : (
                  <span className="text-sm text-[#6b7d67]">No photo</span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="mb-2">
                  <p className="text-xs font-bold text-[#6b7d67] uppercase">Problem Type</p>
                  <h2 className="text-2xl font-bold text-[#2f3e2c] capitalize">{rescue.problemType} condition</h2>
                </div>
                <div className="bg-white/55 border border-[#8b6b4c]/25 p-4 rounded-2xl my-4 text-sm italic font-medium leading-relaxed text-[#4e5f4a]">
                  "{rescue.description}"
                </div>
                <div className="flex flex-col gap-2 text-sm text-[#4e5f4a]">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-[#6b7d67]" />
                    <span className="font-semibold text-[#2f3e2c]">{rescue.incidentAddress || rescue.address}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-[#8b6b4c]" />
                    <span>Reported: {formatDate(rescue.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-6 sm:p-8 bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-lg">
              <h3 className="text-lg font-bold text-[#2f3e2c] mb-6">Master Dispatch Timeline</h3>
              <RescueTimeline currentStatus={rescue.status} />
            </div>

            <div className="rounded-3xl p-1 bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-lg">
              <RescueMapPanel
                height="h-80"
                className="rounded-[1.3rem] border-none"
                title="Location Dispatch"
                center={incidentLat != null ? [incidentLat, incidentLng] : null}
                markers={
                  incidentLat != null
                    ? [{ lat: incidentLat, lng: incidentLng, label: 'Incident Spot' }]
                    : []
                }
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl p-5 bg-white/55 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-md text-sm">
              <h3 className="flex items-center font-bold text-[#2f3e2c] mb-4 uppercase tracking-wider">
                <User className="w-4 h-4 mr-2 text-[#5f7d5a]" /> Original Reporter
              </h3>
              <div className="bg-white/55 rounded-2xl p-4 border border-[#8b6b4c]/25 font-bold text-[#2f3e2c]">
                {rescue.reporter?.fullName || 'Anonymous'}{' '}
                <p className="text-xs font-medium text-[#6b7d67]">{rescue.reporter?.email}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-xl">
              <div className="p-4 bg-white/45 border-b border-[#8b6b4c]/20 flex justify-between items-center text-sm font-bold uppercase text-[#2f3e2c] tracking-wider">
                <ShieldCheck className="w-4 h-4 mr-2 text-[#7fa37a]" /> Assigned Volunteer
              </div>
              <div className="p-4">
                {rescue.assignedVolunteer ? (
                  <>
                    <VolunteerInfoCard volunteer={rescue.assignedVolunteer} minimal />
                    <p className="text-xs text-[#6b7d67] mt-2">Use the list below to assign or change volunteer.</p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm font-bold text-[#2f3e2c] mb-1">Needs Assignment</p>
                    <select
                      onChange={(e) => handleAssign(e.target.value)}
                      className="w-full text-sm rounded-xl border border-[#8b6b4c]/35 bg-white/55 px-3 py-2.5 mt-2 transition focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30"
                      defaultValue=""
                    >
                      <option value="">Select Volunteer</option>
                      {volunteers.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {rescue.assignedVolunteer && (
                  <select
                    onChange={(e) => handleAssign(e.target.value)}
                    className="w-full text-sm rounded-xl border border-[#8b6b4c]/35 bg-white/55 px-3 py-2.5 mt-3 transition focus:outline-none focus:ring-2 focus:ring-[#7fa37a]/30"
                    defaultValue=""
                  >
                    <option value="">Reassign to…</option>
                    {volunteers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.fullName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="rounded-3xl p-5 bg-white/55 border border-[#8b6b4c]/35 flex items-center gap-3 text-[#5f7d5a]">
              <Stethoscope className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium text-[#4e5f4a]">
                Nearby vets receive in-app + email/SMS stubs when a rescue is created (see Transmission Logs).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueDetailsPage;
