import { combineReducers } from "redux";
import user from './user/reducer';
import adresses from './adresses/reducer';
import chats from './chats/reducer';

export default combineReducers({
  user,
  adresses,
  chats,
});