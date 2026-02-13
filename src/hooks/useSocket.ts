import { useEffect } from 'react';
import { eventBus } from '../lib/event-bus';
import { useStore } from '../lib/store';

export const useSocket = () => {
  const { addMessage, updateMessage, deleteMessage, setTyping, setPresence, toggleReaction, insertChannel, voiceJoin, voiceLeave, setVoiceMemberState } = useStore();

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((payload) => {
      if (payload.senderId === eventBus.clientId) return;
      // Don't process events from self for store updates that already happened locally
      // but do process for multi-tab sync (senderId !== 'local')
      
      switch (payload.type) {
        case 'MESSAGE_CREATED':
          addMessage(payload.data.channelId, payload.data.message);
          break;
        case 'MESSAGE_UPDATED':
          updateMessage(payload.data.channelId, payload.data.messageId, payload.data.updates);
          break;
        case 'MESSAGE_DELETED':
          deleteMessage(payload.data.channelId, payload.data.messageId);
          break;
        case 'REACTION_TOGGLED':
          toggleReaction(payload.data.channelId, payload.data.messageId, payload.data.emoji, payload.data.userId);
          break;
        case 'TYPING_START':
          setTyping(payload.data.channelId, payload.data.userId, true);
          break;
        case 'TYPING_STOP':
          setTyping(payload.data.channelId, payload.data.userId, false);
          break;
        case 'PRESENCE_UPDATE':
          setPresence(payload.data.userId, payload.data.presence);
          break;
        case 'CHANNEL_CREATED':
          insertChannel(payload.data.serverId, payload.data.categoryId, payload.data.channel, false);
          break;
        case 'VOICE_JOIN':
          voiceJoin(payload.data.channelId, payload.data.userId, false);
          break;
        case 'VOICE_LEAVE':
          voiceLeave(payload.data.channelId, payload.data.userId, false);
          break;
        case 'VOICE_UPDATE':
          setVoiceMemberState(payload.data.userId, payload.data.updates, false);
          break;
      }
    });

    return () => unsubscribe();
  }, [addMessage, updateMessage, deleteMessage, setTyping, setPresence, toggleReaction, insertChannel, voiceJoin, voiceLeave, setVoiceMemberState]);
};
