import React from 'react';
import { useStore } from '../../lib/store';
import { Plus, Compass, Download, Home, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ServerSidebar = () => {
  const { servers, activeServerId, setActiveServer } = useStore();

  return (
    <div className="w-[84px] bg-[#050506] flex flex-col items-center py-6 space-y-4 h-full border-r border-white/[0.03] z-[100]">
      {/* Home / DMs */}
      <button 
        onClick={() => setActiveServer(null)}
        className={cn(
          "group relative flex items-center justify-center w-14 h-14 transition-all duration-500",
          !activeServerId 
            ? "rounded-2xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
            : "rounded-[24px] bg-white/[0.03] text-[#B5BAC1] hover:rounded-2xl hover:bg-neon-blue hover:text-black hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
        )}
      >
        <Zap size={24} className={cn("transition-transform duration-500 group-hover:scale-110", !activeServerId ? "fill-current" : "")} />
        {!activeServerId && (
          <div className="absolute -left-3 w-1.5 h-10 bg-white rounded-r-full shadow-[0_0_15px_white]" />
        )}
      </button>

      <div className="w-10 h-px bg-white/[0.05] mx-auto my-2" />

      {/* Servers */}
      <div className="flex-1 flex flex-col items-center space-y-4 overflow-y-auto no-scrollbar w-full">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className="group relative flex items-center justify-center w-14 h-14 transition-all duration-500 w-full"
          >
            {activeServerId === server.id && (
              <div className="absolute -left-0 w-1.5 h-10 bg-neon-blue rounded-r-full shadow-[0_0_15px_#00E5FF]" />
            )}
            <div className={cn(
              "w-14 h-14 transition-all duration-500 overflow-hidden flex items-center justify-center",
              activeServerId === server.id 
                ? "rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] ring-2 ring-neon-blue/30" 
                : "rounded-[24px] bg-white/[0.03] group-hover:rounded-2xl group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:ring-1 group-hover:ring-white/20"
            )}>
              {server.icon ? (
                <img src={server.icon} alt={server.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" title={server.name} />
              ) : (
                <span className="text-xs font-black uppercase tracking-tighter text-white opacity-60 group-hover:opacity-100">{server.name.substring(0, 2)}</span>
              )}
            </div>
          </button>
        ))}

        {/* Actions */}
        <button className="group flex items-center justify-center w-14 h-14 rounded-[24px] hover:rounded-2xl transition-all duration-500 bg-white/[0.02] border border-dashed border-white/10 hover:border-neon-green hover:bg-neon-green/5 text-[#4E5058] hover:text-neon-green">
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
        
        <button className="group flex items-center justify-center w-14 h-14 rounded-[24px] hover:rounded-2xl transition-all duration-500 bg-white/[0.02] border border-white/5 hover:border-neon-purple hover:bg-neon-purple/5 text-[#4E5058] hover:text-neon-purple">
          <Compass size={24} className="group-hover:scale-110 transition-transform duration-500" />
        </button>
      </div>

      <button className="group flex items-center justify-center w-14 h-14 rounded-[24px] hover:rounded-2xl transition-all duration-500 bg-white/[0.02] border border-white/5 hover:border-white/20 text-[#4E5058] hover:text-white mb-2">
        <Download size={20} />
      </button>
    </div>
  );
};
