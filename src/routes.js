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
import PerfilScreen from './pages/login/perfil';

const AppStack = createStackNavigator(
  {
    Servicos: Servicos,
    NovoPedido: NovoPedido,
    FotosPedido: FotosPedido,
    MeusPedidos: MeusPedidos
  },
  {
    initialRouteName: 'MeusPedidos'
  }
);

const RegisterStack = createStackNavigator(
  {
    ParteUm: PrimeiraParte,
    ParteDois: SegundaParte
  },
  {
    initialRouteName: 'ParteUm'
  }
);

const PerfilStack = createStackNavigator(
  { Perfil: PerfilScreen }
);

const AuthStack = createStackNavigator(
  { Login: LoginScreen }
);

const TabMenu = createBottomTabNavigator(
  {
    Pedidos: AppStack,
    Profile: PerfilStack
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