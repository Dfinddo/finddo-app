import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
  Modal
} from 'react-native';
import backendRails from '../../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../../services/token-service';
import UserDTO from '../../../models/UserDTO';
import { SvgXml } from 'react-native-svg';
import { finddoLogo } from '../../../img/svg/finddo-logo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../colors';
import { styles } from './styles';

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
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={styles.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={styles.loginForm}>
            <View style={{
              width: '100%', height: 50,
              marginTop: 20
            }}>
              <TouchableOpacity style={{
                width: 50, height: 50
              }} onPress={() => { this.props.navigation.navigate('App') }}>
                <Icon
                  style={{ width: 50 }}
                  name='keyboard-arrow-left'
                  size={50} color={colors.verdeFinddo} />
              </TouchableOpacity>
            </View>
            <SvgXml xml={finddoLogo} width={126} height={30} style={styles.finddoLogoStyle}></SvgXml>
            <View style={styles.loginMainForm}>
              <Text style={styles.fontTitle}>Login</Text>
              <TextInput
                style={styles.loginFormSizeAndFont}
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
                style={styles.loginFormSizeAndFont}
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
                style={styles.loginEsqueciSenha}
                onPress={() => this.props.navigation.navigate('EsqueciSenhaEmail')}>Esqueci minha senha</Text>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.login(this.state.usuario, this.state.senha)}>
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            </TouchableOpacity>
            <Text>
              Ainda não é cadastrado?
            <Text> </Text>
              <Text
                style={styles.cadastreSe}
                onPress={() => this.props.navigation.navigate('EscolhaTipo')}>Cadastre-se</Text>
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
