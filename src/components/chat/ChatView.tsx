import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { Message } from '../../lib/types';
import { Hash, Volume2, Bell, Pin, Users, Search, Inbox, HelpCircle, PlusCircle, Gift, Sticker, Smile, X, Send, Cpu, LayoutGrid, Terminal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MessageItem } from './MessageItem';
import { eventBus } from '../../lib/event-bus';
import { VoiceChannelView } from './VoiceChannelView';
import { cn } from '../../lib/utils';

export const ChatView = () => {
  const { servers, activeServerId, activeChannelId, messages, addMessage, currentUser, typingUsers, setRightSidebarView, rightSidebarView } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeServer = servers.find(s => s.id === activeServerId);
  const activeChannel = activeServer?.categories
    .flatMap(c => c.channels)
    .find(ch => ch.id === activeChannelId);

  const channelMessages = messages[activeChannelId || ''] || [];
  const currentTyping = Array.from(typingUsers[activeChannelId || ''] || [])
    .filter(uid => uid !== currentUser.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChannelId) return;

    const newMessage = {
      id: uuidv4(),
      channelId: activeChannelId,
      authorId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toISOString(),
      replyToId: replyingTo?.id,
    };

    addMessage(activeChannelId, newMessage);
    eventBus.emit('MESSAGE_CREATED', { channelId: activeChannelId, message: newMessage });
    
    setInputValue('');
    setReplyingTo(null);
    eventBus.emit('TYPING_STOP', { channelId: activeChannelId, userId: currentUser.id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (activeChannelId) {
      if (e.target.value.length > 0) {
        eventBus.emit('TYPING_START', { channelId: activeChannelId, userId: currentUser.id });
      } else {
        eventBus.emit('TYPING_STOP', { channelId: activeChannelId, userId: currentUser.id });
      }
    }
  };

  if (!activeChannel) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0B] text-center p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 via-transparent to-neon-purple/5 opacity-50" />
      <div className="relative z-10 animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 mx-auto shadow-2xl">
          <Terminal size={40} className="text-[#4E5058] opacity-20" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">System Standby</h2>
        <p className="text-[#4E5058] max-w-sm font-bold uppercase tracking-[0.2em] text-[10px] leading-loose">
          Awaiting input synchronization. Select a node from the sidebar to establish a secure uplink.
        </p>
      </div>
    </div>
  );

  if (activeChannel.type === 'voice') {
    return <VoiceChannelView channelId={activeChannel.id} channelName={activeChannel.name} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0B] h-full relative overflow-hidden">
      {/* Header - Transparent Glass */}
      <div className="h-16 flex items-center px-8 border-b border-white/[0.03] bg-white/[0.01] backdrop-blur-2xl z-50 flex-shrink-0">
        <div className="flex items-center flex-1 gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
            {activeChannel.type === 'announcement' ? <Bell size={18} className="text-neon-blue" /> : <Hash size={18} className="text-neon-blue" />}
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight leading-none uppercase">{activeChannel.name}</h3>
            {activeChannel.topic && (
              <div className="text-[10px] text-[#4E5058] font-black uppercase tracking-widest mt-1">
                {activeChannel.topic}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[#4E5058]">
          <button className="hover:text-neon-blue transition-colors"><Bell size={20} /></button>
          <button 
            onClick={() => setRightSidebarView('details')}
            className={cn("hover:text-neon-blue transition-colors", rightSidebarView === 'details' && "text-neon-blue")}
          >
            <Pin size={20} />
          </button>
          <button 
            onClick={() => setRightSidebarView('members')}
            className={cn("hover:text-neon-blue transition-colors", rightSidebarView === 'members' && "text-neon-blue")}
          >
            <Users size={20} />
          </button>
          <div className="h-6 w-px bg-white/5 mx-2" />
          <div className="relative group">
            <input 
              type="text" 
              placeholder="GLOBAL SEARCH" 
              className="bg-white/[0.02] border border-white/[0.05] text-[10px] font-black py-2 px-4 rounded-xl w-40 focus:w-64 focus:border-neon-blue/30 focus:bg-white/[0.04] transition-all outline-none text-white placeholder-[#4E5058] uppercase tracking-widest"
            />
            <Search size={14} className="absolute right-3 top-2.5 opacity-40 group-focus-within:text-neon-blue group-focus-within:opacity-100 transition-all" />
          </div>
          <button className="hover:text-white transition-colors"><Inbox size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-8 pt-8 space-y-1 custom-scrollbar relative">
        {/* Background Grids for Tech Feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
        
        <div className="flex flex-col justify-end min-h-full pb-10">
          {/* Futuristic Start Marker */}
          <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
              <Cpu size={36} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            <h1 className="text-white text-5xl font-black tracking-tighter mb-4 leading-none uppercase">
              Node Established: <span className="text-neon-blue">#{activeChannel.name}</span>
            </h1>
            <p className="text-[#4E5058] font-bold uppercase tracking-[0.3em] text-[11px] leading-loose max-w-lg">
              Encryption active. End-to-end synchronization verified. Beginning log stream for terminal #{activeChannel.id.slice(-4)}.
            </p>
            <div className="h-px w-full bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent mt-10" />
          </div>

          <div className="space-y-1">
            {channelMessages.map((msg, i) => (
              <MessageItem 
                key={msg.id} 
                message={msg} 
                onReply={(m) => setReplyingTo(m)}
                isCompact={i > 0 && channelMessages[i-1].authorId === msg.authorId && (new Date(msg.timestamp).getTime() - new Date(channelMessages[i-1].timestamp).getTime() < 300000)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input - The "Command Bar" */}
      <div className="px-10 pb-10 pt-4 flex-shrink-0 z-50">
        <div className={cn(
          "bg-[#0A0A0B] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 group focus-within:border-neon-blue/30 focus-within:shadow-[0_0_50px_rgba(0,229,255,0.05)] shadow-2xl relative",
          replyingTo && "rounded-t-none"
        )}>
          {replyingTo && (
            <div className="absolute top-0 left-0 right-0 -translate-y-full bg-white/[0.02] backdrop-blur-xl border-x border-t border-white/5 px-6 py-3 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-neon-blue rounded-full" />
                <span className="text-[10px] font-black text-[#4E5058] uppercase tracking-widest">In Response To:</span>
                <span className="text-xs text-white/60 font-medium italic truncate max-w-md">{replyingTo.content}</span>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-pink hover:text-white transition-all group"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center px-6 py-4 gap-4">
            <button className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#4E5058] hover:bg-neon-blue hover:text-black transition-all transform active:scale-90">
              <PlusCircle size={24} />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`COMMAND TRANSMISSION TO #${activeChannel.name.toUpperCase()}`}
              className="flex-1 bg-transparent text-white py-2 outline-none placeholder-[#4E5058] font-bold text-sm tracking-tight"
            />

            <div className="flex items-center gap-2 text-[#4E5058]">
              <button className="p-2 hover:text-neon-purple transition-all"><Gift size={20} /></button>
              <button className="p-2 hover:text-neon-pink transition-all"><Sticker size={20} /></button>
              <button className="p-2 hover:text-neon-green transition-all"><Smile size={20} /></button>
              <div className="w-px h-6 bg-white/5 mx-2" />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  inputValue.trim() ? "bg-neon-blue text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]" : "bg-white/[0.02] text-[#4E5058]"
                )}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Typing indicator - Futuristic */}
        <div className="h-6 mt-3 px-6">
          {currentTyping.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-neon-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-neon-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-neon-green rounded-full animate-bounce" />
              </div>
              <div className="text-[9px] font-black text-neon-green uppercase tracking-[0.2em]">
                {currentTyping.length === 1 ? 'Incoming Data Stream...' : 'Multiple Data Streams Detected...'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
