/* eslint-disable no-case-declarations */
import { Reducer } from "redux";
import produce from 'immer';
import { ApplicationActionTypes, ApplicationState } from "./types";

const INITIAL_STATE: ApplicationState = {
  isLoading: false,
};

const user: Reducer<ApplicationState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case ApplicationActionTypes.setLoading:
        const { isLoading } = action.payload;
        
        draft.isLoading = isLoading;

        break;
     
      default:
        return draft;
    }
  })

export default user;