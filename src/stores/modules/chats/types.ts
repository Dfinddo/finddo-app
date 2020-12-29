import { ConversationApiResponse } from "finddo-api";

/* eslint-disable @typescript-eslint/naming-convention */
export enum ChatActionTypes {
  fetchChats= "FETCH_CHATS",
  fetchActiveChat= "FETCH_ACTIVE_CHAT",
  activeChatConnection= "ACTIVE_CHAT_CONNECTION",
  updateChatList= "UPDATE_CHATLIST",
  updateChat= "UPDATE_CHAT",
}

export interface Message {
	id: number;
	order_id: number;
	receiver_id: number;
	is_read: boolean;
	message: string;
	// for_admin: string;
}

export interface Chat {
  order_id: string;
  messages: Message[];
  isAdminChat: boolean;
  isGlobalChat: boolean;
  page: number;
  total: number;
}

export interface ChatList {
  list: ConversationApiResponse[];
  page: number;
  totalPages: number;
}

export interface ChatListTypes {
  default: ChatList,
  admin: ChatList,
}

export interface ChatState {
  chatLists: ChatListTypes;
  activeChat: Chat;
}