interface IMoipValidator {
	isValidNumber(creditCardNumber: string): boolean;
	isSecurityCodeValid(creditCardNumber: string, cvc: string): boolean;
	isExpiryDateValid(month: string, year: string): boolean;
}

declare module "moip-sdk-js" {
	export const MoipValidator: IMoipValidator;
}
