export enum AddressActionTypes {
  setAdressesList= "SET_ADRESSES_LIST",
  addAddress= "ADD_ADDRESS",
  removeAdressesList= "REMOVE_ADDRESS",
}

export interface Address {
	id: string,
  cep: string,
	addressAlias: string,
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

