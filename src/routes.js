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

const AppStack = createStackNavigator(
  {
    Services: Servicos,
    NovoPedido: NovoPedido,
    FotosPedido: FotosPedido,
    MeusPedidos: MeusPedidos,
    AcompanhamentoPedido: AcompanhamentoPedido,
    Acompanhamento: TelaFinalPedidoScreen
  },
  {
    initialRouteName: 'MeusPedidos',
  }
);

const PerfilStack = createStackNavigator(
  { Profile: PerfilScreen }
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
    Serviços: AppStack,
    Perfil: PerfilStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Serviços') {
          iconName = `ios-hammer`;
          // Sometimes we want to add badges to some icons. 
          // You can check the implementation below.
          // IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Perfil') {
          iconName = `ios-person`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.verdeFinddo,
      inactiveTintColor: colors.cinzaIconeInativo,
    },
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