export enum CardActionTypes {
  setCardList= "SET_CARD_LIST",
  addCard= "ADD_CARD",
  removeCard= "REMOVE_CARD",
}

export interface Card {
	id: string;
	brand: string;
	first6: string;
	last4: string;
	store: boolean;
}

export interface CardsState {
  list: Card[],
}

