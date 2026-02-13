import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Server, Message, Presence, Channel, DMGroup } from './types';
import { initialData } from './mock-data';
import { v4 as uuidv4 } from 'uuid';
import { eventBus } from './event-bus';

export interface VoiceMemberState {
  muted: boolean;
  deafened: boolean;
}

export interface VoiceChannelState {
  channelId: string;
  connectedUserIds: string[];
  speakingUserIds: string[];
}

interface AppState {
  currentUser: User;
  servers: Server[];
  messages: Record<string, Message[]>; // channelId -> Message[]
  presences: Record<string, Presence>; // userId -> Presence
  activeServerId: string | null;
  activeChannelId: string | null;
  typingUsers: Record<string, Set<string>>; // channelId -> Set of userIds
  voice: Record<string, VoiceChannelState>; // channelId -> voice state
  voiceMember: Record<string, VoiceMemberState>; // userId -> voice member state
  dmGroups: DMGroup[];
  selectedUserId: string | null;
  rightSidebarView: 'members' | 'details';
  
  // Actions
  setRightSidebarView: (view: 'members' | 'details') => void;
  setSelectedUserId: (id: string | null) => void;
  setActiveServer: (id: string | null) => void;
  setActiveChannel: (id: string | null) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  toggleReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  togglePinMessage: (channelId: string, messageId: string) => void;
  setPresence: (userId: string, presence: Presence) => void;
  setTyping: (channelId: string, userId: string, isTyping: boolean) => void;
  createChannel: (serverId: string, categoryId: string, channel: Pick<Channel, 'name' | 'type' | 'topic'>) => string;
  insertChannel: (serverId: string, categoryId: string, channel: Channel, broadcast?: boolean) => void;
  createDM: (memberIds: string[]) => string;
  voiceJoin: (channelId: string, userId: string, broadcast?: boolean) => void;
  voiceLeave: (channelId: string, userId: string, broadcast?: boolean) => void;
  setVoiceMemberState: (userId: string, updates: Partial<VoiceMemberState>, broadcast?: boolean) => void;
  setSpeaking: (channelId: string, userId: string, speaking: boolean) => void;
  resetData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: initialData.currentUser,
      servers: initialData.servers,
      messages: initialData.messages,
      presences: initialData.presences,
      activeServerId: initialData.servers[0].id,
      activeChannelId: initialData.servers[0].categories[0].channels[0].id,
      typingUsers: {},
      voice: {},
      voiceMember: {},
      dmGroups: [],
      selectedUserId: null,
      rightSidebarView: 'members',

      setRightSidebarView: (view) => set({ rightSidebarView: view }),
      setSelectedUserId: (id) => set({ selectedUserId: id }),
      setActiveServer: (id) => set({ activeServerId: id }),
      setActiveChannel: (id) => set({ activeChannelId: id }),
      
      updateCurrentUser: (updates) => set((state) => ({
        currentUser: { ...state.currentUser, ...updates }
      })),
      
      addMessage: (channelId, message) => set((state) => {
        const channelMessages = state.messages[channelId] || [];
        return {
          messages: {
            ...state.messages,
            [channelId]: [...channelMessages, message]
          }
        };
      }),

