import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
  Modal
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import { colors } from '../../colors';
import UserDTO from '../../models/UserDTO';
import { SvgXml } from 'react-native-svg';
import { finddoLogo } from '../../img/svg/finddo-logo';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
    headerBackTitle: 'Voltar'
  };

  state = { usuario: '', senha: '', isLoading: false };

  constructor(props) {
    super(props);
  }

  login = async (user, password) => {
    try {
      this.setState({ isLoading: true });
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

            await backendRails.put(`users/player_id_notifications/${tokenService.getUser().id}`,
              { player_id: tokenService.getPlayerIDOneSignal() },
              { headers: tokenService.getHeaders() }
            )

            this.setState({ isLoading: false });
            this.props.navigation.navigate('App');
          }
          catch (error) {
            this.setState({ isLoading: false });
            Alert.alert(
              'Falha ao se conectar',
              'Verifique sua conexão e tente novamente',
              [
                { text: 'OK', onPress: () => { } },
              ],
              { cancelable: false },
            );
          }
        }
      ).catch(
        () => {
          this.setState({ isLoading: false });
          Alert.alert(
            'Falha ao se conectar',
            'Verifique sua conexão e tente novamente',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        }
      );
    }
    catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        Alert.alert(
          'Falha ao se conectar',
          'Email ou senha incorretos',
          [
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false },
        );
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        Alert.alert(
          'Falha ao se conectar',
          'Verifique sua conexão e tente novamente',
          [
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false },
        );
      } else {
        /* Something happened in setting up the request and triggered an Error */
      }
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <ImageBackground
        style={this.loginScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.loginScreenStyle.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={this.loginScreenStyle.loginForm}>
            <SvgXml xml={finddoLogo} width={126} height={30} style={this.loginScreenStyle.finddoLogoStyle}></SvgXml>
            <View style={this.loginScreenStyle.loginMainForm}>
              <Text style={this.loginScreenStyle.fontTitle}>Login</Text>
              <TextInput
                style={this.loginScreenStyle.loginFormSizeAndFont}
                placeholder="E-mail"
                autoCapitalize="none"
                keyboardType="email-address"
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
              <View style={{ height: 30 }}></View>
              <Text
                style={this.loginScreenStyle.loginEsqueciSenha}
                onPress={() => this.props.navigation.navigate('EsqueciSenhaEmail')}>Esqueci minha senha</Text>
            </View>
            <TouchableOpacity
              style={this.loginScreenStyle.loginButton}
              onPress={() => this.login(this.state.usuario, this.state.senha)}>
              <Text style={this.loginScreenStyle.loginButtonText}>ENTRAR</Text>
            </TouchableOpacity>
            <Text>
              Ainda não é cadastrado?
            <Text> </Text>
              <Text
                style={this.loginScreenStyle.cadastreSe}
                onPress={() => this.props.navigation.navigate('EscolhaTipo')}>Cadastre-se</Text>
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  loginScreenStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
    loginForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 340, height: 250, backgroundColor: colors.branco },
    loginButton: {
      marginTop: 40, marginBottom: 10,
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    loginButtonText: {
      fontSize: 18,
      color: colors.branco, textAlign: 'center'
    },
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
      marginTop: 10,
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
