import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

export default class EscolhaClienteScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />
  };

  _redirectCadastro = (tipoCliente) => this.props.navigation.navigate('ParteUm', { tipoCliente });

  render() {
    return (
      <ImageBackground
        style={this.escolhaTipoClienteStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={this.escolhaTipoClienteStyle.escolhaForm}>
          <View style={{
            width: 340,
            backgroundColor: colors.branco, alignItems: 'center'
          }}>
            <Text style={this.escolhaTipoClienteStyle.fontTitle}>Quero ser:</Text>
            <TouchableOpacity
              style={this.escolhaTipoClienteStyle.escolhaButton}
              onPress={() => this._redirectCadastro('user')}>
              <Text style={this.escolhaTipoClienteStyle.escolhaButtonText}>CLIENTE FINDDO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={this.escolhaTipoClienteStyle.escolhaButton}
              onPress={() => this._redirectCadastro('professional')}>
              <Text style={this.escolhaTipoClienteStyle.escolhaButtonText}>PROFISSIONAL FINDDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground >
    );
  }

  escolhaTipoClienteStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    escolhaForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    escolhaButton: { marginTop: 40, marginBottom: 10, width: 320, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    escolhaButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
  });
}
