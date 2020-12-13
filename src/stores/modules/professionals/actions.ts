/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ProfessionalsState, ProfessionalListActionTypes } from "./types";

export function setProfessionalList(data: ProfessionalsState) {
  return {
    type: ProfessionalListActionTypes.setProfessionalList,
    payload: {
      data,
    }
  };
}
