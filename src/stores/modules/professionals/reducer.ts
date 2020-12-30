/* eslint-disable no-case-declarations */
import { Reducer } from "redux";
import produce from 'immer';
import { ProfessionalListActionTypes, ProfessionalsState } from "./types";

const INITIAL_STATE: ProfessionalsState = {
  list: [],
  current_page: 1,
	total_pages: 1,
};

const professionals: Reducer<ProfessionalsState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case ProfessionalListActionTypes.setProfessionalList:
        const { data } = action.payload; 
        
        return data;

      default:
        return draft;
    }
  })

export default professionals;