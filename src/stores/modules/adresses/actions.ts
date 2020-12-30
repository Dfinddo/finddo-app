import { AddressApiResponse } from "finddo-api";
import { Address, AddressActions, AddressActionTypes } from "./types";

export function setAdressesList(list: AddressApiResponse[]): AddressActions {
  return {
    type: AddressActionTypes.setAdressesList,
    payload: {
      list,
    }
  };
}

export function updateAdressesList(item: Address): AddressActions {
  return {
    type: AddressActionTypes.updateAddressList,
    payload: {
      item,
    }
  };
}

export function removeAddress(id: string): AddressActions {
  return {
    type: AddressActionTypes.removeAddressList,
    payload: {
      id,
    }
  };
}
