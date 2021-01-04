/* eslint-disable no-case-declarations */
/* eslint-disable no-undefined */
import { Reducer } from "redux";
import produce from 'immer';
import { CardActionTypes, CardsState } from "./types";

const INITIAL_STATE: CardsState = {
  list: [],
};

const cards: Reducer<CardsState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case CardActionTypes.setCardList:
        const { data } = action.payload; 
        
        draft.list = data;
        
        return;

      case CardActionTypes.addCard:
        const { card } = action.payload; 

        draft.list.push(card);
          
        return;
    
      case CardActionTypes.removeCard:
        const { id } = action.payload
  
        const index = draft.list.findIndex(item => item.id === id);
  
        if(index !== -1) draft.list.splice(index, 1);
  
        return;

      default:
        return draft;
    }
  })

export default cards;