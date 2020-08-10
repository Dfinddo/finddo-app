import React, {useState} from "react";
import {
	ScrollView,
	Platform,
	KeyboardAvoidingView,
	Alert,
	StyleSheet,
} from "react-native";
import {SvgXml} from "react-native-svg";
import {finddoLogo} from "../../assets/svg/finddo-logo";
import {Input, Button, Text, Layout} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {useUser} from "hooks";
import {StackScreenProps} from "@react-navigation/stack";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AuthStackParams} from "src/routes/auth";

type LoginScreenProps = StackScreenProps<AuthStackParams, "Login">;

const Login = observer<LoginScreenProps>(props => {
	const userStore = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const login = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await userStore.signIn(email, password);
		} catch (error) {
			if (error.message === "Invalid credentials")
				Alert.alert("Email ou senha incorretos");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
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
						onChangeText={setPassword}
						value={password}
						secureTextEntry={true}
					/>
					<Text
						style={styles.loginEsqueciSenha}
						onPress={() => props.navigation.navigate("ForgotPassword")}
					>
						Esqueci minha senha
					</Text>
					<Button onPress={login}>ENTRAR</Button>
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
});

export default Login;

const styles = StyleSheet.create({
	container: {flex: 1},
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
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
	cadastreSe: {fontWeight: "bold", textDecorationLine: "underline"},
});
