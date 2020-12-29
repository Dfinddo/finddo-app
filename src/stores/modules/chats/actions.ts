/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Chat, ChatActionTypes, ChatList, ChatListTypes } from "./types";

export function fetchChats(data: ChatListTypes)  {
  return {
    type: ChatActionTypes.fetchChats,
    payload: {
      data,
    }
  };
}

export function updateChatList(data: ChatList, isAdmin: boolean)  {
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

export function fetchActiveChat(chatInfo: FetchActiveChatProps)  {
  return {
    type: ChatActionTypes.fetchActiveChat,
    payload: {
      chatInfo,
    }
  };
}

export function updateActiveChat(chat: Chat)  {
  return {
    type: ChatActionTypes.updateChat,
    payload: {
      chat,
    }
  };
}

export function sendMessage(chat: Chat)  {
  return {
    type: ChatActionTypes.updateChat,
    payload: {
      chat,
    }
  };
}

