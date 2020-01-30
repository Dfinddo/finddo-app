import React, { Component } from 'react';
import { Image } from 'react-native';
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

const AppStack = createStackNavigator(
  {
    Services: Servicos,
    NovoPedido: NovoPedido,
    FotosPedido: FotosPedido,
    // MeusPedidos: MeusPedidos,
    // AcompanhamentoPedido: AcompanhamentoPedido,
    // Acompanhamento: TelaFinalPedidoScreen,
    DefinirData: DataServico,
    CameraPedido: CameraPedidoComponent,

    Redirecionador: RedirecionadorIndex,
    /* rotas do profissional */

    IndexProfissional: IndexProfissional
  },
  {
    initialRouteName: 'Redirecionador',
    navigationOptions: ({ navigation }) => {

      let tabBarVisible = true;

      let routeName = navigation.state.routes[navigation.state.index].routeName

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
  },
  { initialRouteName: 'AcompanhamentoPedido' }
);

const MeusPedidosStack = createStackNavigator(
  {
    MeusPedidos: MeusPedidos,
    RedirecionadorPedidos: RedirecionadorPedidos,
    MeusPedidosProfissional: MeusPedidosProfissional
    // AcompanhamentoPedido: AcompanhamentoPedido,
    // Acompanhamento: TelaFinalPedidoScreen,
  },
  { initialRouteName: 'RedirecionadorPedidos' }
);

const PerfilStack = createStackNavigator(
  {
    Profile: PerfilScreen,
    EditField: EditarCampoPerfil,
    Addresses: EnderecosScreen,
    CreateEditAddress: FormEnderecoScreen
  },
  { initialRouteName: 'Profile' }
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
          return <Image
            style={{ width: 25, height: 25 }}
            source={require('../src/img/icon_principal.png')}
          />
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
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}