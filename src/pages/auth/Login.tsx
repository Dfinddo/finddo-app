/* eslint-disable @typescript-eslint/naming-convention */
import React, {useState, useCallback} from "react";
import {
	ScrollView,
	Platform,
	KeyboardAvoidingView,
	Alert,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import {SvgXml} from "react-native-svg";
import {finddoLogo} from "../../assets/svg/finddo-logo";
import {Input, Button, Text, Layout, Icon, IconProps} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AuthStackParams} from "src/routes/auth";
import { useDispatch } from "react-redux";
import { updateUser } from "stores/modules/user/actions";
import finddoApi, { UserApiResponse } from "finddo-api";
import { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OneSignal from "react-native-onesignal";
import { BACKEND_URL_STORAGE } from "@env";

type LoginScreenProps = StackScreenProps<AuthStackParams, "Login">;

// interface LoginResponse {
//   jwt: string;
// 	photo: {photo:string | null};
//   user: {
//     data: {
//       id: string;
//       attributes: UserApiResponse;
//     };
//   };
// }

const Login = (props:LoginScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props: IconProps): JSX.Element => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );

	const login = async (): Promise<void> => {
		setIsLoading(true);
		try {
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
			}: require("../../assets/sem-foto.png")});
			
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
			// console.log(error);
			if (error.message === "Invalid credentials")
				Alert.alert("Email ou senha incorretos");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else if (error.message === "Account not validated")
				Alert.alert("Sua conta ainda não foi validada.");
			else throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Layout level="1" style={styles.container}>
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.loginForm}
				>
					<SvgXml
						xml={finddoLogo}
						width={126}
						height={30}
						style={styles.finddoLogoStyle}
					></SvgXml>
					<Text style={styles.fontTitle}>Login</Text>
					<Input
						label="E-mail"
						autoCapitalize="none"
						keyboardType="email-address"
						onChangeText={setEmail}
						value={email}
					/>
					<Input
						label="Senha"
						value={password}
						onChangeText={setPassword}
						accessoryRight={renderIcon}
						secureTextEntry={secureTextEntry}
					/>
					<Text
						style={styles.loginEsqueciSenha}
						onPress={() => props.navigation.navigate("ForgotPassword")}
					>
						Esqueci minha senha
					</Text>
					<Button style={styles.buttonConfirm} onPress={login}>
						ENTRAR
					</Button>
					<Text>
						Ainda não é cadastrado?{" "}
						<Text
							style={styles.cadastreSe}
							onPress={() => props.navigation.navigate("Register")}
						>
							Cadastre-se
						</Text>
					</Text>
				</KeyboardAvoidingView>
			</ScrollView>
		</Layout>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {flex: 1},
	// modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	finddoLogoStyle: {marginTop: 25, marginBottom: 120},
	loginForm: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 15,
	},
	loginEsqueciSenha: {
		fontSize: 18,
		height: 45,
		textAlign: "center",
		marginTop: 10,
		width: 300,
		textDecorationLine: "underline",
		textAlignVertical: "bottom",
	},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	buttonConfirm: {
		margin: 16,
	},
	cadastreSe: {fontWeight: "bold", textDecorationLine: "underline"},
});
