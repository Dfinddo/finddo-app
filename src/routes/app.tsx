import React, {FC} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerContentComponentProps,
} from "@react-navigation/drawer";
import {MyServices, ViewService} from "pages/app/services";
import {
	ServiceCategories,
	ServiceDescription,
	ServiceDate,
	ServicePhotos,
	ServiceAddress,
	ConfirmService,
} from "pages/app/services/new-service";
import {Drawer, DrawerItem, IndexPath} from "@ui-kitten/components";
import {Help} from "pages/app";
import {Profile} from "pages/app/profile";
import {MyAddresses, ManageAddress} from "pages/app/addresses";
import Chat from "pages/app/chat/Chat";
import {Cards, AddCard} from "pages/app/payment-methods";
import {useThemedHeaderConfig} from "hooks";

const PaymentMethodsStack = createStackNavigator<PaymentMethodsStackParams>();
const AddressStack = createStackNavigator<AddressStackParams>();
const ServicesStack = createStackNavigator<ServicesStackParams>();
const NewServiceStack = createStackNavigator<NewServiceStackParams>();
const AppDrawer = createDrawerNavigator<AppDrawerParams>();

const PaymentMethodsRoute: FC = () => {
	const screenOptions = useThemedHeaderConfig();

	return (
		<PaymentMethodsStack.Navigator
			screenOptions={screenOptions}
			initialRouteName="Cards"
		>
			<PaymentMethodsStack.Screen
				name="Cards"
				component={Cards}
				options={{title: "Métodos de Pagamento"}}
			/>
			<PaymentMethodsStack.Screen
				name="AddCard"
				component={AddCard}
				options={{title: "Adicionar Cartão"}}
			/>
		</PaymentMethodsStack.Navigator>
	);
};

const AddressRoute: FC = () => {
	const screenOptions = useThemedHeaderConfig();

	return (
		<AddressStack.Navigator
			screenOptions={screenOptions}
			initialRouteName="MyAddresses"
		>
			<AddressStack.Screen
				name="MyAddresses"
				component={MyAddresses}
				options={{title: "Endereços Cadastrados"}}
			/>
			<AddressStack.Screen
				name="ManageAddress"
				component={ManageAddress}
				options={{title: "Gerenciar Endereço"}}
			/>
		</AddressStack.Navigator>
	);
};

const NewServiceRoute: FC = () => {
	const screenOptions = useThemedHeaderConfig();

	return (
		<NewServiceStack.Navigator
			screenOptions={screenOptions}
			initialRouteName="ServiceCategories"
		>
			<NewServiceStack.Screen
				name="ServiceCategories"
				component={ServiceCategories}
				options={{title: "Categoria do Serviço"}}
			/>
			<NewServiceStack.Screen
				name="ServiceDescription"
				component={ServiceDescription}
				options={{title: "Descrição do Serviço"}}
			/>
			<NewServiceStack.Screen
				name="ServiceDate"
				component={ServiceDate}
				options={{title: "Data do Serviço"}}
			/>
			<NewServiceStack.Screen
				name="ServicePhotos"
				component={ServicePhotos}
				options={{title: "Fotos do Serviço"}}
			/>
			<NewServiceStack.Screen
				name="ServiceAddress"
				component={ServiceAddress}
				options={{title: "Endereço do Serviço"}}
			/>
			<NewServiceStack.Screen
				name="ConfirmService"
				component={ConfirmService}
				options={{title: "Confirmar Serviço"}}
			/>
		</NewServiceStack.Navigator>
	);
};

const ServicesRoute: FC = () => {
	const screenOptions = useThemedHeaderConfig();

	return (
		<ServicesStack.Navigator
			screenOptions={screenOptions}
			initialRouteName="MyServices"
		>
			<ServicesStack.Screen
				name="MyServices"
				component={MyServices}
				options={{title: "Serviços"}}
			/>
			<ServicesStack.Screen
				name="ViewService"
				component={ViewService}
				options={{title: "Detalhes do Serviço"}}
			/>
			<ServicesStack.Screen
				name="NewService"
				component={NewServiceRoute}
				options={{title: "Novo Serviço"}}
			/>
		</ServicesStack.Navigator>
	);
};

const AppRoute: FC = () => (
	<AppDrawer.Navigator
		initialRouteName="Services"
		drawerContent={DrawerContent}
	>
		<AppDrawer.Screen name="Services" component={ServicesRoute} />
		<AppDrawer.Screen name="Profile" component={Profile} />
		<AppDrawer.Screen name="Addresses" component={AddressRoute} />
		<AppDrawer.Screen name="PaymentMethods" component={PaymentMethodsRoute} />
		<AppDrawer.Screen name="Help" component={Help} />
		<AppDrawer.Screen name="Chat" component={Chat} />
	</AppDrawer.Navigator>
);

export default AppRoute;

const DrawerContent: FC<DrawerContentComponentProps> = ({
	navigation,
	state,
}) => (
	<Drawer selectedIndex={new IndexPath(state.index)}>
		<DrawerItem
			title="Meus Serviços"
			onPress={() => navigation.navigate("Services")}
		/>
		<DrawerItem
			title="Perfil"
			onPress={() => navigation.navigate("Profile")}
		/>
		<DrawerItem
			title="Endereços Cadastrados"
			onPress={() => navigation.navigate("Addresses")}
		/>
		<DrawerItem
			title="Pagamentos"
			onPress={() => navigation.navigate("PaymentMethods")}
		/>
		<DrawerItem title="Sobre" onPress={() => navigation.navigate("Help")} />
		<DrawerItem title="Chat" onPress={() => navigation.navigate("Chat")} />
	</Drawer>
);

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type PaymentMethodsStackParams = {
	Cards: undefined;
	AddCard: undefined;
};

export type AddressStackParams = {
	MyAddresses: undefined;
	ManageAddress: {id: string};
};

export type NewServiceStackParams = {
	ServiceCategories: undefined;
	ServiceDescription: undefined;
	ServiceDate: undefined;
	ServicePhotos: undefined;
	ServiceAddress: undefined;
	ConfirmService: undefined;
};

export type ServicesStackParams = {
	MyServices: undefined;
	ViewService: {id: number};
	NewService: undefined;
};

export type AppDrawerParams = {
	Services: undefined;
	Profile: undefined;
	Addresses: undefined;
	PaymentMethods: undefined;
	Help: undefined;
	Chat: undefined;
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */
/* eslint-enable @typescript-eslint/naming-convention */
