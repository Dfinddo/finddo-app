import { combineReducers } from "redux";
import user from './user/reducer';
import adresses from './adresses/reducer';

export default combineReducers({
  user,
  adresses,
});