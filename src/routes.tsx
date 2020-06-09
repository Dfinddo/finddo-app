import React, {Component} from "react";
import {Platform} from "react-native";
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import {ApplicationProvider, IconRegistry} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import Servicos from "./pages/servicos/servicos";
import LoginScreen from "./pages/login/login";
import AuthLoadingScreen from "./pages/login/auth-loading";
import NovoPedido from "./pages/servicos/novo-pedido";
import PrimeiraParte from "./pages/cadastros/primeira-parte";
import SegundaParte from "./pages/cadastros/segunda-parte";
import FotosPedido from "./pages/servicos/fotos-pedido";
import MeusPedidos from "./pages/servicos/meus-pedidos";
import PerfilScreen from "./pages/perfil/perfil";
import EscolhaClienteScreen from "./pages/cadastros/escolha-tipo-cliente";
import Ionicons from "react-native-vector-icons/Ionicons";
import {colors} from "./colors";
import EsqueciSenhaEmail from "./pages/login/esqueci-senha-email";
import AcompanhamentoPedido from "./pages/servicos/acompanhamento-pedido";
import TelaFinalPedidoScreen from "./pages/acompanhamento-finddo-pay/tela-final-pedido";
import DataServico from "./pages/servicos/data-servico";
import "./config/StatusBarConfig";
import AjudaScreen from "./pages/ajuda/ajuda";
import IndexProfissional from "./pages/profissional_servicos/index-profissional";
import RedirecionadorIndex from "./pages/redirecionador/redirecionador";
import RedirecionadorPedidos from "./pages/redirecionador/redirecionador-pedidos";
import MeusPedidosProfissional from "./pages/profissional_servicos/meus-pedidos-profissional";
import EditarCampoPerfil from "./pages/perfil/editar-campo-perfil";
import EnderecosScreen from "./pages/perfil/enderecos";
import {CameraPedidoComponent} from "./pages/servicos/camera-component";
import FormEnderecoScreen from "./pages/perfil/form-endereco";
import CartoesScreen from "./pages/perfil/cartoes";
import FormCartaoScreen from "./pages/perfil/form-cartao";
import ValorServicoScreen from "./pages/acompanhamento-finddo-pay/tela-valor";
import OneSignal from "react-native-onesignal";
import {SvgXml} from "react-native-svg";
import {finddoLogoNavegacao} from "./img/svg/finddo-logo-navegacao";
import {ambienteASerConstruido} from "../credenciais-e-configuracoes";
import TokenService from "./services/token-service";
import SplashScreen from "react-native-splash-screen";
import FormEnderecoPedidoScreen from "./pages/servicos/form-endereco-pedido";
import {ConfirmarPedido} from "./pages/servicos/confirmar-pedido";

const AppStack = createStackNavigator(
	{
		Services: Servicos,
		NovoPedido,
		FotosPedido,
		FormAddCartao: FormCartaoScreen,
		DefinirData: DataServico,
		CameraPedido: CameraPedidoComponent,
		FormAddEndereco: FormEnderecoPedidoScreen,
		ConfirmarPedido,

		Redirecionador: RedirecionadorIndex,

		/* rotas do profissional */
		IndexProfissional,
	},
	{
		initialRouteName: "Redirecionador",
		navigationOptions: ({navigation}) => {

			let tabBarVisible = true;

			const {routeName} = navigation.state.routes[navigation.state.index];

			if (routeName == "CameraPedido")
				tabBarVisible = false;


			return {
				tabBarVisible,
			};

		},
	},
);

const ServicosStack = createStackNavigator(
	{
		AcompanhamentoPedido,
		Acompanhamento: TelaFinalPedidoScreen,
		Cobranca: ValorServicoScreen,
		FormAddCartao: FormCartaoScreen,
	},
	{initialRouteName: "AcompanhamentoPedido"},
);

