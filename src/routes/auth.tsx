import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {Login, ForgotPassword} from "pages/auth";
import {
	UserDataForm,
	BillingAddressForm,
	LoginDataForm,
	SelectUserType,
} from "pages/auth/register";
import {useTheme} from "@ui-kitten/components";

const AuthStack = createStackNavigator<AuthStackParams>();
const RegisterStack = createStackNavigator<RegisterStackParams>();

const RegisterRoute = (): JSX.Element => (
	<RegisterStack.Navigator initialRouteName="SelectUserType">
		<RegisterStack.Screen name="SelectUserType" component={SelectUserType} />
		<RegisterStack.Screen name="UserDataForm" component={UserDataForm} />
		<RegisterStack.Screen
			name="BillingAddressForm"
			component={BillingAddressForm}
		/>
		<RegisterStack.Screen name="LoginDataForm" component={LoginDataForm} />
	</RegisterStack.Navigator>
);

const AuthRoute = (): JSX.Element => {
	const theme = useTheme();

	const screenOptions = {
		headerStyle: {
			backgroundColor: theme["background-basic-color-1"],
		},
		headerTintColor: theme["text-basic-color"],
	};

	return (
		<AuthStack.Navigator
			screenOptions={screenOptions}
			initialRouteName="Login"
		>
			<AuthStack.Screen
				name="Login"
				component={Login}
				options={{headerShown: false}}
			/>
			<AuthStack.Screen
				name="ForgotPassword"
				component={ForgotPassword}
				options={{title: "Recuperar Senha"}}
			/>
			<AuthStack.Screen
				name="Register"
				component={RegisterRoute}
				options={{title: "Criar Conta"}}
			/>
		</AuthStack.Navigator>
	);
};

export default AuthRoute;

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type RegisterStackParams = {
	SelectUserType: undefined;
	UserDataForm: undefined;
	BillingAddressForm: undefined;
	LoginDataForm: undefined;
};

export type AuthStackParams = {
	Login: undefined;
	ForgotPassword: undefined;
	Register: undefined;
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */
/* eslint-enable @typescript-eslint/naming-convention */
