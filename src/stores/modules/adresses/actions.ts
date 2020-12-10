/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AddressApiResponse } from "finddo-api";
import { AddressActionTypes } from "./types";

export function setAdressesList(list: AddressApiResponse[]) {
  return {
    type: AddressActionTypes.setAdressesList,
    payload: {
      list,
    }
  };
}

export function removeAddress(id: string) {
  return {
    type: AddressActionTypes.removeAdressesList,
    payload: {
      id,
    }
  };
}
