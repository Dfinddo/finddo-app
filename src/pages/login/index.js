import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';

export default class LoginScreen extends Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { usuario: 'cliente@teste.com', senha: 'cliente@finddo' };
  }

  login = async (user, password) => {
    try {
      const response = await backendRails.post('/auth/sign_in', { email: user, password: password });

      const userData = {};
      userData['access-token'] = response['headers']['access-token'];
      userData['client'] = response['headers']['client'];
      userData['uid'] = response['headers']['uid'];

      AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(
        () => {
          const tokenService = TokenService.getInstance();
          tokenService.setToken(userData);

          this.props.navigation.navigate('Servicos');
        }
      ).catch(
        (error) => {
          console.log(error);
          throw new Error('Problema ao se persistir as credenciais.');
        }
      );
    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={loginStyle.loginForm}>
        <Text style={loginStyle.fontTitle}>Finddo</Text>
        <TextInput
          style={loginStyle.loginFormSizeAndFont}
          placeholder="Email"
          onChangeText={(usuario) => this.setState({ usuario: usuario })}
          value={this.state.usuario}
        />
        <TextInput
          style={loginStyle.loginFormSizeAndFont}
          placeholder="Senha"
          onChangeText={(senha) => this.setState({ senha: senha })}
          value={this.state.senha}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => this.login(this.state.usuario, this.state.senha)}
        />
        <Button
          title="Cadastre-se"
          onPress={() => this.props.navigation.navigate('Register')}
        />
      </View>
    );
  }
}

const loginStyle = StyleSheet.create({
  loginForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loginFormSizeAndFont: { fontSize: 25, height: 45 },
  fontTitle: {
    fontSize: 30
  }
});