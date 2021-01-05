import {RSA} from "react-native-rsa-native";
import {MoipCreditCard} from "moip-sdk-js";
import {MOIP_CREDS_DATA_PUBLIC_KEY} from "@env";
import finddoApi from "finddo-api";

interface ICreditCardProps {
	order_id: string,
  number: string,
  cvc: string,
	expirationDate: string,
	saveCard?: boolean,
}

export function doingPaymentMoip ({
	order_id,
	number, 
	cvc, 
	expirationDate, 
	saveCard= false,
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
			await finddoApi.post(`/orders/create_payment/${order_id}`, {
					payment_data: {
							installmentCount: 1,
							statementDescriptor: "Finddo",
							fundingInstrument: {
									method: "CREDIT_CARD",
									creditCard: {
										hash,
										store: saveCard,
									}
							}
					}
			});
		}).catch(error => {throw new Error("Invalid credit card data")});
}