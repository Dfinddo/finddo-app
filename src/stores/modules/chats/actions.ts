import { 
  Chat, 
  ChatActions, 
  ChatActionTypes, 
  ChatList, 
  ChatListTypes 
} from "./types";

export function fetchChatList(data: ChatListTypes): ChatActions  {
  return {
    type: ChatActionTypes.fetchChatList,
    payload: {
      data,
    }
  };
}

export function updateChatList(data: ChatList, isAdmin: boolean): ChatActions  {
  return {
    type: ChatActionTypes.updateChatList,
    payload: {
      isAdminChat: isAdmin,
      updatedChat: data,
    }
  };
}

interface FetchActiveChatProps{
  order_id: string, 
  isAdminChat: boolean,
}

export function fetchActiveChat(chatInfo: FetchActiveChatProps): ChatActions  {
  return {
    type: ChatActionTypes.fetchActiveChat,
    payload: {
      chatInfo
    }
  };
}

export function updateActiveChat(chat: Chat): ChatActions  {
  return {
    type: ChatActionTypes.updateChat,
    payload: {
      chat,
    }
  };
}

