import React from 'react';
import { MapPin, Clock, Shield, ArrowRight, User, AlertTriangle } from 'lucide-react';
import RescueStatusBadge from './RescueStatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../../utils/rescueHelpers';
import { Link } from 'react-router-dom';
import { resolveApiMediaUrl } from '../../utils/helpers';

const RescueCard = ({ rescue, showActions = true, actionButton, linkTo }) => {
  if (!rescue) return null;

  const getPhotoUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400";
    return resolveApiMediaUrl(path);
  };

  const content = (
    <div className="flex flex-col sm:flex-row h-full">
      {/* Thumbnail Section */}
      <div className="relative h-48 sm:h-auto sm:w-48 xl:w-56 shrink-0 overflow-hidden">
        <img 
          src={getPhotoUrl(rescue.photoUrl)} 
          alt={rescue.problemType} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400";
          }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <PriorityBadge priority={rescue.priority} />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h3 className="text-lg font-bold text-[#2f3e2c] capitalize group-hover:text-[#5f7d5a] transition-colors">
                {rescue.problemType} Emergency
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#6b7d67] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#5f7d5a]" />
                {formatDate(rescue.createdAt)}
              </div>
            </div>
            <RescueStatusBadge status={rescue.status} />
          </div>
          
          <p className="text-sm text-[#4e5f4a] line-clamp-2 leading-relaxed mb-4">
            {rescue.description}
          </p>
          
          <div className="flex items-start gap-2 text-sm text-[#6b7d67]">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#8b6b4c]" />
            <span className="truncate font-medium">
              {rescue.incidentAddress || rescue.address || "Location Hidden"}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="mt-5 pt-4 border-t border-[#8b6b4c]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rescue.assignedVolunteer ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-lg border border-[#8b6b4c]/10 shadow-sm">
                  <User className="w-3.5 h-3.5 text-[#5f7d5a]" />
                  <span className="text-[11px] font-bold text-[#4e5f4a]">{rescue.assignedVolunteer.fullName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-lg border border-[#8b6b4c]/10 italic">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#8b6b4c] animate-pulse" />
                  <span className="text-[11px] font-semibold text-[#6b7d67]">Awaiting Hero</span>
                </div>
              )}
            </div>

            <div>
              {actionButton ? actionButton : (
                <span className="text-[#2f3e2c] font-bold text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  Mission Intel <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const cardStyle = "block relative rounded-2xl overflow-hidden group " + 
                    "bg-white/60 backdrop-blur-xl border border-white/60 " +
                    "shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_80px_rgba(95,125,90,0.18)] " +
                    "transition-all duration-500 transform hover:-translate-y-1";

  if (linkTo) {
    return (
      <Link to={linkTo} className={cardStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardStyle}>
      {content}
    </div>
  );
};

export default RescueCard;
