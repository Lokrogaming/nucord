import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Hash, Volume2, Sparkles, Terminal } from 'lucide-react';
import { ChannelType } from '../../lib/types';
import { cn } from '../../lib/utils';

type Props = {
  open: boolean;
  serverName: string;
  categoryName: string;
  onClose: () => void;
  onCreate: (input: { name: string; type: ChannelType; topic?: string }) => void;
};

export const CreateChannelModal = ({ open, serverName, categoryName, onClose, onCreate }: Props) => {
  const [type, setType] = useState<ChannelType>('text');
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [open]);

  const canSubmit = name.trim().length >= 2;

  const onSubmit = () => {
    const clean = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    if (clean.length < 2) return;
    onCreate({ name: clean, type, topic: topic.trim() ? topic.trim() : undefined });
    setName('');
    setTopic('');
    setType('text');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-md animate-in fade-in duration-500" 
      />

      <div className="relative w-[500px] bg-[#0A0A0B] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Decorative Top Gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
        
        <div className="p-10">
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#4E5058] text-[9px] font-black uppercase tracking-widest mb-4">
                System Registry
              </div>
              <h2 className="text-white text-4xl font-black tracking-tighter leading-none">New <span className="text-neon-blue">Node</span></h2>
              <p className="text-[#4E5058] text-xs font-black uppercase tracking-[0.2em] mt-3">{serverName} // {categoryName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[#4E5058] hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-white/[0.02] border border-white/[0.05] rounded-[24px]">
              <button
                onClick={() => setType('text')}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 rounded-[20px] transition-all duration-500 font-black uppercase tracking-widest text-[10px]",
                  type === 'text' 
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "text-[#4E5058] hover:text-[#B5BAC1]"
                )}
              >
                <Terminal size={16} />
                Data Stream
              </button>
              <button
                onClick={() => setType('voice')}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 rounded-[20px] transition-all duration-500 font-black uppercase tracking-widest text-[10px]",
                  type === 'voice' 
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "text-[#4E5058] hover:text-[#B5BAC1]"
                )}
              >
                <Volume2 size={16} />
                Voice Link
              </button>
            </div>

            {/* Input Field */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em] ml-2">Identifier</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-neon-blue transition-colors">
                  {type === 'voice' ? <Volume2 size={18} /> : <Hash size={18} />}
                </div>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="enter-identifier..."
                  className="w-full bg-white/[0.02] border border-white/[0.05] text-white rounded-2xl py-5 pl-14 pr-6 outline-none placeholder-[#4E5058] font-black tracking-tight focus:border-neon-blue/30 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            {/* Topic Field */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em] ml-2">Description (Optional)</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="uplink-purpose..."
                className="w-full bg-white/[0.02] border border-white/[0.05] text-white rounded-2xl py-5 px-6 outline-none placeholder-[#4E5058] font-black tracking-tight focus:border-neon-blue/30 focus:bg-white/[0.04] transition-all"
              />
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div className="text-[9px] font-black text-[#4E5058] uppercase tracking-[0.3em]">
              Node Deployment Protocol
            </div>
            <button
              disabled={!canSubmit}
              onClick={onSubmit}
              className={cn(
                "px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 transform active:scale-95",
                canSubmit 
                  ? "bg-neon-blue text-black shadow-[0_0_40px_rgba(0,229,255,0.3)] hover:scale-105" 
                  : "bg-white/[0.02] border border-white/[0.05] text-[#4E5058] cursor-not-allowed"
              )}
            >
              Initialize Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