const MeusPedidosStack = createStackNavigator(
	{
		MeusPedidos,
		RedirecionadorPedidos,
		MeusPedidosProfissional,
	},
	{initialRouteName: "RedirecionadorPedidos"},
);

const PerfilStack = createStackNavigator(
	{
		Profile: PerfilScreen,
		EditField: EditarCampoPerfil,
		Addresses: EnderecosScreen,
		CreateEditAddress: FormEnderecoScreen,
		Cards: CartoesScreen,
		CreateEditCard: FormCartaoScreen,
		CameraPerfil: CameraPedidoComponent,
	},
	{
		initialRouteName: "Profile",
		navigationOptions: ({navigation}) => {

			let tabBarVisible = true;

			const {routeName} = navigation.state.routes[navigation.state.index];

			if (routeName == "CameraPerfil")
				tabBarVisible = false;


			return {
				tabBarVisible,
			};

		},
	},
);

const AjudaStack = createStackNavigator(
	{Ajuda: AjudaScreen},
);

const AuthStack = createStackNavigator(
	{
		Login: LoginScreen,
		ParteUm: PrimeiraParte,
		ParteDois: SegundaParte,
		EscolhaTipo: EscolhaClienteScreen,
		EsqueciSenhaEmail,
	},
	{
		initialRouteName: "Login",
	},
);

const TabMenu = createBottomTabNavigator(
	{
		Serviços: ServicosStack,
		Pedidos: MeusPedidosStack,
		Finddo: AppStack,
		Perfil: PerfilStack,
		Ajuda: AjudaStack,
	},
	{
		defaultNavigationOptions: ({navigation}) => ({
			tabBarIcon: ({focused, horizontal, tintColor}) => {

				const {routeName} = navigation.state;
				const IconComponent = Ionicons;
				let iconName;

				if (routeName === "Pedidos")
					iconName = "ios-paper";
				else if (routeName === "Finddo")
					return <SvgXml xml={finddoLogoNavegacao} width={25} height={25}></SvgXml>;
				else if (routeName === "Perfil")
					iconName = "ios-person";
				else if (routeName === "Serviços")
					iconName = "ios-hammer";
				else if (routeName === "Ajuda")
					iconName = "ios-help-circle";


				return <IconComponent name={iconName} size={25} color={tintColor} />;

			},
		}),
		tabBarOptions: {
			activeTintColor: colors.verdeFinddo,
			inactiveTintColor: colors.cinzaIconeInativo,
		},
		initialRouteName: "Finddo",
	},
);

const AppContainer = createAppContainer(createSwitchNavigator(
	{
		App: TabMenu,
		AuthLoading: AuthLoadingScreen,
		Auth: AuthStack,
	},
	{
		initialRouteName: "AuthLoading",
	},
));

export default class App extends Component {

	constructor(props) {

		super(props);
		OneSignal.init(ambienteASerConstruido.oneSignalApiKey);

		OneSignal.addEventListener("received", this.onReceived);
		OneSignal.addEventListener("opened", this.onOpened);
		OneSignal.addEventListener("ids", this.onIds);

		if (Platform.OS === "ios")
			SplashScreen.hide();

	}

	public componentWillUnmount() {

		OneSignal.removeEventListener("received", this.onReceived);
		OneSignal.removeEventListener("opened", this.onOpened);
		OneSignal.removeEventListener("ids", this.onIds);

	}

	onReceived(notification) {

		/* console.log("Notification received: ", notification); */
	}

	onOpened(openResult) {

		/* console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult); */
	}

	onIds(device) {


		/* console.log('Device info: ', device); */
		TokenService.getInstance().setPlayerIDOneSignal(device.userId);

	}

	public render() {

		return (
			<React.Fragment>
				<IconRegistry icons={EvaIconsPack} />
				<ApplicationProvider {...eva} theme={{...eva.light}}>
					<AppContainer />
				</ApplicationProvider>
			</React.Fragment>
		);

	}

}