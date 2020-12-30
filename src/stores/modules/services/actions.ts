import { Service, ServiceActions, ServiceActionTypes, ServiceList } from "./types";

export function setServices(data: ServiceList): ServiceActions {
  return {
    type: ServiceActionTypes.setServices,
    payload: {
      data,
    }
  };
}

export function updateService(updated: Service): ServiceActions  {
  return {
    type: ServiceActionTypes.updateService,
    payload: {
      updated,
    }
  };
}

export function updateNewService(form: Service): ServiceActions  {
  return {
    type: ServiceActionTypes.updateNewService,
    payload: {
      form,
    }
  };
}

export function clearNewService(): ServiceActions {
  return {
    type: ServiceActionTypes.clearNewService,
  };
}