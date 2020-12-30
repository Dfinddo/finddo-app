import { ApplicationActions, ApplicationActionTypes } from "./types";

export function setLoading(isLoading: boolean): ApplicationActions {
  return {
    type: ApplicationActionTypes.setLoading,
    payload: {
      isLoading,
    }
  };
}