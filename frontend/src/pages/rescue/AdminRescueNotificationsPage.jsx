import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueTable from '../../components/rescue/RescueTable';
import LoadingState from '../../components/rescue/LoadingState';
import rescueService from '../../utils/rescueService';
import { formatDate } from '../../utils/rescueHelpers';
import { Mail, MessageSquare, Smartphone, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const AdminRescueNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time: refresh when new notifications come in
  useEffect(() => {
    if (!socket) return;
    socket.emit('join:admin');
    const handler = () => fetchNotifications();
    socket.on('rescue:new', handler);
    socket.on('rescue:status-updated', handler);
    socket.on('notification:new', handler);
    return () => {
      socket.off('rescue:new', handler);
      socket.off('rescue:status-updated', handler);
      socket.off('notification:new', handler);
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await rescueService.getAdminNotificationLogs();
      if (res.data.success) setNotifications(res.data.data);
    } catch (e) {
      console.error("Notification fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return <AlertCircle className="w-4 h-4" />;
      case 'STATUS_UPDATE': return <MessageSquare className="w-4 h-4" />;
      case 'SYSTEM': return <Mail className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (isRead) => isRead ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/65 backdrop-blur-md text-[#2f3e2c] border border-[#8b6b4c]/35 shadow-sm">
      <CheckCircle className="w-3 h-3 mr-1" /> Read
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/65 backdrop-blur-md text-[#5f7d5a] border border-[#5f7d5a]/35 shadow-sm">
      <XCircle className="w-3 h-3 mr-1" /> Unread
    </span>
  );

  const total = notifications.length;
  const unread = notifications.filter(n => !n.isRead).length;
  const read = notifications.filter(n => n.isRead).length;

  if (loading) return <LoadingState message="Loading delivery log..." />;

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          title="Delivery Log"
          description="Monitor automated system notifications sent to volunteers and pet owners."
          actions={
            <button onClick={fetchNotifications} className="p-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/30 text-[#6b7d67] hover:text-[#2f3e2c] transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Total Notifications" value={total} color="blue" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Read" value={read} color="green" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Unread" value={unread} color="red" />
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="p-4 border-b border-[#8b6b4c]/20 bg-white/35">
            <h3 className="font-bold text-[#2f3e2c]">Recent Transmission Logs</h3>
          </div>

          <RescueTable headers={['Log ID', 'Time Sent', 'Recipient', 'Type', 'Message', 'Status']}>
            {notifications.map((log) => (
              <tr key={log.id} className="hover:bg-white/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2f3e2c]">
                  {log.id.split('-')[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2f3e2c]">
                  {log.user?.fullName || log.userId?.split('-')[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                  <div className="flex items-center gap-2 bg-white/55 backdrop-blur-md inline-flex px-3 py-1 rounded-full border border-[#8b6b4c]/25 text-[#2f3e2c]">
                    {getChannelIcon(log.type)} {log.type?.replace(/_/g, ' ')}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#4e5f4a] max-w-xs truncate">
                  {log.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(log.isRead)}
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-[#6b7d67]">
                  No notifications have been sent yet.
                </td>
              </tr>
            )}
          </RescueTable>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueNotificationsPage;