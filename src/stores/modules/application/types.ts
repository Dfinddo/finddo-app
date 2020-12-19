/* eslint-disable @typescript-eslint/naming-convention */
export enum ApplicationActionTypes {
  setLoading= "SET_LOADING",
}

export interface ApplicationState {
  isLoading: boolean;
}
