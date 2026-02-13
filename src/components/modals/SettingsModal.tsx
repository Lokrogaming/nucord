import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { X, User, Shield, Bell, Monitor, Lock, Globe, LogOut, ChevronRight, Camera, Palette, Edit } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'server';
}

export const SettingsModal = ({ isOpen, onClose, initialTab = 'profile' }: SettingsModalProps) => {
  const { currentUser, updateCurrentUser, activeServerId, servers } = useStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [bannerColor, setBannerColor] = useState(currentUser.bannerColor || '#5865F2');

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    updateCurrentUser({ username, bio, bannerColor });
    onClose();
  };

  const activeServer = servers.find(s => s.id === activeServerId);

  return (
    <div className="fixed inset-0 z-[200] flex bg-[#1E1F22] overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Sidebar */}
      <div className="w-[280px] bg-[#2B2D31] flex flex-col pt-16 px-4 pb-4 overflow-y-auto no-scrollbar border-r border-white/5">
        <div className="space-y-0.5 mb-8">
          <div className="px-2 mb-2 text-xs font-bold text-[#949BA4] uppercase tracking-wider">User Settings</div>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full flex items-center px-3 py-2 rounded-md text-base transition-all duration-200 group",
              activeTab === 'profile' ? "bg-[#3F4147] text-white shadow-neon-blue/20 shadow-sm" : "text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]"
            )}
          >
            <User size={20} className={cn("mr-3", activeTab === 'profile' ? "text-neon-blue" : "group-hover:text-neon-blue")} />
            My Profile
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1] transition-all group">
            <Lock size={20} className="mr-3 group-hover:text-neon-pink" />
            Privacy & Safety
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1] transition-all group">
            <Shield size={20} className="mr-3 group-hover:text-neon-green" />
            Authorized Apps
          </button>
        </div>

        {activeServer && (
          <div className="space-y-0.5 mb-8">
            <div className="px-2 mb-2 text-xs font-bold text-[#949BA4] uppercase tracking-wider">Server Settings — {activeServer.name}</div>
            <button 
              onClick={() => setActiveTab('server')}
              className={cn(
                "w-full flex items-center px-3 py-2 rounded-md text-base transition-all duration-200 group",
                activeTab === 'server' ? "bg-[#3F4147] text-white shadow-neon-purple/20 shadow-sm" : "text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]"
              )}
            >
              <Palette size={20} className={cn("mr-3", activeTab === 'server' ? "text-neon-purple" : "group-hover:text-neon-purple")} />
              Overview
            </button>
            <button className="w-full flex items-center px-3 py-2 rounded-md text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1] transition-all group">
              <Monitor size={20} className="mr-3 group-hover:text-neon-blue" />
              Roles
            </button>
            <button className="w-full flex items-center px-3 py-2 rounded-md text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1] transition-all group">
              <Bell size={20} className="mr-3 group-hover:text-neon-pink" />
              Emojis
            </button>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/5">
          <button className="w-full flex items-center px-3 py-2 rounded-md text-[#F23F43] hover:bg-[#F23F43]/10 transition-all group">
            <LogOut size={20} className="mr-3" />
            Log Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#313338] relative overflow-y-auto px-10 pt-16 pb-20 scroll-smooth custom-scrollbar">
        <div className="max-w-[740px] mx-auto animate-in slide-in-from-right-4 duration-300">
          {activeTab === 'profile' ? (
            <div className="space-y-8">
              <h1 className="text-2xl font-bold text-white mb-6 neon-text">My Profile</h1>
              
              {/* Preview Card */}
              <div className="rounded-2xl overflow-hidden bg-[#18191C] border border-white/5 shadow-2xl">
                <div className="h-28 w-full transition-colors duration-500" style={{ backgroundColor: bannerColor }}>
                  <button className="absolute top-4 right-4 bg-black/40 p-2 rounded-full hover:bg-black/60 text-white transition-all">
                    <Edit size={16} />
                  </button>
                </div>
                <div className="px-4 pb-4 relative">
                  <div className="absolute -top-12 left-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-[6px] border-[#18191C] bg-[#18191C] overflow-hidden">
                        {currentUser.avatar ? (
                          <img src={currentUser.avatar} alt={username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neon-purple flex items-center justify-center text-3xl font-bold text-white">
                            {username[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer">
                        <Camera size={24} className="text-white" />
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-[#23A559] border-[4px] border-[#18191C] rounded-full" />
                    </div>
                  </div>
                  
                  <div className="mt-14 space-y-4">
                    <div className="p-4 rounded-xl bg-[#2B2D31]/50 border border-white/5 glass-morphism">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xl font-bold text-white flex items-center gap-1">
                            {username}
                            <span className="text-[#B5BAC1] font-normal">#{currentUser.discriminator}</span>
                          </div>
                          <div className="text-sm text-[#B5BAC1] mt-1 italic">{bio || 'No bio yet...'}</div>
                        </div>
                        <button className="px-4 py-1.5 bg-[#4E5058] hover:bg-[#6D6F78] text-white rounded-md text-sm font-medium transition-all shadow-sm">
                          Edit User Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#949BA4] uppercase tracking-wider">Display Name</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1E1F22] text-[#DBDEE1] p-3 rounded-md outline-none focus:ring-2 focus:ring-neon-blue transition-all border border-transparent focus:border-neon-blue/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#949BA4] uppercase tracking-wider">About Me</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-[#1E1F22] text-[#DBDEE1] p-3 rounded-md outline-none focus:ring-2 focus:ring-neon-pink transition-all border border-transparent focus:border-neon-pink/50 resize-none"
                    placeholder="Tell everyone about yourself!"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#949BA4] uppercase tracking-wider">Banner Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {['#5865F2', '#E91E63', '#00f2ff', '#bc13fe', '#ff007f', '#39ff14', '#F0B232', '#F23F43'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setBannerColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 shadow-lg",
                          bannerColor === color ? "border-white scale-110 shadow-white/20" : "border-transparent"
                        )}
                        style={{ backgroundColor: color, boxShadow: bannerColor === color ? `0 0 10px ${color}` : '' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-8 py-2 bg-neon-gradient text-white font-bold rounded-md hover:opacity-90 transition-all shadow-neon-blue/20 shadow-lg hover:shadow-neon-blue/40"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setUsername(currentUser.username);
                      setBio(currentUser.bio || '');
                      setBannerColor(currentUser.bannerColor || '#5865F2');
                    }}
                    className="px-4 py-2 text-[#B5BAC1] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h1 className="text-2xl font-bold text-white mb-6 neon-text">Server Settings — {activeServer?.name}</h1>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4 p-8 bg-[#2B2D31] rounded-2xl border border-white/5 glass-morphism">
                    <div className="w-32 h-32 rounded-3xl bg-neon-purple/20 border-2 border-dashed border-neon-purple flex flex-col items-center justify-center text-neon-purple group cursor-pointer hover:bg-neon-purple/30 transition-all">
                      {activeServer?.icon ? (
                        <img src={activeServer.icon} alt={activeServer.name} className="w-full h-full object-cover rounded-[inherit]" />
                      ) : (
                        <>
                          <Camera size={32} className="mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Upload Icon</span>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#949BA4] mb-4">Minimum size: 128x128</p>
                      <button className="px-4 py-2 bg-[#4E5058] hover:bg-[#6D6F78] text-white rounded font-medium text-sm transition-all shadow-md">
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#949BA4] uppercase tracking-wider">Server Name</label>
                    <input 
                      type="text" 
                      defaultValue={activeServer?.name}
                      className="w-full bg-[#1E1F22] text-[#DBDEE1] p-3 rounded-md outline-none focus:ring-2 focus:ring-neon-purple transition-all border border-transparent focus:border-neon-purple/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#949BA4] uppercase tracking-wider">Server Region</label>
                    <div className="w-full bg-[#1E1F22] text-[#DBDEE1] p-3 rounded-md flex justify-between items-center cursor-pointer border border-transparent hover:border-white/10 transition-all">
                      <span>US East</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4">
                <button className="px-8 py-2 neon-button font-bold rounded-md">
                  Update Server
                </button>
                <button className="px-4 py-2 text-[#F23F43] hover:underline">
                  Delete Server
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="fixed top-16 right-16 lg:right-32 animate-in fade-in duration-500 delay-150">
          <button 
            onClick={onClose}
            className="flex flex-col items-center group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#B5BAC1] flex items-center justify-center text-[#B5BAC1] group-hover:border-neon-pink group-hover:text-neon-pink group-hover:shadow-neon-pink/40 group-hover:shadow-lg transition-all duration-300">
              <X size={24} />
            </div>
            <span className="text-[13px] font-bold text-[#B5BAC1] mt-2 group-hover:text-neon-pink transition-colors">ESC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
