/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undefined */
import { Reducer } from "redux";
import produce from 'immer';
import { ServiceActionTypes, ServiceState } from "./types";

const INITIAL_STATE: ServiceState = {
  list: {
    items:[] ,
    page: 1,
    total: 1,
  },
  newService: {
    id: null,
    category: {
      id: 1,
      name: null,
    },
    order_status: "analise",
		description: "",
		userID: null,
    urgency: "delayable",
    start_order: "",
		serviceDate: new Date(),
		hora_inicio: "",
		hora_fim: "",
		images: [],
		address: {
      id: "",
      cep: "",
      name: "",
      state: "",
      city: "",
      district: "",
      street: "",
      number: "",
      complement: "",
    },
		previous_budget: false,
    previous_budget_value: null,
    rate: null,
    professional_order: null,
    professional_photo: null,
    filtered_professional: null,
    user: null,
    user_photo: null,
    user_rate: null,
		budget: null,
		rescheduling: null,
	},
};

const services: Reducer<ServiceState> = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type){
      case ServiceActionTypes.setServices:
        const { data } = action.payload; 
        
        draft.list = data;

        draft.list.items = draft.list.items.map(item => ({
            ...item,
            userID: item.user ? item.user.id : null,
            serviceDate: new Date(item.start_order),
          }));
        
        return;

      case ServiceActionTypes.updateService:
        const { updated } = action.payload; 

        const index = draft.list.items.findIndex(item => item.id === updated.id);

        draft.list.items[index] = {
          ...updated,
          userID: updated.user ? updated.user.id : null,
          serviceDate: new Date(updated.start_order),
        };
        
        return;

      case ServiceActionTypes.updateNewService:
          const { form } = action.payload; 

          draft.newService = {
            ...form,
            // userID: form.user ? form.user.id : null,
            // serviceDate: new Date(form.start_order),
          };
          
          return;
    
      case ServiceActionTypes.clearNewService:
        draft.newService = INITIAL_STATE.newService;

        return;

      default:
        return draft;
    }
  })

export default services;