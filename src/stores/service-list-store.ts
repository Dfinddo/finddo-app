import {observable, action, runInAction} from "mobx";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";
import finddoApi, {ServiceApiResponse} from "finddo-api";

class ServiceListStore {
	@observable
	public list: ServiceStore[] = [];

	@action
	public async fetchServices(
		userStore: UserStore,
		isProfessionalListService?: boolean,
	): Promise<void> {
		try {
			const endpoint =
				// eslint-disable-next-line no-nested-ternary
				userStore.userType === "user"
					? `/orders/user/${userStore.id}/active`
					: !isProfessionalListService
					? "/orders/available"
					: `orders/active_orders_professional/${userStore.id}`;

			const response = await finddoApi.get(endpoint);
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => (this.list = serviceList));
		} catch (error) {
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async expandListServices(
		userStore: UserStore,
		page: number,
		isProfessionalListService?: boolean,
	): Promise<void> {
		try {
			const endpoint =
				// eslint-disable-next-line no-nested-ternary
				userStore.userType === "user"
					? `/orders/user/${userStore.id}/active/?page=${page}`
					: !isProfessionalListService
					? `/orders/available/?page=${page}`
					: `orders/active_orders_professional/${userStore.id}/?page=${page}`;

			const response = await finddoApi.get(endpoint);
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => (this.list = [...this.list, ...serviceList]));
		} catch (error) {
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ServiceListStore;
