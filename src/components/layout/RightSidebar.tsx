import React, { useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { 
  ShieldCheck, Zap, Bot, Circle, Info, Pin, Link as LinkIcon, 
  Image as ImageIcon, X, Mail, Calendar, Hash, ExternalLink, 
  ChevronRight, MessageSquare, UserPlus
} from 'lucide-react';

const USERS_MOCK: Record<string, any> = {
  '1': { 
    username: 'Andri', 
    avatar: null, 
    color: '#00E5FF', 
    bio: 'Lead Architect @ CyberSystems. Building the future of neural communication. "Latency is the enemy of progress."',
    joinedAt: 'Jan 15, 2026',
    roles: ['Admin', 'Developer'],
    bannerColor: '#00E5FF'
  },
  '2': { 
    username: 'Nelly', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nelly', 
    color: '#FF0055', 
    bio: 'Interface Designer & Reality Hacker. Making the void look beautiful. ✨',
    joinedAt: 'Feb 02, 2026',
    roles: ['Moderator', 'Designer'],
    bannerColor: '#FF0055'
  },
  '3': { 
    username: 'CyborgBot', 
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyborg', 
    color: '#7000FF', 
    isBot: true,
    bio: 'Primary Automated Logic Unit. Here to maintain protocol and optimize data streams.',
    joinedAt: 'Dec 12, 2025',
    roles: ['System Bot'],
    bannerColor: '#7000FF'
  },
  '4': { 
    username: 'Ghosty', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghosty', 
    color: '#00FF94', 
    bio: 'Sometimes I haunt the data streams. Don\'t mind me. 👻',
    joinedAt: 'Feb 09, 2026',
    roles: ['Member'],
    bannerColor: '#00FF94'
  },
};

export const RightSidebar = () => {
  const { servers, activeServerId, presences, selectedUserId, setSelectedUserId, activeChannelId, messages, rightSidebarView, setRightSidebarView } = useStore();
  
  const activeServer = servers.find(s => s.id === activeServerId);
  const activeChannel = activeServer?.categories
    .flatMap(c => c.channels)
    .find(ch => ch.id === activeChannelId);

  const pinnedMessages = useMemo(() => {
    return (messages[activeChannelId || ''] || []).filter(m => m.isPinned);
  }, [messages, activeChannelId]);

  // Dummy links and media for the UI
  const dummyLinks = [
    { id: '1', title: 'Cyber-Protocols 2026', url: 'https://cyber.net/v2', author: 'Andri' },
    { id: '2', title: 'Next.js 15 Documentation', url: 'https://nextjs.org/docs', author: 'Nelly' },
  ];

  const dummyMedia = [
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop',
  ];

  const selectedUser = selectedUserId ? (USERS_MOCK[selectedUserId] || USERS_MOCK['1']) : null;

  if (!activeServer) return null;

  const roles = [...activeServer.roles].sort((a, b) => a.position - b.position);

  return (
    <div className="w-[300px] bg-[#0A0A0B] flex flex-col h-full overflow-hidden border-l border-white/[0.03] animate-in slide-in-from-right duration-300">
      {/* Header Tabs */}
      <div className="h-16 px-4 border-b border-white/[0.03] flex items-center gap-2 bg-white/[0.01]">
        <button 
          onClick={() => { setRightSidebarView('members'); setSelectedUserId(null); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
            rightSidebarView === 'members' && !selectedUserId ? "bg-white/[0.05] text-white" : "text-[#4E5058] hover:text-[#B5BAC1]"
          )}
        >
          Members
        </button>
        <button 
          onClick={() => { setRightSidebarView('details'); setSelectedUserId(null); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
            rightSidebarView === 'details' && !selectedUserId ? "bg-white/[0.05] text-white" : "text-[#4E5058] hover:text-[#B5BAC1]"
          )}
        >
          Node Info
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {selectedUser ? (
          /* User Profile View */
          <div className="animate-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="h-24 w-full relative" style={{ backgroundColor: selectedUser.bannerColor }}>
              <button 
                onClick={() => setSelectedUserId(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="px-4 -mt-12 mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-[32px] border-[6px] border-[#0A0A0B] bg-[#0A0A0B] p-1">
                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-white/5">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white" style={{ color: selectedUser.color }}>
                        {selectedUser.username[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-lg bg-neon-green border-[4px] border-[#0A0A0B]" />
              </div>

              <div className="mt-4 p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-white tracking-tight">{selectedUser.username}</h3>
                  {selectedUser.isBot && <span className="bg-neon-blue/10 text-neon-blue text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">System</span>}
                </div>
                <div className="text-[10px] text-[#4E5058] font-black uppercase tracking-[0.2em]">#{selectedUserId?.slice(0,4)}</div>
                
                <div className="h-px w-full bg-white/5 my-4" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[9px] font-black text-[#B5BAC1] uppercase tracking-[0.2em] mb-2">About Me</h4>
                    <p className="text-xs text-[#DBDEE1] leading-relaxed font-medium">{selectedUser.bio}</p>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-black text-[#B5BAC1] uppercase tracking-[0.2em] mb-2">Registry Member Since</h4>
                    <div className="flex items-center gap-2 text-[#4E5058]">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">{selectedUser.joinedAt}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-black text-[#B5BAC1] uppercase tracking-[0.2em] mb-2">Assigned Roles</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.roles.map((r: string) => (
                        <span key={r} className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-black text-[#B5BAC1] uppercase tracking-widest">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <button className="w-full py-3 rounded-2xl bg-neon-blue text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neon-blue/20">
                    Send Direct Message
                  </button>
                  <button className="w-full py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.06] transition-all">
                    Add Sync Partner
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : rightSidebarView === 'members' ? (
          /* Members List View */
          <div className="p-3 pt-6 space-y-8 animate-in fade-in duration-300">
            {roles.map(role => {
              const roleMembers = activeServer.members.filter(m => m.roleIds.includes(role.id));
              if (roleMembers.length === 0) return null;

              return (
                <div key={role.id} className="space-y-3">
                  <div className="px-4 flex items-center justify-between">
                    <h3 className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.2em]">
                      {role.name} <span className="opacity-40 ml-1">// {roleMembers.length}</span>
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {roleMembers.map(member => {
                      const presence = presences[member.userId];
                      const user = USERS_MOCK[member.userId] || { username: 'Unknown' };

                      return (
                        <button
                          key={member.userId}
                          onClick={() => setSelectedUserId(member.userId)}
                          className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/[0.05]"
                        >
                          <div className="relative flex-shrink-0">
                            <div className={cn(
                              "w-9 h-9 rounded-[14px] bg-[#1E1F22] p-[1.5px] transition-transform duration-300 group-hover:scale-105",
                              presence?.status === 'online' ? "ring-1 ring-neon-green/20" : ""
                            )}>
                              <div className="w-full h-full rounded-[inherit] overflow-hidden bg-[#0A0A0B]">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-black text-white" style={{ color: role.color }}>
                                    {user.username[0]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-lg border-[3.5px] border-[#0A0A0B] shadow-sm",
                              presence?.status === 'online' ? "bg-neon-green" : presence?.status === 'dnd' ? "bg-neon-pink" : "bg-[#4E5058]"
                            )} />
                          </div>

                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black truncate tracking-tight text-white/80 group-hover:text-white transition-colors" style={{ color: presence?.status === 'online' ? undefined : '#4E5058' }}>
                                {user.username}
                              </span>
                              {user.isBot && <Bot size={10} className="text-neon-blue" />}
                            </div>
                            {presence?.activity && (
                              <div className="text-[9px] font-black uppercase tracking-widest text-[#4E5058] truncate group-hover:text-[#B5BAC1] transition-colors">
                                {presence.activity.name}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Node Info View (Pinned, Links, Media) */
          <div className="p-4 pt-6 space-y-8 animate-in fade-in duration-300">
            {/* Topic Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-neon-blue">
                <Info size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Node Protocol</h3>
              </div>
              <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <h4 className="text-sm font-black text-white mb-2 uppercase tracking-tight">#{activeChannel?.name}</h4>
                <p className="text-[11px] text-[#4E5058] font-medium leading-relaxed uppercase tracking-wider">
                  {activeChannel?.topic || 'No uplink mission defined for this coordinate.'}
                </p>
              </div>
            </div>

            {/* Pinned Messages */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-neon-purple">
                  <Pin size={14} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Sticky Data</h3>
                </div>
                <span className="text-[10px] font-black text-[#4E5058]">{pinnedMessages.length}</span>
              </div>
              
              <div className="space-y-3">
                {pinnedMessages.length === 0 ? (
                  <div className="p-8 rounded-3xl border border-dashed border-white/5 text-center">
                    <Pin size={20} className="mx-auto mb-2 opacity-10" />
                    <p className="text-[9px] font-black text-[#4E5058] uppercase tracking-widest">No Fixed Data</p>
                  </div>
                ) : (
                  pinnedMessages.map(msg => (
                    <div key={msg.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-neon-purple/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md bg-neon-purple/20 flex items-center justify-center text-[10px] font-black text-neon-purple uppercase">
                          {USERS_MOCK[msg.authorId]?.username[0]}
                        </div>
                        <span className="text-[10px] font-black text-white/60 group-hover:text-white transition-colors uppercase">{USERS_MOCK[msg.authorId]?.username}</span>
                      </div>
                      <p className="text-[11px] text-[#B5BAC1] line-clamp-2 font-medium">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Media Files */}
            <div>
              <div className="flex items-center justify-between mb-4 text-neon-pink">
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Media Cache</h3>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {dummyMedia.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 group cursor-pointer hover:scale-105 transition-all">
                    <img src={url} alt="media" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-neon-green">
                <LinkIcon size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Hyperlinks</h3>
              </div>
              <div className="space-y-2">
                {dummyLinks.map(link => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-neon-green/30 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
                      <ExternalLink size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-white truncate uppercase tracking-tight group-hover:text-neon-green transition-colors">{link.title}</div>
                      <div className="text-[9px] text-[#4E5058] font-black truncate tracking-widest">{link.url.replace('https://', '')}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Info */}
      {!selectedUser && (
        <div className="p-6 border-t border-white/[0.03] bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em]">Uplink Status</span>
            </div>
            <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">Optimized</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-[8px] font-black text-[#4E5058] uppercase tracking-widest mb-1">Enc Level</div>
              <div className="text-[10px] font-black text-white">X-99 // AES</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-[8px] font-black text-[#4E5058] uppercase tracking-widest mb-1">Node Sync</div>
              <div className="text-[10px] font-black text-white">99.8%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
