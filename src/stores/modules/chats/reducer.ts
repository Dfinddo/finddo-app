/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undefined */
import { Reducer } from "redux";
import produce from 'immer';
import { ChatActionTypes, ChatState } from "./types";

const INITIAL_STATE: ChatState = {
  chatLists: {
    default: {
      list: [],
      page: 1,
      totalPages: 1,
    },
    admin: {
      list: [],
      page: 1,
      totalPages: 1,
    },
  },
  activeChat: {
    order_id: "",
    messages: [],
    isAdminChat: false,
    isGlobalChat: false,
    page: 1,
    total: 1,
  },
};

const chats: Reducer<ChatState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case ChatActionTypes.fetchChats:
        const { data } = action.payload; 
        
        draft.chatLists = data;
        
        return;

      case ChatActionTypes.fetchActiveChat:
        const { chat } = action.payload; 

        draft.activeChat = chat;
          
        return;
    
      case ChatActionTypes.updateChatList:
        const { isAdminChat, updatedChat } = action.payload;  
  
        if(isAdminChat){
          draft.chatLists.admin = updatedChat;
        }else{
          draft.chatLists.default = updatedChat;
        }

        return;

      default:
        return draft;
    }
  })

export default chats;