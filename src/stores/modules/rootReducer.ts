import { combineReducers } from "redux";

import user from './user/reducer';
import chats from './chats/reducer';
import cards from './cards/reducer';
import adresses from './adresses/reducer';
import professionals from './professionals/reducer';

export default combineReducers({
  user,
  adresses,
  chats,
  cards,
  professionals,
});