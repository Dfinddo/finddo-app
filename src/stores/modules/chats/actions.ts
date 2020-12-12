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

export function fetchActiveChat(chat: Chat)  {
  return {
    type: ChatActionTypes.fetchActiveChat,
    payload: {
      chat,
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

