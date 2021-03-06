import {observable, action, runInAction} from "mobx";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";
import finddoApi from "finddo-api";

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
			const services = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => (this.list = serviceList));
		} catch (error) {
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ServiceListStore;
