import {observable, computed, action, runInAction} from "mobx";
import {validations, validateInput, pick} from "utils";
import finddoApi, {CardApiResponse} from "finddo-api";

const numberTests = [validations.required(), validations.definedLength(16)];
const expirationDateTests = [
	validations.required(),
	validations.definedLength(4),
];
const cvvTests = [validations.required(), validations.definedLength(3)];
const holderNameTests = [validations.required()];
const taxDocumentTests = [
	validations.required(),
	validations.definedLength(11),
];
const phoneTests = [validations.required(), validations.definedLength(11)];

class CardStore {
	@observable public number = "";
	@computed public get numberError(): string | undefined {
		return validateInput(this.number, numberTests);
	}

	@observable public expirationDate = "";
	@computed public get expirationDateError(): string | undefined {
		return validateInput(this.expirationDate, expirationDateTests);
	}

	@observable public cvv = "";
	@computed public get cvvError(): string | undefined {
		return validateInput(this.cvv, cvvTests);
	}

	@observable public holderName = "";
	@computed public get holderNameError(): string | undefined {
		return validateInput(this.holderName, holderNameTests);
	}

	@observable public holderBirthdate = new Date();
	@computed public get holderBirthdateError(): string | undefined {
		if (!this.holderBirthdate) return "É obrigatório";
	}

	@observable public taxDocument = "";
	@computed public get taxDocumentError(): string | undefined {
		return validateInput(this.taxDocument, taxDocumentTests);
	}

	@observable public phone = "";
	@computed public get phoneError(): string | undefined {
		return validateInput(this.phone, phoneTests);
	}

	@action
	public static createFromApiResponse(
		apiResponse: CardApiResponse,
	): CardStore {
		const addressStore = new CardStore();
		const {name: addressAlias, ...address} = apiResponse;

		Object.assign(addressStore, address, {addressAlias});

		return addressStore;
	}

	@action
	public saveCard = async (): Promise<void> => {
		try {
			const response = await finddoApi.post("/addresses", {card});
		} catch (error) {
			if (error.response) throw new Error("Invalid address data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default CardStore;
