'use client';

import React, { useEffect, useState } from 'react';
import { ServerSidebar } from '../components/layout/ServerSidebar';
import { ChannelSidebar } from '../components/layout/ChannelSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { ChatView } from '../components/chat/ChatView';
import { useSocket } from '../hooks/useSocket';
import { botEngine } from '../services/bot-engine';
import { useStore } from '../lib/store';
import { Settings, Play, Square, RotateCcw } from 'lucide-react';
import { SettingsModal } from '../components/modals/SettingsModal';

export default function DiscordClone() {
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'server'>('profile');
  const resetData = useStore(state => state.resetData);

  // Initialize event listeners
  useSocket();

  const toggleBots = () => {
    if (isBotRunning) {
      botEngine.stop();
    } else {
      botEngine.start();
    }
    setIsBotRunning(!isBotRunning);
  };

  return (
    <div className="flex h-screen w-full bg-[#1E1F22] overflow-hidden text-[#DBDEE1] font-sans">
      {/* Control Overlay (for demo purposes) */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-[#2B2D31] p-2 rounded-lg shadow-2xl border border-[#3F4147]">
        <button 
          onClick={toggleBots}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-bold transition-colors ${isBotRunning ? 'bg-[#F23F43] text-white hover:bg-[#D83C3E]' : 'bg-[#23A559] text-white hover:bg-[#1A8D47]'}`}
          title={isBotRunning ? "Stop simulated activity" : "Start simulated activity"}
        >
          {isBotRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          <span>{isBotRunning ? "Stop Bots" : "Start Bots"}</span>
        </button>
        
        <button 
          onClick={() => resetData()}
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#4E5058] text-white hover:bg-[#6D6F78] text-sm font-bold transition-colors"
          title="Reset all data to default"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      <ServerSidebar />
      <ChannelSidebar onOpenSettings={(tab) => {
        setSettingsTab(tab);
        setSettingsOpen(true);
      }} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatView />
      </main>

      {isMemberListOpen && <RightSidebar />}

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        initialTab={settingsTab} 
      />
    </div>
  );
}
