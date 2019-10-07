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

// TODO: remover
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
  {
    Login: LoginScreen,
    ParteUm: PrimeiraParte,
    ParteDois: SegundaParte,
    EscolhaTipo: EscolhaClienteScreen
  },
  {
    initialRouteName: 'Login'
  }
);

const TabMenu = createBottomTabNavigator(
  {
    Servicos: AppStack,
    Profile: PerfilStack
  }
);

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    App: TabMenu,
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Register: RegisterStack,
    // devmode only
    TestDev: PrimeiraParte
  },
  {
    initialRouteName: 'AuthLoading',
    // initialRouteName: 'TestDev',
  }
));

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}