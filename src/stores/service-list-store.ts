import {observable, action, runInAction} from "mobx";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";
import finddoApi, {ServiceApiResponse} from "finddo-api";

class ServiceListStore {
	@observable
	public list: ServiceStore[] = [];

	@action
	public async fetchServices(userStore: UserStore): Promise<void> {
		try {
			const endpoint =
				userStore.userType === "user"
					? `/orders/user/${userStore.id}/active`
					: "/orders/available";

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
	): Promise<void> {
		try {
			const endpoint =
				userStore.userType === "user"
					? `/orders/user/${userStore.id}/active/?page=${page}`
					: `/orders/available/?page=${page}`;

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
