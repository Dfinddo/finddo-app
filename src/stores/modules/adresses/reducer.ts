/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
import { Reducer } from "redux";
import produce from 'immer';
import { AddressActionTypes, AdressesState } from "./types";

const INITIAL_STATE: AdressesState = {
  list: [],
};

const cart: Reducer<AdressesState> = (state = INITIAL_STATE, action) => 
  produce(state, draft => {
    switch(action.type){
      case AddressActionTypes.setAdressesList:
        const {list} = action.payload;

        draft.list.push(...list);

        return;

      case AddressActionTypes.removeAdressesList:
        const {id} = action.payload

        const index = draft.list.findIndex(item => item.id === id);

        if(index !== -1) draft.list.splice(index, 1);

        return;

      default:
        return draft;
    }
  })

export default cart;