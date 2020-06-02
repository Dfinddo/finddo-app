import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { colors } from '../../../colors';
import HeaderFundoTransparente from '../../../components/header-fundo-transparente';
import backendRails from '../../../services/backend-rails-api';
import { ambienteASerConstruido } from '../../../../credenciais-e-configuracoes';
import { StackActions } from 'react-navigation';
import { styles } from './styles';

export default class EsqueciSenhaEmail extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: () => <HeaderFundoTransparente />,
    headerBackTitle: 'Voltar'
  };

  state = {
    email: '',
    isLoading: false
  };

  enviarFormRecuperacaoDeSenha = (email) => {
    this.setState({ isLoading: true }, () => {
      backendRails.post('auth/password', { email, redirect_url: ambienteASerConstruido.backendUrl })
        .then(_ => {
          Alert.alert(
            'Recuperação de Senha',
            'Será enviado email com instruções de ' +
            'recuperação se existir usuário associado ao email fornecido.',
            [{
              text: 'OK', onPress: () => {
                const popAction = StackActions.pop({
                  n: 1,
                });
                this.props.navigation.dispatch(popAction);
              }
            }]);
        }).catch(error => {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            Alert.alert(
              'Recuperação de Senha',
              'Será enviado email com instruções de ' +
              'recuperação se existir usuário associado ao email fornecido.',
              [{
                text: 'OK', onPress: () => {
                  const popAction = StackActions.pop({
                    n: 1,
                  });
                  this.props.navigation.dispatch(popAction);
                }
              }])
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            Alert.alert(
              'Falha ao executar a operação',
              'Verifique sua conexão e tente novamente',
              [
                { text: 'OK', onPress: () => { this.setState({ isLoading: false }) } },
              ],
              { cancelable: false },
            );
          }
        });
    });
  }

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
        {(() => {
          if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            );
          } else {
            return (
              <ScrollView>
                <View style={{ height: 220 }}></View>
                <View style={styles.emailForm}>
                  <View style={styles.containerForm}>
                    <Text style={styles.fontTitle}>Esqueci minha senha</Text>
                    <TextInput
                      style={styles.formSizeAndFont}
                      onChangeText={text => { this.setState({ email: text }) }}
                      placeholder="Email"
                      keyboardType="email-address"
                      maxLength={100}
                      value={this.state.email}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.continuarButton}
                    onPress={() => { this.enviarFormRecuperacaoDeSenha(this.state.email) }}>
                    <Text style={styles.continuarButtonText}>CONTINUAR</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            );
          }
        })()}
      </ImageBackground >
    );
  }
}
