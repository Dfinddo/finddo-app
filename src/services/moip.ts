import {RSA} from "react-native-rsa-native";
import {MoipCreditCard} from "moip-sdk-js";
import {MOIP_CREDS_DATA_PUBLIC_KEY} from "@env";
import finddoApi from "finddo-api";

interface ICreditCardProps {
  number: string,
  cvc: string,
	expirationDate: string,
	holder: {
		fullname: string,
		birthdate: string,
		taxDocument: {
			type: string,
			number: string,
		},
		phone: {
			countryCode: string,
			areaCode: string,
			number: string,
		},
	}
}

export function doingPaymentMoip ({
	number, 
	cvc, 
	expirationDate, 
	holder
}: ICreditCardProps): void {
  MoipCreditCard.setEncrypter(RSA, "react-native")
		.setPubKey(MOIP_CREDS_DATA_PUBLIC_KEY)
		.setCreditCard({
			number,
			cvc,
			expirationMonth: expirationDate.substr(0, 2),
			expirationYear: expirationDate.substr(2, 2),
		})
		.hash()
		.then(async hash => {
			// TODO: ajustar rota
			await finddoApi.post("/users/add_credit_card", {
				credit_card: {
					method: "CREDIT_CARD",
					creditCard: {
						hash,
						holder,
					}
				},
			});
		}).catch(error => {throw new Error("Invalid credit card data")});
}