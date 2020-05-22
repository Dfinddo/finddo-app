import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, StyleSheet,
  TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';
import backendRails from '../../services/backend-rails-api';
import { ambienteASerConstruido } from '../../../credenciais-e-configuracoes';
import { StackActions } from 'react-navigation';

export default class EsqueciSenhaEmail extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />,
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
        style={this.esqueciSenhaEmailStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
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
                <View style={this.esqueciSenhaEmailStyle.emailForm}>
                  <View style={this.esqueciSenhaEmailStyle.containerForm}>
                    <Text style={this.esqueciSenhaEmailStyle.fontTitle}>Esqueci minha senha</Text>
                    <TextInput
                      style={this.esqueciSenhaEmailStyle.formSizeAndFont}
                      onChangeText={text => { this.setState({ email: text }) }}
                      placeholder="Email"
                      keyboardType="email-address"
                      maxLength={100}
                      value={this.state.email}
                    />
                  </View>
                  <TouchableOpacity
                    style={this.esqueciSenhaEmailStyle.continuarButton}
                    onPress={() => { this.enviarFormRecuperacaoDeSenha(this.state.email) }}>
                    <Text style={this.esqueciSenhaEmailStyle.continuarButtonText}>CONTINUAR</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            );
          }
        })()}
      </ImageBackground >
    );
  }

  esqueciSenhaEmailStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    emailForm: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 240 },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    formSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      borderBottomColor: colors.verdeFinddo,
      borderBottomWidth: 2,
      textAlign: 'left',
      width: 300,
    },
    continuarButton: {
      marginTop: 40,
      marginBottom: 10,
      width: 360,
      height: 45,
      borderRadius: 20,
      backgroundColor: colors.verdeFinddo,
      alignItems: 'center',
      justifyContent: 'center'
    },
    continuarButtonText: {
      fontSize: 18,
      color: colors.branco,
      textAlign: 'center'
    },
    containerForm: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 160,
      width: '100%',
      backgroundColor: colors.branco
    }
  });
}
