/* eslint-disable @typescript-eslint/naming-convention */
import {observable, computed, action, runInAction} from "mobx";
import {validations, validateInput} from "utils";
import AddressStore from "stores/address-store";
import finddoApi, {
	ServiceApiResponse,
	ServiceStatus,
	serviceCategories,
} from "finddo-api";
import UserStore from "./user-store";

const descriptionTests = [
	validations.required(),
	validations.minLength(5),
	validations.maxLength(10000),
];

const defaultTests = [validations.required()];

class ServiceStore {
	@observable
	public id: number | null = null;

	@observable
	public userID: number | null = null;

	@observable
	public categoryID: keyof typeof serviceCategories | null = null;

	@observable
	public status: ServiceStatus = "" as ServiceStatus;

	@observable
	public previous_budget = false;

	@observable
	public previous_budget_value: number | null = null;

	@observable public description = "";
	@computed public get descriptionError(): string | undefined {
		return validateInput(this.description, descriptionTests);
	}

	@observable public urgency: "urgent" | "delayable" = "delayable";
	@computed public get urgencyError(): string | undefined {
		return validateInput(this.urgency, defaultTests);
	}

	@observable public serviceDate: Date = new Date();
	// @computed public get serviceDateError(): string | undefined {
	// 	return validateInput(this.serviceDate, defaultTests);
	// }

	@observable public startTime = "";
	@computed public get startTimeError(): string | undefined {
		return validateInput(this.startTime, defaultTests);
	}

	@observable public endTime = "";
	@computed public get endTimeError(): string | undefined {
		return validateInput(this.endTime, defaultTests);
	}

	@observable
	public images: {data: string; mime: string}[] = [];

	public address = new AddressStore();

	@action
	public static createFromApiResponse(
		apiResponse: ServiceApiResponse,
	): ServiceStore {
		const serviceStore = new ServiceStore();

		serviceStore.id = apiResponse.id;
		serviceStore.categoryID = apiResponse.category.id;
		serviceStore.description = apiResponse.description;
		serviceStore.userID = apiResponse.id;
		serviceStore.urgency = apiResponse.urgency;
		serviceStore.status = apiResponse.order_status;
		serviceStore.serviceDate = new Date(apiResponse.start_order);
		serviceStore.startTime = apiResponse.hora_inicio;
		serviceStore.endTime = apiResponse.hora_fim;
		serviceStore.images = apiResponse.images;
		serviceStore.address = AddressStore.createFromApiResponse(
			apiResponse.address,
		);

		return serviceStore;
	}

	@action
	public async refreshServiceData(): Promise<void> {
		try {
			const response = await finddoApi.get(`/orders/${this.id}`);

			const newServiceStore = ServiceStore.createFromApiResponse(
				response.data,
			);

			runInAction(() => Object.assign(this, newServiceStore));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async doServiceBudget(budget: string): Promise<void> {
		try {
			await finddoApi.post("/orders/propose_budget", {
				id: this.id,
				budget,
			});

			runInAction(() => this.refreshServiceData());
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public clearServiceData(): void {
		this.categoryID = null;
		this.description = "";
		this.userID = null;
		this.urgency = "delayable";
		this.serviceDate = new Date();
		this.startTime = "";
		this.endTime = "";
		this.images = [];
		this.address = new AddressStore();
		this.previous_budget = false;
		this.previous_budget_value = null;
	}

	@action
	public saveService = async (userStore: UserStore): Promise<void> => {
		const order: any = {};

		order.category_id = this.categoryID;
		order.description = this.description;
		order.user_id = userStore.id;
		order.urgency = this.urgency;
		order.start_order = `${this.serviceDate.toDateString()} ${
			this.startTime
		}`;
		// order.address_id = this.address.id;
		order.previous_budget = this.previous_budget;
		order.previous_budget_value = this.previous_budget_value;
		order.hora_inicio = this.startTime;
		order.hora_fim = this.endTime;

		const address: any = {};

		address.cep = this.address.cep;
		address.complement = this.address.complement;
		address.district = this.address.district;
		address.name = this.address.addressAlias;
		address.number = this.address.number;
		address.street = this.address.street;

		const images: any[] = [];

		this.images.map((image, i) =>
			images.push({
				base64: image.data,
				file_name: `${userStore.id}_${this.startTime}_photo${i + 1}`,
			}),
		);

		try {
			await finddoApi.post("/orders", {
				order,
				address,
				images,
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid service data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default ServiceStore;
