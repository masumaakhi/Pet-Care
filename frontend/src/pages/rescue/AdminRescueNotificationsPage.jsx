import React, { useState } from 'react';
import SectionHeader from '../../components/rescue/SectionHeader';
import KPIStatCard from '../../components/rescue/KPIStatCard';
import RescueTable from '../../components/rescue/RescueTable';
import { notificationLogs } from '../../data/rescueMockData';
import { formatDate } from '../../utils/rescueHelpers';
import { Mail, MessageSquare, Smartphone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AdminRescueNotificationsPage = () => {
    
  const getChannelIcon = (channel) => {
      switch(channel) {
          case 'sms': return <MessageSquare className="w-4 h-4" />;
          case 'email': return <Mail className="w-4 h-4" />;
          case 'whatsapp': return <Smartphone className="w-4 h-4" />;
          case 'in_app': return <AlertCircle className="w-4 h-4" />;
          default: return <Mail className="w-4 h-4" />;
      }
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'delivered':
          case 'read':
            return (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-white/65 backdrop-blur-md text-[#2f3e2c]
                border border-[#8b6b4c]/35 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              >
                <CheckCircle className="w-3 h-3 mr-1" /> {status}
              </span>
            );
          case 'failed':
            return (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-white/65 backdrop-blur-md text-[#8b6b4c]
                border border-[#8b6b4c]/35 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              >
                <XCircle className="w-3 h-3 mr-1" /> failed
              </span>
            );
          default:
            return (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-white/65 backdrop-blur-md text-[#6b7d67]
                border border-[#8b6b4c]/35 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              >
                {status}
              </span>
            );
      }
  };

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader 
          title="Delivery Log" 
          description="Monitor automated system notifications sent to volunteers and pet owners."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Total Notifications" value="1,245" color="blue" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Delivery Rate" value="98.2%" color="green" trend="up" trendValue="+0.1%" />
          </div>
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
            <KPIStatCard title="Failed Deliveries" value="12" color="red" trend="down" trendValue="-3" />
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl
          border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="p-4 border-b border-[#8b6b4c]/20 bg-white/35">
            <h3 className="font-bold text-[#2f3e2c]">Recent Transmission Logs</h3>
          </div>

          <RescueTable headers={['Log ID', 'Time SENT', 'Recipient', 'Rescue Ref', 'Channel', 'Status', 'Error Log']}>
            {notificationLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2f3e2c] border-l-[3px] border-transparent">
                  {log.id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67]">
                  {formatDate(log.time)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2f3e2c]">
                  {log.recipient}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5f7d5a] hover:underline cursor-pointer">
                  {log.rescueId}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7d67] uppercase font-semibold">
                  <div
                    className="flex items-center gap-2 bg-white/55 backdrop-blur-md
                    w-auto inline-flex px-3 py-1 rounded-full
                    border border-[#8b6b4c]/25 text-[#2f3e2c]"
                  >
                    {getChannelIcon(log.channel)} {log.channel}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(log.status)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8b6b4c] font-medium">
                  {log.error || "-"}
                </td>
              </tr>
            ))}
          </RescueTable>
        </div>
      </div>
    </div>
  );
};

export default AdminRescueNotificationsPage;