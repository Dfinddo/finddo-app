import React, {useState, useEffect} from "react";
import {
	View,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Button, Datepicker, Layout} from "@ui-kitten/components";
import CardStore from "stores/card-store";
import {observer} from "mobx-react-lite";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import ValidatedInput from "components/ValidatedInput";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {
	monthYearFormatter,
	numericFormattingFilter,
	phoneFormatter,
	cpfFormatter,
	creditCardFormatter,
} from "utils";
import {useSwitch} from "hooks";
import {StackScreenProps} from "@react-navigation/stack";
import {PaymentMethodsStackParams} from "src/routes/app";

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "AddCard">;

const AddCard = observer<CardsScreenProps>(props => {
	const [cardStore] = useState(new CardStore());
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	useEffect(
		() =>
			Alert.alert(
				"ATENÇÃO",
				"Preencha os dados rigorosamente da MESMA forma que no seu cartão",
				[{text: "OK"}],
			),
		[],
	);

	const onSaveAttempt = (): void => {
		if (cardStore.hasErrors) return setFillAttemptAsFailed();
		props.navigation.navigate("Cards");
	};

	return (
		<Layout level="2" style={styles.container}>
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={false} />
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
								error={cardStore.numberError}
								forceErrorDisplay={hasFailedToFillForm}
								value={cardStore.number}
								onChangeText={text => (cardStore.number = text)}
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
									error={cardStore.expirationDateError}
									forceErrorDisplay={hasFailedToFillForm}
									value={cardStore.expirationDate}
									onChangeText={text =>
										(cardStore.expirationDate = text)
									}
								/>
								<ValidatedInput
									style={styles.cvv}
									label="CVV"
									keyboardType="number-pad"
									maxLength={3}
									placeholder="123"
									error={cardStore.cvvError}
									forceErrorDisplay={hasFailedToFillForm}
									value={cardStore.cvv}
									onChangeText={text => (cardStore.cvv = text)}
								/>
								<Datepicker
									style={styles.rowLastItem}
									label="Data de Nascimento"
									placeholder="dd/mm/aaaa"
									min={new Date("01/01/1920")}
									date={cardStore.holderBirthdate}
									onSelect={text => (cardStore.holderBirthdate = text)}
								/>
							</View>
							<ValidatedInput
								label="Titular"
								placeholder="Nome como aparece no cartão"
								value={cardStore.holderName}
								error={cardStore.holderNameError}
								forceErrorDisplay={hasFailedToFillForm}
								onChangeText={text => (cardStore.holderName = text)}
							/>
							<ValidatedMaskedInput
								formatter={cpfFormatter}
								formattingFilter={numericFormattingFilter}
								label="CPF"
								onChangeText={text => (cardStore.taxDocument = text)}
								placeholder="000.000.000-00"
								keyboardType={"number-pad"}
								maxLength={14}
								value={cardStore.taxDocument}
								error={cardStore.taxDocumentError}
								forceErrorDisplay={hasFailedToFillForm}
							/>
							<ValidatedMaskedInput
								formatter={phoneFormatter}
								formattingFilter={numericFormattingFilter}
								label="Telefone"
								placeholder="(00) 00000-0000"
								keyboardType={"number-pad"}
								maxLength={15}
								onChangeText={text => (cardStore.phone = text)}
								value={cardStore.phone}
								error={cardStore.phoneError}
								forceErrorDisplay={hasFailedToFillForm}
							/>
						</Layout>
					</KeyboardAvoidingView>
					<Button onPress={onSaveAttempt}>SALVAR</Button>
				</View>
			</ScrollView>
		</Layout>
	);
});

export default AddCard;

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
	input: {
		marginHorizontal: 12,
		marginVertical: 8,
	},
	formRow: {
		flexDirection: "row",
	},
	expirationDateInput: {
		flex: 4,
		marginRight: 15,
	},
	cvv: {
		flex: 3,
		marginRight: 15,
	},
	rowLastItem: {
		flex: 5,
	},
});
