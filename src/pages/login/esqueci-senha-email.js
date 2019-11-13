import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, StyleSheet,
  TouchableOpacity,
  TextInput, ScrollView
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

export default class EsqueciSenhaEmail extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />
  };

  state = {
    email: '',
  };

  render() {
    return (
      <ImageBackground
        style={this.esqueciSenhaEmailStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
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
                maxLength={11}
                value={this.state.email}
              />
            </View>
            <TouchableOpacity
              style={this.esqueciSenhaEmailStyle.continuarButton}
              onPress={() => { this.props.navigation.navigate('EsqueciSenhaNovaSenha'); }}>
              <Text style={this.esqueciSenhaEmailStyle.continuarButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
      width: '90%',
    },
    continuarButton: {
      marginTop: 40,
      marginBottom: 10,
      width: 360,
      height: 45,
      borderRadius: 20,
      backgroundColor: colors.verdeFinddo
    },
    continuarButtonText: {
      textAlignVertical: 'center',
      height: 45,
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
