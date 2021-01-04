import { AddressApiResponse } from "finddo-api";

export enum AddressActionTypes {
  setAdressesList= "SET_ADRESSES_LIST",
  addAddress= "ADD_ADDRESS",
  updateAddressList= "UPDATE_ADDRESS_LIST",
  removeAddressList= "REMOVE_ADDRESS",
}

interface SetAdressesListAction {
	type: AddressActionTypes.setAdressesList,
	payload: {
		list: AddressApiResponse[],
	}
}

interface AddAdressesAction {
	type: AddressActionTypes.updateAddressList,
	payload: {
		item: Address,
	}
}

interface RemoveAddressAction {
	type: AddressActionTypes.removeAddressList,
	payload: {
		id: string,
	}
}

export type AddressActions = SetAdressesListAction | AddAdressesAction | RemoveAddressAction;

export interface Address {
	id: string,
  cep: string,
	name: string,
	state: string,
	city: string,
	district: string,
	street: string,
	number: string,
	complement: string,
}

export interface AdressesState {
  list: Address[],
}

