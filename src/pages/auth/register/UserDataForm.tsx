/* eslint-disable @typescript-eslint/naming-convention */
import React, {useState, useCallback} from "react";
import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import {Datepicker, Text, Button, Layout} from "@ui-kitten/components";
import {useSwitch} from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import ValidatedInput from "components/ValidatedInput";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {
	phoneFormatter,
	numericFormattingFilter,
	cpfFormatter,
	validations,
	validateInput,
} from "utils";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";
import {localeDateService} from "src/utils/calendarLocale";
import { useDispatch } from "react-redux";
import { signUpData } from "stores/modules/user/actions";
import finddoApi from "finddo-api";
import { AxiosResponse } from "axios";

type UserDataFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"UserDataForm"
>;

interface IsValidProps {
	is_valid: boolean,
	error: string | null,
}

const firstNameTests = [validations.required(), validations.maxLength(70)];
const nameTests = [validations.required(), validations.maxLength(255)];
const emailTests = [
	validations.required(),
	validations.validEmail(),
	validations.maxLength(128),
];
const cellphoneTests = [validations.required(), validations.definedLength(11)];
const cpfTests = [validations.required(), validations.definedLength(11)];

const UserDataForm = ((props: UserDataFormScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState<string|undefined>("Campo obrigatório");

	const [surname, setSurname] = useState("");
	const [surnameError, setSurnameError] = useState<string|undefined>("Campo obrigatório");

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string|undefined>("Campo obrigatório");

	const [cellphone, setCellphone] = useState("");
	const [cellphoneError, setCellphoneError] = useState<string|undefined>("Campo obrigatório");

	const [cpf, setCpf] = useState("");
	const [cpfError, setCpfError] = useState<string|undefined>("Campo obrigatório");

	const [birthdate, setBirthdate] = useState(new Date());

	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onAdvanceAttempt = useCallback(async (): Promise<void> => {

		if (nameError || surnameError || emailError || cellphoneError || cpfError)
			return setFillAttemptAsFailed();

		setIsLoading(true);

		try {
			const isValid: AxiosResponse<IsValidProps> = await finddoApi.get(
				`/users?email=${email}&cellphone=${cellphone}&cpf=${cpf}`,
			);

			console.log(isValid)

			if (isValid.data.error) return Alert.alert("Erro", isValid.data.error);

			
		} catch (error) {
			if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else {
				setIsLoading(false);
				throw error;
			}
		} finally {
			setIsLoading(false);
		}

		dispatch(signUpData({
			name,
			surname,
			email,
			cellphone,
			cpf,
			birthdate,
		}));
		props.navigation.navigate("BillingAddressForm");

	}, [
		dispatch,
		props.navigation,
		name,
		surname,
		email,
		cellphone,
		cpf,
		birthdate,
		nameError,
		surnameError,
		emailError,
		cellphoneError,
		cpfError,
		setFillAttemptAsFailed,
	]);

	
	return (
		<Layout level="1" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 50 : void 0}
				style={styles.form}
			>
				<Text style={styles.fontTitle}>Crie sua conta</Text>

				<ValidatedInput
					onChangeText={input => {
						setName(input);
						setNameError(validateInput(input, firstNameTests));
					}}
					label="Nome"
					maxLength={70}
					value={name}
					error={nameError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedInput
					onChangeText={input => {
						setSurname(input);
						setSurnameError(validateInput(input, nameTests));
					}}
					label="Sobrenome"
					maxLength={255}
					value={surname}
					error={surnameError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedInput
					onChangeText={input => {
						setEmail(input);
						setEmailError(validateInput(input, emailTests))
					}}
					label="Email"
					maxLength={255}
					value={email}
					error={emailError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedMaskedInput
					formatter={phoneFormatter}
					formattingFilter={numericFormattingFilter}
					onChangeText={input => {
						setCellphone(input);
						setCellphoneError(validateInput(input, cellphoneTests));
					}}
					label="Telefone"
					keyboardType="numeric"
					maxLength={15}
					value={cellphone}
					error={cellphoneError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedMaskedInput
					formatter={cpfFormatter}
					formattingFilter={numericFormattingFilter}
					onChangeText={input => {
						setCpf(input);
						setCpfError(validateInput(input, cpfTests));
					}}
					label="CPF"
					keyboardType="numeric"
					maxLength={14}
					value={cpf}
					error={cpfError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<Datepicker
					dateService={localeDateService}
					min={new Date("01/01/1920")}
					onSelect={input => (setBirthdate(input))}
					label="Data de Nascimento"
					date={birthdate}
					style={styles.input}
				/>
				<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
			</KeyboardAvoidingView>
		</Layout>
	);
});

export default UserDataForm;

const styles = StyleSheet.create({
	container: {flex: 1},
	// backgroundImageContent: {width: "100%", height: "100%"},
	// finddoLogoStyle: {marginTop: 60, marginBottom: 120},
	form: {
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
	},
	// cadastroFormSizeAndFont: {
	// 	fontSize: 18,
	// 	height: 45,
	// 	borderBottomWidth: 2,
	// 	textAlign: "left",
	// 	width: 300,
	// },
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	// modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	input: {width: "100%"},
});