      updateMessage: (channelId, messageId, updates) => set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: (state.messages[channelId] || []).map(m => 
            m.id === messageId ? { ...m, ...updates, editedAt: new Date().toISOString() } : m
          )
        }
      })),

      deleteMessage: (channelId, messageId) => set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: (state.messages[channelId] || []).filter(m => m.id !== messageId)
        }
      })),

      toggleReaction: (channelId, messageId, emoji, userId) => set((state) => {
        const list = state.messages[channelId] || [];
        const next = list.map((m) => {
          if (m.id !== messageId) return m;
          const reactions = m.reactions ? [...m.reactions] : [];
          const idx = reactions.findIndex((r) => r.emoji === emoji);
          if (idx === -1) {
            reactions.push({ emoji, userIds: [userId] });
          } else {
            const setIds = new Set(reactions[idx].userIds);
            if (setIds.has(userId)) setIds.delete(userId);
            else setIds.add(userId);
            const userIds = Array.from(setIds);
            if (userIds.length === 0) reactions.splice(idx, 1);
            else reactions[idx] = { ...reactions[idx], userIds };
          }
          return { ...m, reactions };
        });
        return { messages: { ...state.messages, [channelId]: next } };
      }),

      togglePinMessage: (channelId, messageId) => set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: (state.messages[channelId] || []).map(m => 
            m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
          )
        }
      })),

      setPresence: (userId, presence) => set((state) => ({
        presences: { ...state.presences, [userId]: presence }
      })),

      setTyping: (channelId, userId, isTyping) => set((state) => {
        const channelTyping = new Set(state.typingUsers[channelId] || []);
        if (isTyping) channelTyping.add(userId);
        else channelTyping.delete(userId);
        return {
          typingUsers: { ...state.typingUsers, [channelId]: channelTyping }
        };
      }),

      insertChannel: (serverId, categoryId, channel, broadcast = false) => {
        set((state) => ({
          servers: state.servers.map((s) => {
            if (s.id !== serverId) return s;
            return {
              ...s,
              categories: s.categories.map((c) => {
                if (c.id !== categoryId) return c;
                const already = c.channels.some((ch) => ch.id === channel.id);
                if (already) return c;
                return { ...c, channels: [...c.channels, channel] };
              }),
            };
          }),
        }));
        if (broadcast) {
          eventBus.emit('CHANNEL_CREATED', { serverId, categoryId, channel });
        }
      },

      createChannel: (serverId, categoryId, channelInput) => {
        const id = `chan-${uuidv4()}`;
        const newChannel: Channel = {
          id,
          name: channelInput.name,
          type: channelInput.type,
          topic: channelInput.topic,
        };
        // Insert and broadcast
        useStore.getState().insertChannel(serverId, categoryId, newChannel, true);
        return id;
      },

      createDM: (memberIds) => {
        const id = `dm-${uuidv4()}`;
        const newDM: DMGroup = {
          id,
          memberIds,
        };
        set((state) => ({
          dmGroups: [...state.dmGroups, newDM]
        }));
        return id;
      },

      voiceJoin: (channelId, userId, broadcast = true) => set((state) => {
        const prev = state.voice[channelId] || { channelId, connectedUserIds: [], speakingUserIds: [] };
        if (prev.connectedUserIds.includes(userId)) return {};
        const next: VoiceChannelState = {
          ...prev,
          connectedUserIds: [...prev.connectedUserIds, userId],
        };
        if (broadcast) eventBus.emit('VOICE_JOIN', { channelId, userId });
        return { voice: { ...state.voice, [channelId]: next } };
      }),

      voiceLeave: (channelId, userId, broadcast = true) => set((state) => {
        const prev = state.voice[channelId];
        if (!prev) return {};
        const next: VoiceChannelState = {
          ...prev,
          connectedUserIds: prev.connectedUserIds.filter((id) => id !== userId),
          speakingUserIds: prev.speakingUserIds.filter((id) => id !== userId),
        };
        if (broadcast) eventBus.emit('VOICE_LEAVE', { channelId, userId });
        return { voice: { ...state.voice, [channelId]: next } };
      }),

      setVoiceMemberState: (userId, updates, broadcast = true) => set((state) => {
        const prev = state.voiceMember[userId] || { muted: false, deafened: false };
        const next = { ...prev, ...updates };
        if (broadcast) eventBus.emit('VOICE_UPDATE', { userId, updates: next });
        return { voiceMember: { ...state.voiceMember, [userId]: next } };
      }),

      setSpeaking: (channelId, userId, speaking) => set((state) => {
        const prev = state.voice[channelId] || { channelId, connectedUserIds: [], speakingUserIds: [] };
        const setIds = new Set(prev.speakingUserIds);
        if (speaking) setIds.add(userId);
        else setIds.delete(userId);
        const next: VoiceChannelState = { ...prev, speakingUserIds: Array.from(setIds) };
        return { voice: { ...state.voice, [channelId]: next } };
      }),

      resetData: () => set({
        currentUser: initialData.currentUser,
        servers: initialData.servers,
        messages: initialData.messages,
        presences: initialData.presences,
        activeServerId: initialData.servers[0].id,
        activeChannelId: initialData.servers[0].categories[0].channels[0].id,
        typingUsers: {},
        voice: {},
        voiceMember: {},
        dmGroups: []
      }),
    }),
    {
      name: 'discord-clone-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        servers: state.servers,
        messages: state.messages,
        presences: state.presences,
        activeServerId: state.activeServerId,
        activeChannelId: state.activeChannelId,
        voice: state.voice,
        voiceMember: state.voiceMember,
        dmGroups: state.dmGroups
      }),
    }
  )
);
