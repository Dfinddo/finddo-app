interface ICreditCardMoip {
	number: string;
	cvc: string;
	expirationMonth: string;
	expirationYear: string;
}

interface IMoipValidator {
	isValidNumber(creditCardNumber: string): boolean;
	isSecurityCodeValid(creditCardNumber: string, cvc: string): boolean;
	isExpiryDateValid(month: string, year: string): boolean;
}

interface IMoipCreditCard {
	setEncrypter(
		rsa: any,
		module: string,
	): {
		setPubKey(
			publicKey: string,
		): {
			setCreditCard(
				data: ICreditCardMoip,
			): {hash(): {then(action: (hash: string) => void): Promise<void>}};
		};
	};
}

declare module "moip-sdk-js" {
	export const MoipValidator: IMoipValidator;
	export const MoipCreditCard: IMoipCreditCard;
}
