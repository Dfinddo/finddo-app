import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import { colors } from '../../colors';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = { usuario: '', senha: '' };

  constructor(props) {
    super(props);
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

          this.props.navigation.navigate('App');
        }
      ).catch(
        () => {
          throw new Error('Problema ao se persistir as credenciais.');
        }
      );
    }
    catch (error) {
      throw new Error('Falha ao se autenticar');
    }
  }

  render() {
    return (
      <View style={this.loginScreenStyle.loginForm}>
        <View style={this.loginScreenStyle.loginMainForm}>
          <Text style={this.loginScreenStyle.fontTitle}>Login</Text>
          <TextInput
            style={this.loginScreenStyle.loginFormSizeAndFont}
            placeholder="E-mail"
            onChangeText={
              (usuario) => {
                this.setState({ usuario: usuario });
              }}
            value={this.state.usuario}
          />
          <TextInput
            style={this.loginScreenStyle.loginFormSizeAndFont}
            placeholder="Senha"
            onChangeText={
              (senha) => {
                this.setState({ senha: senha });
              }}
            value={this.state.senha}
            secureTextEntry={true}
          />
          <Text style={this.loginScreenStyle.loginEsqueciSenha}>Esqueci minha senha</Text>
        </View>
        <TouchableOpacity style={{ marginBottom: 10, width: 300, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo }} onPress={() => this.login(this.state.usuario, this.state.senha)}>
          <Text style={{ textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' }}>Entrar</Text>
        </TouchableOpacity>
        <Text>
          Ainda não é cadastrado? <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={() => this.props.navigation.navigate('Register')}>Cadastre-se</Text>
        </Text>
      </View>
    );
  }

  loginScreenStyle = StyleSheet.create({
    loginForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 360, height: 250, backgroundColor: colors.branco },
    loginFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      borderBottomColor: colors.verdeFinddo,
      borderBottomWidth: 2,
      textAlign: 'left',
      width: 300,
    },
    loginEsqueciSenha:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'center',
      width: 300,
      textDecorationLine: 'underline',
      textAlignVertical: 'bottom'
    },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    }
  });
}
