import {createContext} from "react";
import ChatStore from "stores/chat-store";

const ChatContext = createContext<ChatStore>(new ChatStore());

export {ChatContext};
