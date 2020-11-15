import {createContext} from "react";
import ChatListStore from "stores/chat-list-store";

const ChatListContext = createContext<ChatListStore>(new ChatListStore());

export {ChatListContext};
