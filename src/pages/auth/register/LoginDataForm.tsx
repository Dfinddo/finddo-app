/* eslint-disable @typescript-eslint/naming-convention */
import React, {useState, useCallback} from "react";
import {
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {termos} from "../termos";
import {politica} from "../politica";
import {Input, Modal, Text, Button, Layout, Card} from "@ui-kitten/components";
import ValidatedInput from "components/ValidatedInput";
import {validations, validateInput} from "utils";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParams} from "src/routes/auth";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { format } from "date-fns";
import finddoApi from "finddo-api";
import { updateUser } from "stores/modules/user/actions";
import OneSignal from "react-native-onesignal";
import { BACKEND_URL_STORAGE } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const passwordTests = [
	validations.required(),
	validations.minLength(8),
	validations.maxLength(12),
];

type LoginDataFormScreenProps = StackScreenProps<AuthStackParams, "Register">;

const LoginDataForm = ((props: LoginDataFormScreenProps): JSX.Element => {
	const userStore = useSelector<State, UserState>(state => state.user);
	const dispatch = useDispatch();
	
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [isShowingPolitics, setIsShowingPolitics] = useState(false);
	const [isShowingTermsOfUse, setIsShowingTermsOfUse] = useState(false);
	const passwordErrors =
		password === passwordConfirmation
			? validateInput(password, passwordTests)
			: "As senhas devem ser iguais";

	const submit = useCallback(async (): Promise<void> => {
		if(!userStore.billingAddress)return Alert.alert("Erro ao se cadastrar", "Endereço não preenchido");
		if (passwordErrors)return Alert.alert("Erro ao se cadastrar", "As senhas devem ser iguais");

		const {name, surname, cellphone, email, cpf, user_type, birthdate} = userStore;
		const {
			city,
			state,
			cep,
			district,
			number,
			street,
			complement,
		} = userStore.billingAddress;

		console.log(userStore);

		if (!birthdate) {
			throw new Error("Invalid birthdate date");
		}

		try {
			setIsLoading(true);

			await finddoApi.post("/users", {
				user: {
					name,
					surname,
					cellphone,
					email,
					cpf,
					user_type,
					birthdate: format(birthdate, "dd/MM/yyyy"),
					password,
					password_confirmation: passwordConfirmation,
				},
				address: {
					city,
					state,
					cep,
					district,
					number,
					street,
					complement,
				},
			});

			if (userStore.user_type === "professional") {
				Alert.alert(
					"Profissional cadastrado com sucesso. Aguardando aprovação",
				);
				props.navigation.navigate("Login");
			}

			const response = await finddoApi.post("login", {
				email, 
				password,
			});

			const {jwt, photo} = response.data;
			const {id, attributes: user} = response.data.user.data;
			
			if (user.activated === false) throw new Error("Account not validated");
					
			finddoApi.defaults.headers.Authorization = `Bearer ${jwt}`;

			const logged = Object.assign(user, {id, profilePicture: photo.photo ? {
				uri: `${BACKEND_URL_STORAGE}${photo.photo}`,
			}: require("../../../assets/sem-foto.png")});
			
			AsyncStorage.setItem("access-token", JSON.stringify(jwt));
			AsyncStorage.setItem("user", JSON.stringify(logged));
			
			OneSignal.getPermissionSubscriptionState(async(status: {userId: string}) => {
				await finddoApi.get('users/set_player_id', {
					params: {
						player_id: status.userId,
					}
				});
			});
			dispatch(updateUser(logged));
		} catch (error) {
			if (error.message === "Invalid credentials")
				Alert.alert("Email ou senha incorretos");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	}, [password, passwordConfirmation, passwordErrors, props, userStore, dispatch]);

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
