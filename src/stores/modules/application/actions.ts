/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ApplicationActionTypes } from "./types";

export function setLoading(isLoading: boolean) {
  return {
    type: ApplicationActionTypes.setLoading,
    payload: {
      isLoading,
    }
  };
}