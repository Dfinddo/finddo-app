import { 
  BudgetApiResponse, 
  ReschedulingApiResponse, 
  serviceCategories, ServiceStatus, 
  UserApiResponse 
} from "finddo-api";
import { Address } from "../adresses/types";

export enum ServiceActionTypes {
  setServices= "SET_SERVICES",
  updateService= "UPDATE_SERVICE",
  updateNewService= "UPDATE_NEW_SERVICE",
  clearNewService= "CLEAR_NEW_SERVICE",
}

interface SetServiceAction {
  type: ServiceActionTypes.setServices,
  payload: {
    data: ServiceList,
  },
}

interface UpdateServiceAction {
  type: ServiceActionTypes.updateService,
  payload: {
    updated: Service,
  },
}

interface UpdateNewServiceAction {
  type: ServiceActionTypes.updateNewService,
  payload: {
    form: Service,
  },
}

interface ClearNewServiceAction {
  type: ServiceActionTypes.clearNewService,
}

export type ServiceActions = SetServiceAction | UpdateServiceAction | 
  UpdateNewServiceAction | ClearNewServiceAction;

export interface Service {
  id: number | null;
  userID: number | null;
  category: {
    id: keyof typeof serviceCategories | null;
    name: string | null;
  };
  order_status: ServiceStatus;
  previous_budget: boolean;
  previous_budget_value: number | null;
  budget: BudgetApiResponse | null;
  rescheduling: ReschedulingApiResponse | null;
  professional_order: UserApiResponse | null;
  professional_photo: string | null;
  rate: string | null;
  user: UserApiResponse | null;
  user_photo: string | null;
  user_rate: string | null;
  filtered_professional: string | null;
  description: string;
  urgency: "urgent" | "delayable";
  start_order: string;
	serviceDate: Date;
	hora_inicio: string;
	hora_fim: string;
	images: {data: string; mime: string}[];
  address: Address;
}

export interface ServiceList {
  items: Service[],
  page: number,
  total: number,
}

export interface ServiceState {
  list: ServiceList,

  newService: Service,
}