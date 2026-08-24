import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'

export function useChat() {
  const store = useChatStore()
  const {
    conversations,
    activeConversation,
    messages,
    nextCursor,
    hasMore,
    loadingConversations,
    loadingMessages,
    typingUsers,
    // Computed conversation groups
    nyscGroups,
    userGroups,
    groupConversations,
    dmConversations,
  } = storeToRefs(store)

  return {
    // State
    conversations,
    activeConversation,
    messages,
    nextCursor,
    hasMore,
    loadingConversations,
    loadingMessages,
    typingUsers,

    // Computed groups
    nyscGroups,
    userGroups,
    groupConversations,
    dmConversations,

    // Conversation actions
    fetchConversations:   store.fetchConversations,
    selectConversation:   store.selectConversation,
    fetchMessages:        store.fetchMessages,
    sendMessage:          store.sendMessage,
    muteChat:             store.muteChat,
    sendTyping:           store.sendTyping,

    // Message actions
    editMessage:          store.editMessage,
    retrySendMessage:     store.retrySendMessage,

    // Group actions
    createGroup:          store.createGroup,
    findOrCreateDm:       store.findOrCreateDm,
    joinViaInvite:        store.joinViaInvite,
    leaveGroup:           store.leaveGroup,
    generateInviteLink:   store.generateInviteLink,

    // Realtime handlers
    handleIncomingMessage:  store.handleIncomingMessage,
    handleMessageRead:      store.handleMessageRead,
    handleUserTyping:       store.handleUserTyping,
    handleMessageUpdated:   store.handleMessageUpdated,
    handleMessageDeleted:   store.handleMessageDeleted,
  }
}
