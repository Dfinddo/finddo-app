/* eslint-disable @typescript-eslint/naming-convention */
import {observable, computed, action, runInAction} from "mobx";
import {validations, validateInput, pick, checkFieldsForErrors} from "utils";
import finddoApi, {CardApiResponse} from "finddo-api";
import {format} from "date-fns";

const numberTests = [
	validations.required(),
	validations.definedLength(16),
	validations.validCreditCardNumber(),
];
const expirationDateTests = [
	validations.required(),
	validations.definedLength(4),
	validations.validCreditCardDate(),
];
const cvcTests = [validations.required(), validations.definedLength(3)];
const holderNameTests = [validations.required()];
const taxDocumentTests = [
	validations.required(),
	validations.definedLength(11),
];
const phoneTests = [validations.required(), validations.definedLength(11)];

const cardApiFields = [
	"number",
	"expirationDate",
	"cvc",
	"holderName",
	"holderBirthdate",
	"taxDocument",
	"phone",
] as const;

class CardStore {
	@observable public number = "";
	@computed public get numberError(): string | undefined {
		return validateInput(this.number, numberTests);
	}

	@observable public expirationDate = "";
	@computed public get expirationDateError(): string | undefined {
		return validateInput(this.expirationDate, expirationDateTests);
	}

	@observable public cvc = "";
	@computed public get cvcError(): string | undefined {
		return validateInput(this.cvc, cvcTests);
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

	@computed public get hasErrors(): boolean {
		return checkFieldsForErrors(this, cardApiFields);
	}

	@action
	public static createFromApiResponse(
		apiResponse: CardApiResponse,
	): CardStore {
		const cardStore = new CardStore();
		const {name: cardAlias, ...card} = apiResponse;

		Object.assign(cardStore, card, {cardAlias});

		return cardStore;
	}

	@action
	public saveCard = async (): Promise<void> => {
		const creditCard = pick(this, cardApiFields);

		try {
			await finddoApi.post("/users/add_credit_card", {
				credit_card: {
					method: "CREDIT_CARD",
					creditCard: {
						expirationMonth: creditCard.expirationDate.substr(0, 2),
						expirationYear: creditCard.expirationDate.substr(2, 2),
						number: creditCard.number,
						cvc: creditCard.cvc,
						holder: {
							fullname: creditCard.holderName,
							birthdate: format(
								creditCard.holderBirthdate,
								"yyyy-MM-dd",
							),
							taxDocument: {
								type: "CPF",
								number: creditCard.taxDocument,
							},
							phone: {
								countryCode: "55",
								areaCode: creditCard.phone.substr(0, 2),
								number: creditCard.phone.substr(2, 9),
							},
						},
					},
				},
			});
		} catch (error) {
			if (error.response) throw new Error("Invalid credit card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default CardStore;
