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

const AppStack = createStackNavigator(
  {
    Services: Servicos,
    NovoPedido: NovoPedido,
    FotosPedido: FotosPedido,
    // MeusPedidos: MeusPedidos,
    AcompanhamentoPedido: AcompanhamentoPedido,
    Acompanhamento: TelaFinalPedidoScreen,
    DefinirData: DataServico
  },
  {
    initialRouteName: 'Services',
  }
);

const MeusPedidosStack = createStackNavigator({
  MeusPedidos: MeusPedidos, AcompanhamentoPedido: AcompanhamentoPedido,
  Acompanhamento: TelaFinalPedidoScreen,
},
  { initialRouteName: 'MeusPedidos' });

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
    Serviços: PerfilStack,
    Pedidos: MeusPedidosStack,
    Finddo: AppStack,
    Perfil: PerfilStack,
    Ajuda: PerfilStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Pedidos') {
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