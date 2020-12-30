import { ProfessionalsState, ProfessionalListActionTypes, ProfessionalListActions } from "./types";

export function setProfessionalList(data: ProfessionalsState): ProfessionalListActions {
  return {
    type: ProfessionalListActionTypes.setProfessionalList,
    payload: {
      data,
    }
  };
}
