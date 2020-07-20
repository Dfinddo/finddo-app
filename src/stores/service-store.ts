import {observable, computed, action} from "mobx";
import {validations, validateInput} from "utils";
import AddressStore from "stores/address-store";
import finddoApi, {ServiceApiResponse, ServiceStatus} from "finddo-api";
import AuthStore from "./auth-store";

const descriptionTests = [
	validations.required(),
	validations.minLength(5),
	validations.maxLength(10000),
];

class ServiceStore {
	@observable
	public id: number | null = null;

	@observable
	public categoryID: number | null = null;

	@observable
	public description = "";

	@computed public get descriptionError(): string | undefined {
		return validateInput(this.description, descriptionTests);
	}

	@observable
	public urgency: "urgent" | "not urgent" = "not urgent";

	@observable
	public status: ServiceStatus = "" as ServiceStatus;

	@observable
	public serviceDate: Date = new Date();

	@observable
	public userID: number | null = null;

	@observable
	public addressID: number | null = null;

	@observable
	public startTime = "";

	@observable
	public endTime = "";

	@observable
	public images = [];

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
		serviceStore.images = [];
		serviceStore.address = AddressStore.createFromApiResponse(
			apiResponse.address,
		);

		return serviceStore;
	}

	@action
	public clearServiceData(): void {
		this.categoryID = null;
		this.description = "";
		this.userID = null;
		this.urgency = "not urgent";
		this.serviceDate = new Date();
		this.addressID = null;
		this.startTime = "";
		this.endTime = "";
		this.images = [];
		this.address = new AddressStore();
	}

	public saveService = async (authStore: AuthStore): Promise<void> => {
		const order: any = {};

		order.category_id = this.categoryID;
		order.description = this.description;
		order.user_id = authStore.id;
		order.urgency = this.urgency;
		order.start_order = `${this.serviceDate.toDateString()} ${
			this.startTime
		}`;
		order.address_id = this.address.id;
		order.hora_inicio = this.startTime;
		order.hora_fim = this.endTime;

		const images = [];

		try {
			const response = await finddoApi.post("/orders", {
				order,
				images,
			});
		} catch (error) {
			if (error.response) throw new Error("Invalid service data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default ServiceStore;
