/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { all, put, select, call, take, SelectEffect, takeLatest } from "redux-saga/effects";
import { myFirebase } from 'src/services/firebase';
// import { State } from "stores/index";
import { fetchActiveChat, updateActiveChat } from "./actions";
// import { setLoading } from "../application/actions";
import { ChatActionTypes, Message } from "./types";

type ChatConnectionRequest = ReturnType<typeof fetchActiveChat>


const getChat = (chatUrl: string) =>
    myFirebase.database().ref(chatUrl)
    .once('value')
    .then(snapshot => Object.keys(snapshot.val()).map(key => 
      ({id: key,...snapshot.val()[key], })) as Message[]);

function* fetchChat({payload}: ChatConnectionRequest) {
  const {order_id, isAdminChat} = payload.chatInfo;
  // const oldChat: Chat = yield select((state: State) => state.chats.activeChat);

  try {
    const messages = yield call(getChat, `/chats/${order_id}/${isAdminChat ? "admin" : "common"}`);

    yield put(updateActiveChat({
      messages,
      order_id,
      isAdminChat,
      isGlobalChat: Number(order_id) === 170,
      page: 1,
      total: 1,
    }));
  } catch (e) {
    // yield put({ type: ACTIONS.FETCH_CHAT_FAIL, payload: e });
  }
}

export default all([
  takeLatest(ChatActionTypes.fetchActiveChat,fetchChat),
]);