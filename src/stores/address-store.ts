import {observable, computed, action, runInAction} from "mobx";
import {validations, validateInput, pick} from "utils";
import finddoApi, {AddressApiResponse} from "finddo-api";

const defaultTests = [validations.required(), validations.maxLength(128)];
const cepTests = [validations.required(), validations.definedLength(8)];
const numberTests = [validations.required(), validations.maxLength(10)];
const stateTests = [validations.required(), validations.maxLength(2)];

const addressApiFields = [
	"cep",
	"addressAlias",
	"state",
	"city",
	"district",
	"street",
	"number",
	"complement",
] as const;

class AddressStore {
	@observable public id = "";

	@observable public cep = "";
	@computed public get cepError(): string | undefined {
		return validateInput(this.cep, cepTests);
	}

	@observable public addressAlias = "";
	@computed public get addressAliasError(): string | undefined {
		return validateInput(this.addressAlias, defaultTests);
	}

	@observable public state = "";
	@computed public get stateError(): string | undefined {
		return validateInput(this.state, stateTests);
	}

	@observable public city = "";
	@computed public get cityError(): string | undefined {
		return validateInput(this.city, defaultTests);
	}

	@observable public district = "";
	@computed public get districtError(): string | undefined {
		return validateInput(this.district, defaultTests);
	}

	@observable public street = "";
	@computed public get streetError(): string | undefined {
		return validateInput(this.street, defaultTests);
	}

	@observable public number = "";
	@computed public get numberError(): string | undefined {
		return validateInput(this.number, numberTests);
	}

	@observable public complement = "";
	@computed public get complementError(): string | undefined {
		return validateInput(this.complement, defaultTests);
	}

	@action
	public clearAddress(): void {
		addressApiFields.forEach(field => (this[field] = ""));
	}

	@action
	public static createFromApiResponse(
		apiResponse: AddressApiResponse,
	): AddressStore {
		const addressStore = new AddressStore();
		const {name: addressAlias, ...address} = apiResponse;

		Object.assign(addressStore, address, {addressAlias});

		return addressStore;
	}

	@action
	public saveAddress = async (): Promise<void> => {
		const address = pick(this, addressApiFields);

		try {
			const response = (await this.id)
				? finddoApi.put(`/addresses/${this.id}`, {address})
				: finddoApi.post("/addresses", {address});

			runInAction(() => (this.id = response.data.id));
		} catch (error) {
			if (error.response) throw new Error("Invalid address data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default AddressStore;
