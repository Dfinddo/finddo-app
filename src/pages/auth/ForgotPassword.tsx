import React, {useState, FC} from "react";
import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import {Button, Layout, Input, Text} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParams} from "src/routes/auth";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";

type ForgotPasswordScreenProps = StackScreenProps<
	AuthStackParams,
	"ForgotPassword"
>;

const ForgotPassword: FC<ForgotPasswordScreenProps> = ({navigation}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");

	const recoverPassword = (): void => {
		setIsLoading(true);

		try {
			Alert.alert(
				"Recuperação de Senha",
				"Será enviado email com instruções de recuperação " +
					"se existir usuário associado ao email fornecido.",
				[
					{
						text: "OK",
						onPress: navigation.goBack,
					},
				],
			);
		} catch (error) {
			if (error.response)
				Alert.alert(
					"Recuperação de Senha",
					"Será enviado email com instruções de recuperação " +
						"se existir usuário associado ao email fornecido.",
					[
						{
							text: "OK",
							onPress: navigation.goBack,
						},
					],
				);
			else if (error.request)
				Alert.alert(
					"Falha ao executar a operação",
					"Verifique sua conexão e tente novamente",
					[
						{
							text: "OK",
							onPress: () => setIsLoading(false),
						},
					],
				);
		}
	};

	return (
		<Layout level="1" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.containerForm}
			>
				<Text category="h3">Esqueci minha senha</Text>
				<Input
					onChangeText={setEmail}
					placeholder="Email"
					keyboardType="email-address"
					maxLength={100}
					value={email}
				/>
				<Button onPress={recoverPassword}>CONTINUAR</Button>
			</KeyboardAvoidingView>
		</Layout>
	);
};

export default ForgotPassword;

const styles = StyleSheet.create({
	container: {flex: 1},
	containerForm: {
		flex: 1,
		padding: 15,
		alignItems: "center",
		justifyContent: "space-around",
	},
});
