/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AddressApiResponse } from "finddo-api";
import { Address, AddressActionTypes } from "./types";

export function setAdressesList(list: AddressApiResponse[]) {
  return {
    type: AddressActionTypes.setAdressesList,
    payload: {
      list,
    }
  };
}

export function updateAdressesList(item: Address) {
  return {
    type: AddressActionTypes.updateAddressList,
    payload: {
      item,
    }
  };
}

export function removeAddress(id: string) {
  return {
    type: AddressActionTypes.removeAddressList,
    payload: {
      id,
    }
  };
}
