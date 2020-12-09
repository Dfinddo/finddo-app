export enum AddressActionTypes {
  addProductToCartRequest= "ADD_PRODUCT_TO_CART_REQUEST",
  addProductToCartSuccess= "ADD_PRODUCT_TO_CART_SUCCESS",
  addProductToCartFailure= "ADD_PRODUCT_TO_CART_FAILURE",
}

export interface Address {
  cep: string,
	addressAlias: string,
	state: string,
	city: string,
	district: string,
	street: string,
	number: string,
	complement: string,
}

