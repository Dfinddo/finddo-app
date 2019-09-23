import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import Servicos from './pages/servicos/servicos';
import LoginScreen from './pages/login';
import AuthLoadingScreen from './pages/login/auth-loading';
import NovoPedido from './pages/servicos/novo-pedido';
import PrimeiraParte from './pages/cadastros/primeira-parte';
import SegundaParte from './pages/cadastros/segunda-parte';

const AppStack = createStackNavigator(
  {
    Servicos: Servicos,
    NovoPedido: NovoPedido
  },
  {
    initialRouteName: 'Servicos'
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

const AuthStack = createStackNavigator(
  { Login: LoginScreen }
);

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Register: RegisterStack
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