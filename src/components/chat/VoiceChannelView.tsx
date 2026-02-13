import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { Mic, MicOff, Headphones, EarOff, LogIn, LogOut, Volume2, Activity, Shield, Signal } from 'lucide-react';
import { cn } from '../../lib/utils';

const USERS_MOCK: Record<string, any> = {
  '1': { username: 'Andri', avatar: null, color: '#00E5FF' },
  '2': { username: 'Nelly', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nelly', color: '#FF0055' },
  '3': { username: 'CyborgBot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyborg', color: '#7000FF', isBot: true },
  '4': { username: 'Ghosty', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghosty', color: '#00FF94' },
};

type Props = { channelId: string; channelName: string };

export const VoiceChannelView = ({ channelId, channelName }: Props) => {
  const currentUser = useStore(s => s.currentUser);
  const voice = useStore(s => s.voice[channelId]);
  const voiceMember = useStore(s => s.voiceMember[currentUser.id] || { muted: false, deafened: false });
  const voiceJoin = useStore(s => s.voiceJoin);
  const voiceLeave = useStore(s => s.voiceLeave);
  const setVoiceMemberState = useStore(s => s.setVoiceMemberState);

  const connected = voice?.connectedUserIds || [];
  const speaking = new Set(voice?.speakingUserIds || []);

  const isInChannel = connected.includes(currentUser.id);

  // Local speaking simulation for YOU: hold Space to "speak"
  const setSpeaking = useStore(s => s.setSpeaking);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (!isInChannel) return;
      if (e.code === 'Space' && !holding && !voiceMember.muted && !voiceMember.deafened) {
        setHolding(true);
        setSpeaking(channelId, currentUser.id, true);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setHolding(false);
        setSpeaking(channelId, currentUser.id, false);
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [channelId, currentUser.id, holding, isInChannel, setSpeaking, voiceMember.deafened, voiceMember.muted]);

  const members = useMemo(() => {
    return connected
      .map((id) => ({ id, ...(USERS_MOCK[id] || { username: 'Unknown', avatar: null, color: '#FFFFFF' }) }))
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [connected]);

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0B] h-full overflow-hidden font-sans">
      {/* Top Header - Ultra Clean */}
      <div className="h-16 flex items-center px-8 border-b border-white/[0.03] bg-white/[0.01] backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center flex-1 gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
            <Signal size={20} className="text-neon-blue" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl tracking-tight leading-none">{channelName}</h3>
            <div className="text-[10px] text-[#4E5058] uppercase tracking-[0.2em] font-black mt-1">Primary Uplink // Active</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <Activity size={14} className="text-neon-green" />
            <span className="text-[10px] font-bold text-[#B5BAC1] uppercase">9ms Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-neon-purple" />
            <span className="text-[10px] font-bold text-[#B5BAC1] uppercase">Encrypted</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-blue/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <div className="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-black uppercase tracking-widest mb-4">
                Voice Protocol
              </div>
              <h1 className="text-white text-6xl font-black tracking-tighter leading-none mb-4">
                Channel <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">Interface</span>
              </h1>
              <p className="text-[#B5BAC1] text-lg max-w-xl font-medium leading-relaxed opacity-60">
                Connected to the digital void. Your transmission is live. Hold space to broadcast.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black text-[#4E5058] uppercase tracking-widest mb-1">Channel Status</div>
                <div className="text-2xl font-black text-white">{connected.length} <span className="text-[#4E5058]">/ ∞</span></div>
              </div>
              {isInChannel ? (
                <button
                  onClick={() => voiceLeave(channelId, currentUser.id)}
                  className="group px-8 py-4 rounded-2xl bg-neon-pink text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,0,85,0.3)] flex items-center gap-3 text-sm"
                >
                  <LogOut size={20} />
                  Terminate Connection
                </button>
              ) : (
                <button
                  onClick={() => voiceJoin(channelId, currentUser.id)}
                  className="group px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-3 text-base"
                >
                  <LogIn size={24} />
                  Initialize Link
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {members.length === 0 ? (
              <div className="col-span-full h-80 flex flex-col items-center justify-center border border-white/[0.03] rounded-[40px] text-[#4E5058] bg-white/[0.01] backdrop-blur-sm group">
                <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6 group-hover:border-neon-blue/30 transition-colors duration-500">
                  <Volume2 size={32} className="opacity-20 group-hover:text-neon-blue group-hover:opacity-100 transition-all duration-500" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Awaiting Signal...</p>
              </div>
            ) : (
              members.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "relative group rounded-[32px] p-8 transition-all duration-500 border border-white/[0.03] overflow-hidden animate-in zoom-in-95 duration-500",
                    speaking.has(m.id) 
                      ? "bg-white/[0.05] border-neon-green/40 shadow-[0_0_40px_rgba(0,255,148,0.1)] scale-105 z-10" 
                      : "bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                  )}
                >
                  {/* Avatar Section */}
                  <div className="relative flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className={cn(
                        "w-28 h-28 rounded-full border-[6px] transition-all duration-500",
                        speaking.has(m.id) ? "border-neon-green scale-110 shadow-[0_0_20px_rgba(0,255,148,0.4)]" : "border-[#0A0A0B]"
                      )}>
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-[#1E1F22] flex items-center justify-center text-4xl font-black text-white rounded-full">
                            {m.username[0]}
                          </div>
                        )}
                      </div>
                      
                      {speaking.has(m.id) && (
                        <div className="absolute -inset-2 rounded-full border border-neon-green animate-ping opacity-20" />
                      )}
                      
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl border-4 border-[#0A0A0B] flex items-center justify-center transition-all duration-300",
                        speaking.has(m.id) ? "bg-neon-green text-black scale-110" : "bg-[#23A559] text-white"
                      )}>
                        {speaking.has(m.id) ? <Volume2 size={20} className="animate-pulse" /> : <Mic size={18} />}
                      </div>
                    </div>

                    <div className="text-center w-full">
                      <div className="text-2xl font-black truncate tracking-tight text-white mb-1">
                        {m.username}
                      </div>
                      <div className={cn(
                        "text-[9px] font-black uppercase tracking-[0.3em]",
                        speaking.has(m.id) ? "text-neon-green" : "text-[#4E5058]"
                      )}>
                        {speaking.has(m.id) ? "Transmitting" : "Standby Mode"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Futuristic Bottom Controls */}
      <div className="px-12 py-8 border-t border-white/[0.03] bg-white/[0.01] backdrop-blur-2xl flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em] mb-2">Connection Mesh</span>
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", isInChannel ? "bg-neon-green animate-pulse shadow-[0_0_10px_#00FF94]" : "bg-[#F23F43]")} />
              <span className={cn("font-black text-xs uppercase tracking-widest", isInChannel ? "text-neon-green" : "text-[#F23F43]")}>
                {isInChannel ? "Protocol Active" : "Link Severed"}
              </span>
            </div>
          </div>
          
          {isInChannel && (
            <>
              <div className="h-10 w-px bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em] mb-2">Uplink Code</span>
                <span className="text-xs text-white font-mono opacity-80">AES-256 // VX-99</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={!isInChannel}
            onClick={() => setVoiceMemberState(currentUser.id, { muted: !voiceMember.muted })}
            className={cn(
              "w-16 h-16 rounded-[24px] border-2 flex items-center justify-center transition-all duration-500 transform active:scale-90",
              !isInChannel
                ? "bg-white/[0.02] border-white/[0.05] text-[#4E5058] cursor-not-allowed"
                : voiceMember.muted
                  ? "bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_30px_rgba(255,0,85,0.2)]"
                  : "bg-white/[0.03] border-white/10 text-white hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/5"
            )}
          >
            {voiceMember.muted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <button
            disabled={!isInChannel}
            onClick={() => setVoiceMemberState(currentUser.id, { deafened: !voiceMember.deafened })}
            className={cn(
              "w-16 h-16 rounded-[24px] border-2 flex items-center justify-center transition-all duration-500 transform active:scale-90",
              !isInChannel
                ? "bg-white/[0.02] border-white/[0.05] text-[#4E5058] cursor-not-allowed"
                : voiceMember.deafened
                  ? "bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_30px_rgba(112,0,255,0.2)]"
                  : "bg-white/[0.03] border-white/10 text-white hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/5"
            )}
          >
            {voiceMember.deafened ? <EarOff size={28} /> : <Headphones size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
};
