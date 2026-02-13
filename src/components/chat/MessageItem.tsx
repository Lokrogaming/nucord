import React, { useMemo, useState } from 'react';
import { Message } from '../../lib/types';
import { useStore } from '../../lib/store';
import { format } from 'date-fns';
import { Smile, Reply, Edit, Trash2, Pin, Clock } from 'lucide-react';
import { eventBus } from '../../lib/event-bus';
import { cn } from '../../lib/utils';

interface MessageItemProps {
  message: Message;
  isCompact?: boolean;
  onReply?: (msg: Message) => void;
}

const USERS_MOCK: Record<string, any> = {
  '1': { username: 'Andri', avatar: null, color: '#00E5FF' },
  '2': { username: 'Nelly', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nelly', color: '#FF0055' },
  '3': { username: 'CyborgBot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyborg', color: '#7000FF', isBot: true },
  '4': { username: 'Ghosty', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghosty', color: '#00FF94' },
};

export const MessageItem = ({ message, isCompact, onReply }: MessageItemProps) => {
  const currentUser = useStore(s => s.currentUser);
  const toggleReaction = useStore(s => s.toggleReaction);
  const togglePinMessage = useStore(s => s.togglePinMessage);
  const messages = useStore(s => s.messages[message.channelId] || []);
  
  const isMe = message.authorId === currentUser.id;

  const replyToMessage = useMemo(() => {
    if (!message.replyToId) return null;
    return messages.find(m => m.id === message.replyToId);
  }, [message.replyToId, messages]);

  const author = USERS_MOCK[message.authorId] || { username: 'Unknown', avatar: null, color: '#FFFFFF' };
  const replyAuthor = replyToMessage ? (USERS_MOCK[replyToMessage.authorId] || { username: 'Unknown' }) : null;
  const [pickerOpen, setPickerOpen] = useState(false);

  const reactionSummary = useMemo(() => {
    const reactions = message.reactions || [];
    return reactions
      .map((r) => ({
        emoji: r.emoji,
        count: r.userIds.length,
        reacted: r.userIds.includes(currentUser.id),
      }))
      .sort((a, b) => b.count - a.count);
  }, [message.reactions, currentUser.id]);

  const quickEmojis = ['😂', '👍', '❤️', '🎉', '😮', '👀', '🔥', '✅'];

  const onReact = (emoji: string) => {
    toggleReaction(message.channelId, message.id, emoji, currentUser.id);
    eventBus.emit('REACTION_TOGGLED', { channelId: message.channelId, messageId: message.id, emoji, userId: currentUser.id });
    setPickerOpen(false);
  };
  
  return (
    <div className={cn(
      "group relative flex flex-col px-6 transition-all duration-300 w-full mb-1",
      isMe ? "items-end" : "items-start",
      message.isPinned && !isMe ? "bg-neon-blue/[0.03] border-l-2 border-neon-blue shadow-[inset_10px_0_20px_-10px_rgba(0,229,255,0.1)]" : "hover:bg-white/[0.01]",
      message.isPinned && isMe ? "bg-neon-blue/[0.03] border-r-2 border-neon-blue shadow-[inset_-10px_0_20px_-10px_rgba(0,229,255,0.1)]" : ""
    )}>
      {replyToMessage && (
        <div className={cn(
          "flex items-center gap-3 mb-1 mt-4 opacity-40 hover:opacity-100 transition-opacity cursor-pointer",
          isMe ? "mr-4 flex-row-reverse" : "ml-12"
        )}>
          <div className={cn(
            "w-8 h-4 border-white/20 rounded-tl-xl -mb-2",
            isMe ? "border-r border-t rounded-tr-xl rounded-tl-none" : "border-l border-t"
          )} />
          <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05]">
            <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: replyAuthor?.color }}>
              {replyAuthor?.username}
            </span>
            <span className="text-[11px] text-[#B5BAC1] truncate max-w-[300px] italic font-medium">
              {replyToMessage.content}
            </span>
          </div>
        </div>
      )}

      <div className={cn(
        "flex max-w-[85%] gap-4",
        isMe ? "flex-row-reverse" : "flex-row",
        !replyToMessage && !isCompact && "mt-6",
        isCompact && "mt-1"
      )}>
        {/* Avatar Area */}
        <div className="flex-shrink-0 w-12 flex justify-center mt-1">
          {!isCompact ? (
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-[#1E1F22] p-[2px] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-[inherit] overflow-hidden bg-[#0A0A0B]">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.username} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-white" style={{ color: author.color }}>
                      {author.username[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green border-2 border-[#0A0A0B] rounded-lg shadow-sm" />
            </div>
          ) : (
            <div className="w-full text-[9px] font-black text-[#4E5058] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-6">
              {format(new Date(message.timestamp), 'HH:mm')}
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className={cn("flex flex-col min-w-0", isMe ? "items-end" : "items-start")}>
          {!isCompact && (
            <div className={cn("flex items-center gap-3 mb-1.5", isMe && "flex-row-reverse")}>
              <span className="font-black text-white text-[13px] tracking-tight hover:text-neon-blue cursor-pointer transition-colors" style={{ color: author.color }}>
                {isMe ? 'YOU' : author.username}
              </span>
              {author.isBot && (
                <span className="bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[7px] px-1.5 py-0.5 rounded-md font-black tracking-[0.1em]">SYSTEM</span>
              )}
              <span className="text-[9px] text-[#4E5058] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={10} />
                {format(new Date(message.timestamp), 'HH:mm')}
              </span>
            </div>
          )}
          
          <div className={cn(
            "relative group/bubble px-5 py-3 rounded-3xl transition-all duration-300 text-[14px] leading-relaxed break-words font-medium tracking-tight selection:bg-neon-blue selection:text-black shadow-xl",
            isMe 
              ? "bg-neon-blue/10 border border-neon-blue/20 text-white rounded-tr-sm hover:border-neon-blue/40" 
              : "bg-white/[0.03] border border-white/[0.05] text-[#DBDEE1] rounded-tl-sm hover:bg-white/[0.05] hover:border-white/10",
            message.isPinned && "shadow-[0_0_20px_rgba(0,229,255,0.05)] border-neon-blue/40"
          )}>
            {message.content}
            
            {/* Timestamp on Bubble Corner */}
            {isCompact && (
              <div className={cn(
                "absolute bottom-2 text-[8px] font-black text-[#4E5058] opacity-0 group-hover/bubble:opacity-100 transition-opacity",
                isMe ? "-left-8" : "-right-8"
              )}>
                {format(new Date(message.timestamp), 'HH:mm')}
              </div>
            )}
          </div>

          {/* Reactions - Clean Chips */}
          {reactionSummary.length > 0 && (
            <div className={cn("mt-2 flex flex-wrap gap-1.5", isMe && "justify-end")}>
              {reactionSummary.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => onReact(r.emoji)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-all duration-300",
                    r.reacted 
                      ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_10px_rgba(0,229,255,0.1)]' 
                      : 'bg-white/[0.02] border-white/[0.05] text-[#B5BAC1] hover:bg-white/[0.04]'
                  )}
                >
                  <span className="text-xs leading-none">{r.emoji}</span>
                  <span className="font-black text-[9px] tracking-widest">{r.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hover Action Menu - Repositioned */}
        <div className={cn(
          "absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform flex items-center gap-0.5 bg-[#0A0A0B] border border-white/10 rounded-2xl p-0.5 shadow-2xl z-50",
          isMe ? "right-full mr-2 -translate-x-2 group-hover:translate-x-0" : "left-full ml-2 translate-x-2 group-hover:translate-x-0"
        )}>
          <div className="relative">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="w-8 h-8 rounded-xl hover:bg-white/5 text-[#4E5058] hover:text-neon-green flex items-center justify-center transition-all"
            >
              <Smile size={16} />
            </button>
            {pickerOpen && (
              <div className={cn(
                "absolute bottom-full mb-3 w-[200px] bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl p-2.5 flex flex-wrap gap-1.5 animate-in zoom-in-95 duration-200 backdrop-blur-3xl",
                isMe ? "right-0" : "left-0"
              )}>
                {quickEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => onReact(e)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 text-base flex items-center justify-center transition-all hover:scale-125 active:scale-90"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => onReply?.(message)}
            className="w-8 h-8 rounded-xl hover:bg-white/5 text-[#4E5058] hover:text-neon-blue flex items-center justify-center transition-all"
          >
            <Reply size={16} />
          </button>
          <button 
            onClick={() => togglePinMessage(message.channelId, message.id)}
            className={cn(
              "w-8 h-8 rounded-xl transition-all flex items-center justify-center",
              message.isPinned ? "text-neon-blue bg-neon-blue/10" : "text-[#4E5058] hover:text-white hover:bg-white/5"
            )}
          >
            <Pin size={16} />
          </button>
          <div className="w-px h-3 bg-white/5 mx-0.5" />
          <button className="w-8 h-8 rounded-xl hover:bg-white/5 text-[#4E5058] hover:text-white flex items-center justify-center transition-all">
            <Edit size={16} />
          </button>
          <button className="w-8 h-8 rounded-xl hover:bg-neon-pink/10 text-[#4E5058] hover:text-neon-pink flex items-center justify-center transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Visual Separator - only show on hover or between messages */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
