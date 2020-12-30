import { ConversationApiResponse } from "finddo-api";

export enum ChatActionTypes {
  fetchChatList= "FETCH_CHATS",
  fetchActiveChat= "FETCH_ACTIVE_CHAT",
  updateChatList= "UPDATE_CHATLIST",
  updateChat= "UPDATE_CHAT",
}

interface FetchChatListAction {
  type: ChatActionTypes.fetchChatList,
  payload: {
    data: ChatListTypes,
  },
}

interface UpdateChatListAction {
  type: ChatActionTypes.updateChatList,
  payload: {
    isAdminChat: boolean,
    updatedChat: ChatList,
  },
}

interface FetchActiveChatAction {
  type: ChatActionTypes.fetchActiveChat,
  payload: {
    chatInfo: {
      order_id: string, 
      isAdminChat: boolean,
    }
  },
}

interface UpdateActiveChatAction {
  type: ChatActionTypes.updateChat,
  payload: {
    chat: Chat
  },
}

export type ChatActions = FetchChatListAction | 
  UpdateChatListAction | FetchActiveChatAction | UpdateActiveChatAction;

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