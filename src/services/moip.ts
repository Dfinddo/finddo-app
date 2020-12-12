import {RSA} from "react-native-rsa-native";
import {MoipCreditCard} from "moip-sdk-js";
import {MOIP_CREDS_DATA_PUBLIC_KEY} from "@env";

interface ICreditCardProps {
  number: string,
  cvc: string,
  expirationDate: string
}

export function createHashMoip (creditCard: ICreditCardProps): void {
  MoipCreditCard.setEncrypter(RSA, "react-native")
		.setPubKey(MOIP_CREDS_DATA_PUBLIC_KEY)
		.setCreditCard({
			number: creditCard.number,
			cvc: creditCard.cvc,
			expirationMonth: creditCard.expirationDate.substr(0, 2),
			expirationYear: creditCard.expirationDate.substr(2, 2),
		})
		.hash()
		.then(hash => hash).catch(error => {throw new Error("Invalid credit card data")});
}