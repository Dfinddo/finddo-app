/* eslint-disable class-methods-use-this */
import {observable, action, runInAction} from "mobx";
// import CardStore from "stores/card-store";
import finddoApi, {CardApiResponse} from "finddo-api";

class CardListStore {
	@observable
	public list: CardApiResponse[] = [];

	@action
	public async fetchCards(): Promise<void> {
		try {
			const response = await finddoApi.get(`/users/get_credit_card`);
			const cards: CardApiResponse[] = response.data;

			runInAction(() => (this.list = cards));
		} catch (error) {
			if (error.response) throw new Error("Invalid card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async removeCard(id: string): Promise<void> {
		try {
			await finddoApi.delete(`/users/credit_card/${id}`);
		} catch (error) {
			if (error.response) throw new Error("Invalid card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default CardListStore;
