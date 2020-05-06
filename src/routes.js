import React, { Component } from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import Servicos from './pages/servicos/servicos';
import LoginScreen from './pages/login';
import AuthLoadingScreen from './pages/login/auth-loading';
import NovoPedido from './pages/servicos/novo-pedido';
import PrimeiraParte from './pages/cadastros/primeira-parte';
import SegundaParte from './pages/cadastros/segunda-parte';
import FotosPedido from './pages/servicos/fotos-pedido';
import MeusPedidos from './pages/servicos/meus-pedidos';
import PerfilScreen from './pages/perfil/perfil';
import EscolhaClienteScreen from './pages/cadastros/escolha-tipo-cliente';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from './colors';
import EsqueciSenhaEmail from './pages/login/esqueci-senha-email';
import EsqueciSenhaNovaSenha from './pages/login/esqueci-senha-nova-senha';
import AcompanhamentoPedido from './pages/servicos/acompanhamento-pedido';
import TelaFinalPedidoScreen from './pages/acompanhamento-finddo-pay/tela-final-pedido';
import DataServico from './pages/servicos/data-servico';
import './config/StatusBarConfig';
import AjudaScreen from './pages/ajuda/ajuda';
import IndexProfissional from './pages/profissional_servicos/index-profissional';
import RedirecionadorIndex from './pages/redirecionador/redirecionador';
import RedirecionadorPedidos from './pages/redirecionador/redirecionador-pedidos';
import MeusPedidosProfissional from './pages/profissional_servicos/meus-pedidos-profissional';
import EditarCampoPerfil from './pages/perfil/editar-campo-perfil';
import EnderecosScreen from './pages/perfil/enderecos';
import { CameraPedidoComponent } from './pages/servicos/camera-component';
import FormEnderecoScreen from './pages/perfil/form-endereco';
import CartoesScreen from './pages/perfil/cartoes/cartoes';
import FormCartaoScreen from './pages/perfil/cartoes/form-cartao';
import ValorServicoScreen from './pages/acompanhamento-finddo-pay/tela-valor';
import OneSignal from 'react-native-onesignal';
import { SvgXml } from 'react-native-svg';
import { finddoLogoNavegacao } from './img/svg/finddo-logo-navegacao';
import { developConfig, productionConfig } from '../credenciais-e-configuracoes';
import TokenService from './services/token-service';
import SplashScreen from 'react-native-splash-screen';
import FormEnderecoPedidoScreen from './pages/servicos/form-endereco-pedido';

const AppStack = createStackNavigator(
  {
    Services: Servicos,
    NovoPedido: NovoPedido,
    FotosPedido: FotosPedido,
    FormAddCartao: FormCartaoScreen,
    DefinirData: DataServico,
    CameraPedido: CameraPedidoComponent,
    FormAddEndereco: FormEnderecoPedidoScreen,

    Redirecionador: RedirecionadorIndex,

    /* rotas do profissional */
    IndexProfissional: IndexProfissional
  },
  {
    initialRouteName: 'Redirecionador',
    navigationOptions: ({ navigation }) => {

      let tabBarVisible = true;

      let routeName = navigation.state.routes[navigation.state.index].routeName;

      if (routeName == 'CameraPedido') {
        tabBarVisible = false
      }

      return {
        tabBarVisible,
      }
    }
  }
);

const ServicosStack = createStackNavigator(
  {
    AcompanhamentoPedido: AcompanhamentoPedido,
    Acompanhamento: TelaFinalPedidoScreen,
    Cobranca: ValorServicoScreen,
    FormAddCartao: FormCartaoScreen
  },
  { initialRouteName: 'AcompanhamentoPedido' }
);

const MeusPedidosStack = createStackNavigator(
  {
    MeusPedidos: MeusPedidos,
    RedirecionadorPedidos: RedirecionadorPedidos,
    MeusPedidosProfissional: MeusPedidosProfissional
  },
  { initialRouteName: 'RedirecionadorPedidos' }
);

const PerfilStack = createStackNavigator(
  {
    Profile: PerfilScreen,
    EditField: EditarCampoPerfil,
    Addresses: EnderecosScreen,
    CreateEditAddress: FormEnderecoScreen,
    Cards: CartoesScreen,
    CreateEditCard: FormCartaoScreen,
    CameraPerfil: CameraPedidoComponent
  },
  {
    initialRouteName: 'Profile',
    navigationOptions: ({ navigation }) => {

      let tabBarVisible = true;

      let routeName = navigation.state.routes[navigation.state.index].routeName;

      if (routeName == 'CameraPerfil') {
        tabBarVisible = false;
      }

      return {
        tabBarVisible,
      }
    }
  }
);

const AjudaStack = createStackNavigator(
  { Ajuda: AjudaScreen }
);

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    ParteUm: PrimeiraParte,
    ParteDois: SegundaParte,
    EscolhaTipo: EscolhaClienteScreen,
    EsqueciSenhaEmail: EsqueciSenhaEmail,
    EsqueciSenhaNovaSenha: EsqueciSenhaNovaSenha
  },
  {
    initialRouteName: 'Login'
  }
);

const CadastroStack = createStackNavigator(
  {
    CadastroParteUm: PrimeiraParte,
    CadastroParteDois: SegundaParte
  },
  {
    initialRouteName: 'CadastroParteUm'
  }
);

const TabMenu = createBottomTabNavigator(
  {
    Serviços: ServicosStack,
    Histórico: MeusPedidosStack,
    Finddo: AppStack,
    Perfil: PerfilStack,
    Ajuda: AjudaStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Histórico') {
          iconName = `ios-paper`;
        } else if (routeName === 'Finddo') {
          return <SvgXml xml={finddoLogoNavegacao} width={25} height={25}></SvgXml>
        } else if (routeName === 'Perfil') {
          iconName = `ios-person`;
        } else if (routeName === 'Serviços') {
          iconName = `ios-hammer`;
        } else if (routeName === 'Ajuda') {
          iconName = `ios-help-circle`;
        }

        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.verdeFinddo,
      inactiveTintColor: colors.cinzaIconeInativo,
    },
    initialRouteName: 'Finddo'
  }
);

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    App: TabMenu,
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Cadastro: CadastroStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends Component {
  constructor(props) {
    super(props);
    OneSignal.init(developConfig.oneSignalApiKey);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    SplashScreen.hide();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
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

  render() {
    return <AppContainer />;
  }
}