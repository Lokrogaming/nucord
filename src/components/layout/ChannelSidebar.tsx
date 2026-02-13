import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { ChevronDown, Hash, Volume2, Settings, Mic, Headphones, Plus, MessageSquare, Users, Sparkles, Command, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CreateChannelModal } from '../modals/CreateChannelModal';

export const ChannelSidebar = ({ onOpenSettings }: { onOpenSettings: (tab: 'profile' | 'server') => void }) => {
  const { servers, activeServerId, activeChannelId, setActiveChannel, currentUser, createChannel, dmGroups, createDM } = useStore();
  const [isCategoryCollapsed, setCategoryCollapsed] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createCategoryId, setCreateCategoryId] = useState<string | null>(null);

  const activeServer = servers.find(s => s.id === activeServerId);

  // Shared User Bar Component for consistency
  const UserBar = () => (
    <div className="bg-[#0A0A0B]/80 backdrop-blur-xl border-t border-white/[0.03] p-4 flex items-center justify-between group">
      <div 
        onClick={() => onOpenSettings('profile')}
        className="flex items-center gap-3 cursor-pointer min-w-0"
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple p-[1px]">
            <div className="w-full h-full rounded-[inherit] bg-[#0A0A0B] overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-black text-white">
                  {currentUser.username[0]}
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-lg border-[3px] border-[#0A0A0B]",
            currentUser.status === 'online' ? "bg-neon-green" : currentUser.status === 'dnd' ? "bg-neon-pink" : "bg-neon-blue"
          )} />
        </div>
        <div className="overflow-hidden">
          <div className="text-white text-sm font-black truncate tracking-tight group-hover:text-neon-blue transition-colors">
            {currentUser.username}
          </div>
          <div className="text-[#4E5058] text-[9px] font-black uppercase tracking-widest leading-none mt-1">
            #{currentUser.discriminator}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-lg hover:bg-white/5 text-[#B5BAC1] hover:text-white transition-all"><Settings size={16} /></button>
      </div>
    </div>
  );

  if (!activeServer) return (
    <div className="w-[260px] bg-[#0A0A0B] flex flex-col h-full overflow-hidden border-r border-white/[0.03]">
      <div className="h-16 px-6 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.01]">
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Communications</h2>
        <button 
          onClick={() => createDM(['1', '2'])}
          className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[#B5BAC1] hover:bg-neon-blue hover:text-black transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pt-6 px-3 space-y-6 no-scrollbar">
        {/* Special Offer Banner */}
        <div className="px-1 mb-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-purple/20 via-neon-pink/10 to-transparent border border-neon-purple/20 p-4 group cursor-pointer hover:border-neon-purple/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 blur-2xl rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-neon-purple animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Special Event</span>
              </div>
              <h4 className="text-xs font-black text-white mb-1 uppercase tracking-tight">Free Nitro Forever</h4>
              <p className="text-[9px] text-[#4E5058] font-black uppercase tracking-[0.2em] group-hover:text-neon-purple transition-colors">Claim Subscription Now //</p>
            </div>
          </div>
        </div>

        <div>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#B5BAC1] hover:bg-white/[0.03] hover:text-white transition-all group border border-transparent hover:border-white/[0.05]">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center group-hover:bg-neon-blue/10 group-hover:text-neon-blue transition-all">
              <Users size={20} />
            </div>
            <span className="font-black text-sm tracking-tight">Direct Terminal</span>
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="px-4 text-[9px] font-black text-[#4E5058] uppercase tracking-[0.2em] mb-4">Active Channels</div>
          
          {dmGroups?.map(group => (
            <button 
              key={group.id}
              onClick={() => setActiveChannel(group.id)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all border group",
                activeChannelId === group.id 
                  ? "bg-white/[0.05] border-white/[0.1] text-white shadow-xl" 
                  : "bg-transparent border-transparent text-[#4E5058] hover:text-[#B5BAC1] hover:bg-white/[0.02]"
              )}
            >
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  activeChannelId === group.id ? "bg-neon-purple/20 text-neon-purple shadow-[0_0_20px_rgba(112,0,255,0.2)]" : "bg-white/[0.03] text-[#4E5058]"
                )}>
                  <MessageSquare size={18} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green border-2 border-[#0A0A0B] rounded-full" />
              </div>
              <span className="truncate font-black text-sm tracking-tight">{group.name || `Uplink-${group.id.slice(-4)}`}</span>
            </button>
          ))}
        </div>
      </div>
      
      <UserBar />
    </div>
  );

  return (
    <div className="w-[260px] bg-[#0A0A0B] flex flex-col h-full overflow-hidden border-r border-white/[0.03]">
      <button 
        onClick={() => onOpenSettings('server')}
        className="h-16 px-6 border-b border-white/[0.03] flex items-center justify-between hover:bg-white/[0.02] transition-all group bg-white/[0.01]"
      >
        <div className="flex flex-col items-start min-w-0">
          <h2 className="text-white font-black text-sm truncate tracking-tight group-hover:text-neon-purple transition-colors">{activeServer.name}</h2>
          <div className="text-[9px] text-[#4E5058] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1">
            <Sparkles size={8} className="text-neon-purple" /> Verified Node
          </div>
        </div>
        <ChevronDown size={16} className="text-[#4E5058] group-hover:text-white transition-all" />
      </button>

      <div className="flex-1 overflow-y-auto pt-6 px-3 space-y-8 no-scrollbar">
        {/* Special Offer Banner */}
        <div className="px-1 mb-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-blue/20 via-neon-purple/10 to-transparent border border-neon-blue/20 p-4 group cursor-pointer hover:border-neon-blue/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/10 blur-2xl rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-neon-blue animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Limited Offer</span>
              </div>
              <h4 className="text-xs font-black text-white mb-1 uppercase tracking-tight">Free Nitro Forever</h4>
              <p className="text-[9px] text-[#4E5058] font-black uppercase tracking-[0.2em] group-hover:text-neon-blue transition-colors">Access Protocol // 0.00$</p>
            </div>
          </div>
        </div>

        {activeServer.categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center justify-between px-4 mb-2 group">
              <button 
                onClick={() => setCategoryCollapsed(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                className="flex items-center text-[10px] font-black text-[#4E5058] hover:text-[#B5BAC1] uppercase tracking-[0.2em] transition-all"
              >
                <ChevronDown size={10} className={cn("mr-2 transition-transform duration-300", isCategoryCollapsed[category.id] && "-rotate-90")} />
                {category.name}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateCategoryId(category.id);
                  setCreateOpen(true);
                }}
                className="w-5 h-5 rounded-md bg-white/[0.03] flex items-center justify-center text-[#4E5058] hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Plus size={12} />
              </button>
            </div>
            
            {!isCategoryCollapsed[category.id] && category.channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={cn(
                  "group flex items-center w-full px-4 py-2.5 rounded-xl transition-all border",
                  activeChannelId === channel.id 
                    ? "bg-white/[0.05] border-white/[0.1] text-white shadow-lg" 
                    : "bg-transparent border-transparent text-[#4E5058] hover:text-[#B5BAC1] hover:bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all",
                  activeChannelId === channel.id ? "bg-white/[0.05] text-white" : "text-[#4E5058] group-hover:text-[#B5BAC1]"
                )}>
                  {channel.type === 'voice' ? <Volume2 size={16} /> : <Hash size={16} />}
                </div>
                <span className="font-black text-sm tracking-tight">{channel.name}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity">
                  <Command size={12} />
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      <UserBar />

      <CreateChannelModal
        open={createOpen}
        serverName={activeServer.name}
        categoryName={activeServer.categories.find(c => c.id === createCategoryId)?.name || 'Category'}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          if (!activeServerId || !createCategoryId) return;
          const newId = createChannel(activeServerId, createCategoryId, input);
          setActiveChannel(newId);
        }}
      />
    </div>
  );
};
