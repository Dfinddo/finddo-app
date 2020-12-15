/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Service, ServiceActionTypes, ServiceList } from "./types";

export function setServices(data: ServiceList)  {
  return {
    type: ServiceActionTypes.setServices,
    payload: {
      data,
    }
  };
}

export function updateService(updated: Service)  {
  return {
    type: ServiceActionTypes.updateService,
    payload: {
      updated,
    }
  };
}

export function updateNewService(form: Service)  {
  return {
    type: ServiceActionTypes.updateNewService,
    payload: {
      form,
    }
  };
}

export function clearNewService()  {
  return {
    type: ServiceActionTypes.clearNewService,
  };
}