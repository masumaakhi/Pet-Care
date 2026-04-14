import React from 'react';
import { TIMELINE_STAGES, getRescueTimelineIndex } from '../../utils/rescueHelpers';
import { Check } from 'lucide-react';

const RescueTimeline = ({ currentStatus, updates = [] }) => {
  const currentIndex = getRescueTimelineIndex(currentStatus);
  
  if (currentIndex < 0) {
    return (
      <div className="py-6 text-center text-sm font-semibold text-[#8b6b4c]">
        This rescue was cancelled.
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="relative">
        {/* Connection Line */}
        <div
          className="absolute left-0 top-1/2 -mt-px w-full h-1 lg:h-1.5
          bg-[#d9dfd7] rounded-full"
          aria-hidden="true"
        />
        
        <div className="relative flex justify-between">
          {TIMELINE_STAGES.map((step, stepIdx) => {
            const isCompleted = stepIdx < currentIndex;
            const isCurrent = stepIdx === currentIndex;
            
            return (
              <div key={step.id} className="relative flex flex-col items-center group">
                {/* Status Dot */}
                <div className="h-4 flex items-center mb-3 relative z-10 px-2 bg-transparent">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                    border transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.10)]
                      ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#5f7d5a]/70 via-[#7fa37a] to-[#8b6b4c] text-[#2f3e2c] border-[#d6e2d3]'
                          : isCurrent
                          ? 'bg-white/80 text-[#2f3e2c] border-[#7fa37a] backdrop-blur-md'
                          : 'bg-white/55 text-[#9aa39a] border-[#8b6b4c]/25'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{stepIdx + 1}</span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center mt-2">
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                      isCurrent
                        ? 'text-[#2f3e2c]'
                        : isCompleted
                        ? 'text-[#4e5f4a]'
                        : 'text-[#9aa39a]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {updates.length > 0 && (
        <div
          className="mt-12 rounded-3xl p-5
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/20
          backdrop-blur-2xl border border-[#8b6b4c]/35
          shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
        >
          <h4 className="text-sm font-bold text-[#2f3e2c] mb-4 uppercase tracking-wider">
            Activity Log
          </h4>

          <div className="flow-root">
            <ul className="-mb-8">
              {updates.map((update, eventIdx) => (
                <li key={eventIdx}>
                  <div className="relative pb-8">
                    {eventIdx !== updates.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#d9dfd7]"
                        aria-hidden="true"
                      />
                    ) : null}

                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className="h-8 w-8 rounded-full bg-white/75 flex items-center justify-center
                          ring-4 ring-white border border-[#8b6b4c]/20"
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-[#7fa37a]" />
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-[#4e5f4a]">{update.note}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-[#6b7d67]">
                          {new Date(update.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueTimeline;