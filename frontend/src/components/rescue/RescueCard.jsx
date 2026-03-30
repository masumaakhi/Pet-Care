import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import RescueStatusBadge from './RescueStatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../../utils/rescueHelpers';
import { Link } from 'react-router-dom';

const RescueCard = ({ rescue, showActions = true, actionButton, linkTo }) => {
  if (!rescue) return null;

  const content = (
    <>
      <div className="relative h-48 w-full overflow-hidden sm:h-auto sm:w-48 shrink-0">
        <img 
          src={rescue.image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400"} 
          alt="Rescue subject" 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
        <div className="absolute top-3 left-3 flex gap-2">
          <PriorityBadge priority={rescue.priority} />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#2f3e2c] capitalize leading-tight">
              {rescue.problemType} Pet Rescue
            </h3>
            <RescueStatusBadge status={rescue.status} />
          </div>
          
          <p className="mt-2 text-sm text-[#4e5f4a] line-clamp-2 leading-relaxed">
            {rescue.description}
          </p>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-[#6b7d67]">
            <div className="flex items-center gap-2 text-[#4e5f4a]">
              <MapPin className="w-4 h-4 text-[#5f7d5a]" />
              <span className="truncate">{rescue.location.address}</span>
            </div>

            {rescue.location.distance && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#2f3e2c]">{rescue.location.distance} away</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6b7d67]" />
              {formatDate(rescue.createdAt)}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="mt-5 pt-4 border-t border-[#8b6b4c]/20 flex items-center justify-between">
            <div className="flex -space-x-2">
              {rescue.assignedVolunteer ? (
                <div className="flex items-center text-sm font-medium text-[#4e5f4a]">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center
                    bg-white/60 text-[#2f3e2c] text-xs mr-2 shadow-sm"
                  >
                    {rescue.assignedVolunteer.name.charAt(0)}
                  </div>
                  {rescue.assignedVolunteer.name}
                </div>
              ) : (
                <span
                  className="text-sm font-medium text-[#2f3e2c]
                  bg-white/55 px-3 py-1 rounded-full border border-[#8b6b4c]/30"
                >
                  Needs Volunteer
                </span>
              )}
            </div>

            <div>
              {actionButton ? actionButton : (
                <button className="text-[#2f3e2c] font-semibold text-sm hover:text-[#5f7d5a] transition">
                  View Details &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const wrapperClass =
    "flex flex-col sm:flex-row rounded-3xl overflow-hidden group cursor-pointer " +
    "bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 " +
    "backdrop-blur-2xl border border-[#8b6b4c]/45 " +
    "shadow-[0_25px_80px_rgba(0,0,0,0.12)] hover:shadow-[0_55px_160px_rgba(95,125,90,0.35)] transition duration-500";

  if (linkTo) {
    return (
      <Link to={linkTo} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return (
    <div className={wrapperClass}>
      {content}
    </div>
  );
};

export default RescueCard;