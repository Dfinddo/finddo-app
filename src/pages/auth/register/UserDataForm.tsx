import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import {Datepicker, Text, Button, Layout} from "@ui-kitten/components";
import {useUser, useSwitch} from "hooks";
import {observer} from "mobx-react-lite";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import ValidatedInput from "components/ValidatedInput";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {
	phoneFormatter,
	numericFormattingFilter,
	cpfFormatter,
	checkFieldsForErrors,
} from "utils";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";

type UserDataFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"UserDataForm"
>;

const formFields = [
	"name",
	"surname",
	"email",
	"cellphone",
	"cpf",
] as const;

const UserDataForm = observer<UserDataFormScreenProps>(props => {
	const [isLoading, setIsLoading] = useState(false);
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);
	const userStore = useUser();

	const onAdvanceAttempt = async (): Promise<void> => {
		setIsLoading(true);
		let isRegistered = false;

		if (checkFieldsForErrors(userStore, formFields))
			return setFillAttemptAsFailed();

		try {
			isRegistered = await userStore.isRegistered();
		} catch (error) {
			if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
		} finally {
			setIsLoading(false);
		}

		if (isRegistered) return Alert.alert("Erro", "Usuário já cadastrado.");
		props.navigation.navigate("BillingAddressForm");
	};

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
					onChangeText={input => (userStore.name = input)}
					label="Nome"
					maxLength={70}
					value={userStore.name}
					error={userStore.nameError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedInput
					onChangeText={input => (userStore.surname = input)}
					label="Sobrenome"
					maxLength={255}
					value={userStore.surname}
					error={userStore.surnameError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedInput
					onChangeText={input => (userStore.email = input)}
					label="Email"
					maxLength={255}
					value={userStore.email}
					error={userStore.emailError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedMaskedInput
					formatter={phoneFormatter}
					formattingFilter={numericFormattingFilter}
					onChangeText={input => (userStore.cellphone = input)}
					label="Telefone"
					keyboardType="numeric"
					maxLength={15}
					value={userStore.cellphone}
					error={userStore.cellphoneError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<ValidatedMaskedInput
					formatter={cpfFormatter}
					formattingFilter={numericFormattingFilter}
					onChangeText={input => (userStore.cpf = input)}
					label="CPF"
					keyboardType="numeric"
					maxLength={14}
					value={userStore.cpf}
					error={userStore.cpfError}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<Datepicker
					min={new Date("01/01/1920")}
					onSelect={input => (userStore.birthdate = input)}
					label="Data de Nascimento"
					date={userStore.birthdate}
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
	backgroundImageContent: {width: "100%", height: "100%"},
	finddoLogoStyle: {marginTop: 60, marginBottom: 120},
	form: {
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
	},
	cadastroFormSizeAndFont: {
		fontSize: 18,
		height: 45,
		borderBottomWidth: 2,
		textAlign: "left",
		width: 300,
	},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	input: {width: "100%"},
});
