import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, StyleSheet,
  TouchableOpacity,
  TextInput, ScrollView
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

export default class EsqueciSenhaNovaSenha extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />
  };

  state = {
    password: '',
    password_confirmation: ''
  };

  render() {
    return (
      <ImageBackground
        style={this.esqueciSenhaNovaSenha.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <View style={{ height: 220 }}></View>
          <View style={this.esqueciSenhaNovaSenha.novaSenhaForm}>
            <View style={this.esqueciSenhaNovaSenha.containerForm}>
              <Text style={this.esqueciSenhaNovaSenha.fontTitle}>Esqueci minha senha</Text>
              <TextInput
                style={this.esqueciSenhaNovaSenha.formSizeAndFont}
                onChangeText={text => { this.setState({ password: text }) }}
                placeholder="Nova Senha"
                secureTextEntry={true}
                keyboardType="default"
                maxLength={12}
                value={this.state.password}
              />
              <TextInput
                style={this.esqueciSenhaNovaSenha.formSizeAndFont}
                onChangeText={text => { this.setState({ password_confirmation: text }) }}
                placeholder="Confirmar Senha"
                secureTextEntry={true}
                keyboardType="default"
                maxLength={12}
                value={this.state.password_confirmation}
              />
            </View>
            <TouchableOpacity
              style={this.esqueciSenhaNovaSenha.continuarButton}
              onPress={() => { }}>
              <Text style={this.esqueciSenhaNovaSenha.continuarButtonText}>REDEFINIR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground >
    );
  }

  esqueciSenhaNovaSenha = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    novaSenhaForm: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 320 },
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
      height: 240,
      width: '100%',
      backgroundColor: colors.branco
    }
  });
}
