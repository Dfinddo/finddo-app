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
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "stores/modules/user/actions";
import { isRegistered } from "finddo-api";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";

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
	const userStore = useSelector<State, UserState>(state => state.user);
	
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
			const isInvalid = await isRegistered({email, cellphone, cpf});

			if(isInvalid) {
				Alert.alert("Finddo", "Erro nos dados, verificar se são válidos.");
				
				return;
			}

			dispatch(updateUser({
				...userStore,
				name,
				surname,
				email,
				cellphone,
				cpf,
				birthdate,
			}));
			props.navigation.navigate("BillingAddressForm");
		} catch (error) {
			if (error.message === "Connection error")
				Alert.alert("Finddo", "Erro na conexão");		
			else {
				Alert.alert("Finddo", error.message);
				// throw error;
			}
		} finally {
			setIsLoading(false);
		}

	}, [
		dispatch,
		props.navigation,
		userStore,
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
					keyboardType="email-address"
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
				<Button style={styles.buttom} onPress={onAdvanceAttempt}>CONTINUAR</Button>
			</KeyboardAvoidingView>
		</Layout>
	);
});

export default UserDataForm;

const styles = StyleSheet.create({
	container: {flex: 1},
	form: {
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
	},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	input: {width: "100%"},
	buttom: {
		width: "90%", 
		height: 24,
		margin: 16,
	},
});
