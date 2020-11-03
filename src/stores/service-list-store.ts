/* eslint-disable @typescript-eslint/naming-convention */
import {observable, action, runInAction} from "mobx";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";
import finddoApi, {ServiceApiResponse, ServiceStatus} from "finddo-api";

class ServiceListStore {
	@observable
	public list: ServiceStore[] = [];

	@observable
	public status: "" | ServiceStatus = "";

	@observable
	private page = 1;

	@observable
	private url = "";

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

			const response = await finddoApi.get(`${endpoint}/?page=1`);

			// console.log(response.data);
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => {
				this.list = serviceList;
				this.url = endpoint;
				this.page = 1;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async updateServiceList(): Promise<void> {
		try {
			const params =
				this.status !== "" ? {page: 1, status: this.status} : {page: 1};

			const response = await finddoApi.get(this.url, {params});
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => {
				this.list = serviceList;
				this.page = 1;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async setStatusFilter(status: "" | ServiceStatus): Promise<void> {
		try {
			const params =
				status !== "" ? {page: 1, order_status: status} : {page: 1};

			const response = await finddoApi.get(this.url, {params});
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => {
				this.list = serviceList;
				this.page = 1;
				this.status = status;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async expandServiceList(): Promise<void> {
		try {
			const params =
				this.status !== ""
					? {page: this.page + 1, order_status: this.status}
					: {page: this.page + 1};

			const response = await finddoApi.get(this.url, {params});
			const services: ServiceApiResponse[] = response.data.items;
			const serviceList = services.map(service =>
				ServiceStore.createFromApiResponse(service),
			);

			runInAction(() => {
				this.list = [...this.list, ...serviceList];
				this.page += 1;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ServiceListStore;
