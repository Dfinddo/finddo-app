import React, {useState} from "react";
import {
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {termos} from "../termos";
import {politica} from "../politica";
import {observer} from "mobx-react-lite";
import {Input, Modal, Text, Button, Layout, Card} from "@ui-kitten/components";
import ValidatedInput from "components/ValidatedInput";
import {validations, validateInput} from "utils";
import {useUser} from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";

const passwordTests = [
	validations.required(),
	validations.minLength(8),
	validations.maxLength(12),
];

type LoginDataFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"LoginDataForm"
>;

const LoginDataForm = observer<LoginDataFormScreenProps>(props => {
	const userStore = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [isShowingPolitics, setIsShowingPolitics] = useState(false);
	const [isShowingTermsOfUse, setIsShowingTermsOfUse] = useState(false);
	const passwordErrors =
		password === passwordConfirmation
			? validateInput(password, passwordTests)
			: "As senhas devem ser iguais";

	const submit = (): void => {
		setIsLoading(true);
		if (passwordErrors || error.response) {
			Alert.alert(
				"Erro ao se cadastrar",
				"Verifique seus dados e tente novamente",
			);
		} else if (error.request) {
			Alert.alert(
				"Falha ao se conectar",
				"Verifique sua conexão e tente novamente",
			);
		}
		setIsLoading(false);
	};

	return (
		<Layout level="1" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<Modal visible={isShowingPolitics} style={styles.modal}>
				<Card>
					<Text category="h3">Política:</Text>
					<ScrollView style={styles.modalContent}>
						<Text>{politica}</Text>
					</ScrollView>
					<Button onPress={() => setIsShowingPolitics(false)}>
						VOLTAR
					</Button>
				</Card>
			</Modal>
			<Modal visible={isShowingTermsOfUse} style={styles.modal}>
				<Card>
					<Text category="h3">Termos:</Text>
					<ScrollView style={styles.modalContent}>
						<Text>{termos}</Text>
					</ScrollView>
					<Button onPress={() => setIsShowingTermsOfUse(false)}>
						VOLTAR
					</Button>
				</Card>
			</Modal>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.contentWrapper}
			>
				<Text style={styles.fontTitle}>Crie sua conta</Text>
				<Input
					onChangeText={input => (userStore.email = input)}
					label="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					maxLength={128}
					value={userStore.email}
				/>
				<Input
					onChangeText={setPassword}
					label="Senha"
					value={password}
					secureTextEntry={true}
					maxLength={12}
				/>
				<ValidatedInput
					onChangeText={setPasswordConfirmation}
					label="Confirmar Senha"
					value={passwordConfirmation}
					secureTextEntry={true}
					maxLength={12}
					error={passwordErrors}
				/>
				<Text style={styles.text}>
					Ao criar sua conta, você está concordando com os nossos
					<Text
						onPress={() => setIsShowingTermsOfUse(true)}
						status="primary"
					>
						{" "}
						Termos e Condições de Uso
					</Text>{" "}
					e com nossa
					<Text
						onPress={() => setIsShowingPolitics(true)}
						status="primary"
					>
						{" "}
						Política de Privacidade.
					</Text>
				</Text>
			</KeyboardAvoidingView>
			<Button onPress={submit}>CRIAR</Button>
		</Layout>
	);
});

export default LoginDataForm;

const styles = StyleSheet.create({
	container: {flex: 1},
	contentWrapper: {
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
	},
	text: {textAlign: "center"},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	modal: {
		height: "90%",
		width: "95%",
		alignItems: "center",
		justifyContent: "center",
	},
	modalContent: {height: 300},
});
