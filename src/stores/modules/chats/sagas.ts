/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Alert } from "react-native";
import { all, put, call, takeLatest } from "redux-saga/effects";
import { myFirebase } from 'src/services/firebase';
import { updateActiveChat } from "./actions";
import { ChatActionTypes, Message } from "./types";

interface FetchActiveChatRequest {
  type: ChatActionTypes.fetchActiveChat,
  payload: {
    chatInfo: {
      order_id: string, 
      isAdminChat: boolean,
    }
  },
}


const getChat = (chatUrl: string) =>
    myFirebase.database().ref(chatUrl).orderByKey().limitToFirst(500)
    .once('value')
    .then(snapshot => Object.keys(snapshot.val()).map(key => 
      ({id: key,...snapshot.val()[key], })) as Message[]);

function* fetchChat({payload}: FetchActiveChatRequest) {
  const {order_id, isAdminChat} = payload.chatInfo;

  try {
    const messages = yield call(getChat, `/chats/${order_id}/${isAdminChat ? "admin" : "common"}`);

    yield put(updateActiveChat({
      messages: messages.reverse(),
      order_id,
      isAdminChat,
      isGlobalChat: Number(order_id) === 170,
      page: 1,
      total: 1,
    }));
  } catch (error) {
    Alert.alert("Sua conta ainda não foi validada.");
  }
}

export default all([
  takeLatest(ChatActionTypes.fetchActiveChat,fetchChat),
]);