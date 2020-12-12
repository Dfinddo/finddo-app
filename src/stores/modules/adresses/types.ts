export enum AddressActionTypes {
  setAdressesList= "SET_ADRESSES_LIST",
  addAddress= "ADD_ADDRESS",
  updateAddressList= "UPDATE_ADDRESS_LIST",
  removeAddressList= "REMOVE_ADDRESS",
}

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

