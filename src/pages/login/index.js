import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet, Image,
  TouchableOpacity, ScrollView
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import { colors } from '../../colors';
import UserDTO from '../../models/UserDTO';

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

      const userDto = new UserDTO(response.data.data);

      AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(
        async () => {
          try {
            const tokenService = TokenService.getInstance();
            tokenService.setToken(userData);

            await AsyncStorage.setItem('user', JSON.stringify(userDto));
            tokenService.setUser(userDto);

            this.props.navigation.navigate('App');
          }
          catch (error) {
            throw new Error('Problema ao se persistir as credenciais.');
          }
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
      <ImageBackground
        style={this.loginScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <View style={this.loginScreenStyle.loginForm}>
            <Image
              source={require('../../img/finddo-logo.png')}
              style={this.loginScreenStyle.finddoLogoStyle} />
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
            <TouchableOpacity
              style={this.loginScreenStyle.loginButton}
              onPress={() => this.login(this.state.usuario, this.state.senha)}>
              <Text style={this.loginScreenStyle.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
            <Text>
              Ainda não é cadastrado?
            <Text
                style={this.loginScreenStyle.cadastreSe}
                onPress={() => this.props.navigation.navigate('EscolhaTipo')}> Cadastre-se</Text>
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  loginScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
    loginForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 360, height: 250, backgroundColor: colors.branco },
    loginButton: { marginTop: 40, marginBottom: 10, width: 360, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    loginButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
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
    },
    cadastreSe: { fontWeight: 'bold', textDecorationLine: 'underline' }
  });
}
