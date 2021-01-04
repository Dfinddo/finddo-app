import React, {useState} from "react";
import {
	ScrollView,
	Platform,
	KeyboardAvoidingView,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import {SvgXml} from "react-native-svg";
import {finddoLogo} from "../../assets/svg/finddo-logo";
import {Input, Button, Text, Layout, Icon, IconProps} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AuthStackParams} from "src/routes/auth";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "stores/modules/user/actions";
import { State } from "stores/index";

type LoginScreenProps = StackScreenProps<AuthStackParams, "Login">;

const Login = (props:LoginScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const isLoading = useSelector<State, boolean>(state => state.application.isLoading);
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

	const login = (): void => {
		dispatch(signIn(email,password));
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
