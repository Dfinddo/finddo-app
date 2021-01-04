export enum ApplicationActionTypes {
  setLoading= "SET_LOADING",
}

interface SetLoadingAction {
  type: ApplicationActionTypes.setLoading,
  payload: {
    isLoading: boolean,
  },
}

export type ApplicationActions = SetLoadingAction; 

export interface ApplicationState {
  isLoading: boolean;
}
