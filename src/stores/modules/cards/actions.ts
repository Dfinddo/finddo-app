/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Card, CardActionTypes } from "./types";

export function setCardsList(data: Card[]) {
  return {
    type: CardActionTypes.setCardList,
    payload: {
      data,
    }
  };
}

export function addCard(item: Card) {
  return {
    type: CardActionTypes.addCard,
    payload: {
      item,
    }
  };
}

export function removeCard(id: string) {
  return {
    type: CardActionTypes.removeCard,
    payload: {
      id,
    }
  };
}
