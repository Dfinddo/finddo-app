import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import Servicos from './pages/servicos/servicos';
import LoginScreen from './pages/login';
import AuthLoadingScreen from './pages/login/auth-loading';
import NovoPedido from './pages/servicos/novo-pedido';

const AppStack = createStackNavigator(
  {
    Servicos: Servicos,
    NovoPedido: NovoPedido
  },
  {
    initialRouteName: 'Servicos'
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