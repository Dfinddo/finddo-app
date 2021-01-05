import React, {useState, useEffect, useCallback} from "react";
import {
	View,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Button, Datepicker, Layout} from "@ui-kitten/components";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import ValidatedInput from "components/ValidatedInput";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {
	monthYearFormatter,
	numericFormattingFilter,
	phoneFormatter,
	cpfFormatter,
	creditCardFormatter,
	validations,
	validateInput,
} from "utils";
import {useSwitch} from "hooks";
import {StackScreenProps} from "@react-navigation/stack";
import {PaymentMethodsStackParams} from "src/routes/app";
import {localeDateService} from "src/utils/calendarLocale";
import { doingPaymentMoip } from "src/services/moip";
import { format } from "date-fns";

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "NewCardPayment">;

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


const NewCardPayment = (({navigation, route}: CardsScreenProps): JSX.Element => {
	const {order_id} = route.params;

	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);
	const [isLoading, setIsLoading] = useState(false);

	const [number, setNumber] = useState("");
	const [numberError, setNumberError] = useState<string|undefined>("");

	const [expirationDate, setExpirationDate] = useState("");
	const [expirationDateError, setExpirationDateError] = useState<string|undefined>("");

	const [cvc, setCvc] = useState("");
	const [cvcError, setCvcError] = useState<string|undefined>("");

	const [holderName, setHolderName] = useState("");
	const [holderNameError, setHolderNameError] = useState<string|undefined>("");

	const [taxDocument, setTaxDocument] = useState("");
	const [taxDocumentError, setTaxDocumentError] = useState<string|undefined>("");

	const [phone, setPhone] = useState("");
	const [phoneError, setPhoneError] = useState<string|undefined>("");

	const [holderBirthdate, setHolderBirthdate] = useState<Date>(new Date());

	useEffect(
		() =>
			Alert.alert(
				"ATENÇÃO",
				"Preencha os dados rigorosamente da MESMA forma que no seu cartão",
				[{text: "OK"}],
			),
		[],
	);

	// eslint-disable-next-line require-await
	const saveCard = useCallback(async (): Promise<void> => {

		try {
			doingPaymentMoip({
				order_id,
				cvc,
				expirationDate,
				number,
			})
		} catch (error) {
			if (error.response) throw new Error("Invalid credit card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}, [cvc, expirationDate, number, order_id]);

	const onSaveAttempt = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true);
			if (
				cvcError || 
				expirationDateError || 
				phoneError || 
				numberError || 
				holderNameError || 
				taxDocumentError) return setFillAttemptAsFailed();

			await saveCard();
			navigation.navigate("Cards");
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			Alert.alert("Erro ao tentar adicionar o cartão, tente novamente");
		} finally {
			setIsLoading(false);
		}
	}, [
		navigation, 
		setFillAttemptAsFailed, 
		saveCard,
		cvcError,
		expirationDateError,
		phoneError,
		numberError,
		holderNameError,
		taxDocumentError]);

	return (
		<Layout level="2" style={styles.container}>
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<View>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						keyboardVerticalOffset={Platform.OS === "ios" ? 100 : void 0}
					>
						<Layout style={styles.formWrapper} level="1">
							<ValidatedMaskedInput
								formatter={creditCardFormatter}
								formattingFilter={numericFormattingFilter}
								label="Número do Cartão"
								placeholder="1234 3456 5678 7890"
								keyboardType="number-pad"
								maxLength={19}
								error={numberError}
								forceErrorDisplay={hasFailedToFillForm}
								value={number}
								onChangeText={text => {
									setNumberError(validateInput(text, numberTests));
									setNumber(text);
								}}
							/>
							<View style={styles.formRow}>
								<ValidatedMaskedInput
									formatter={monthYearFormatter}
									formattingFilter={numericFormattingFilter}
									style={styles.expirationDateInput}
									label="Validade"
									placeholder="MM/AA"
									maxLength={5}
									keyboardType="number-pad"
									error={expirationDateError}
									forceErrorDisplay={hasFailedToFillForm}
									value={expirationDate}
									onChangeText={text => {
										setExpirationDateError(validateInput(text, expirationDateTests));
										setExpirationDate(text);
									}}
								/>
								<ValidatedInput
									style={styles.cvc}
									label="CVC"
									keyboardType="number-pad"
									maxLength={3}
									placeholder="123"
									error={cvcError}
									forceErrorDisplay={hasFailedToFillForm}
									value={cvc}
									onChangeText={text => {
										setCvcError(validateInput(text, cvcTests));
										setCvc(text);
									}}
								/>
								<Datepicker
									dateService={localeDateService}
									style={styles.rowLastItem}
									label="Data de Nascimento"
									placeholder="dd/mm/aaaa"
									min={new Date("01/01/1920")}
									date={holderBirthdate}
									onSelect={date => setHolderBirthdate(date)}
								/>
							</View>
							<ValidatedInput
								label="Titular"
								placeholder="Nome como aparece no cartão"
								value={holderName}
								error={holderNameError}
								forceErrorDisplay={hasFailedToFillForm}
								onChangeText={text => {
									setHolderNameError(validateInput(text, holderNameTests));
									setHolderName(text);
								}}
							/>
							<ValidatedMaskedInput
								formatter={cpfFormatter}
								formattingFilter={numericFormattingFilter}
								label="CPF"
								placeholder="000.000.000-00"
								keyboardType={"number-pad"}
								maxLength={14}
								value={taxDocument}
								error={taxDocumentError}
								forceErrorDisplay={hasFailedToFillForm}
								onChangeText={text => {
									setTaxDocumentError(validateInput(text, taxDocumentTests));
									setTaxDocument(text);
								}}
							/>
							<ValidatedMaskedInput
								formatter={phoneFormatter}
								formattingFilter={numericFormattingFilter}
								label="Telefone"
								placeholder="(00) 00000-0000"
								keyboardType={"number-pad"}
								maxLength={15}
								value={phone}
								error={phoneError}
								forceErrorDisplay={hasFailedToFillForm}
								onChangeText={text => {
									setPhoneError(validateInput(text, phoneTests));
									setPhone(text);
								}}
							/>
						</Layout>
					</KeyboardAvoidingView>
					<Button style={styles.button} onPress={onSaveAttempt}>
						REALIZAR PAGAMENTO
					</Button>
				</View>
			</ScrollView>
		</Layout>
	);
});

export default NewCardPayment;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
	},
	formWrapper: {
		marginVertical: 40,
		flex: 1,
		padding: 15,
	},
	formRow: {
		flexDirection: "row",
	},
	expirationDateInput: {
		flex: 4,
		marginRight: 15,
	},
	cvc: {
		flex: 3,
		marginRight: 15,
	},
	rowLastItem: {
		flex: 5,
	},
	button: {
		margin: 16,
	},
});
