/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undefined */
import { Reducer } from "redux";
import produce from 'immer';
import { UserActionTypes, UserState } from "./types";

const INITIAL_STATE: UserState = {
  user_type: "user",
  id: "",
  profilePicture: require("../../../assets/sem-foto.png"),
  name: "",
	surname: "",
  mothersName: "",
	email: "",
	cellphone: "",
	cpf: "",
  birthdate: new Date(),
  rate: 0,
  billingAddress: undefined,
};

const user: Reducer<UserState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case UserActionTypes.signInSuccess:
        const { user } = action.payload;          

        return user;

      case UserActionTypes.signOut:   
        return INITIAL_STATE;
  
      default:
        return draft;
    }
  })

export default user;