import React, { Component } from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default class EscolhaClienteScreen extends Component {
  static navigationOptions = {
    title: 'Finddo'
  };

  state = {
    name: 'teste',
    email: 'teste@email.com',
    cellphone: '21980808080',
    cpf: '12345678900'
  };

  componentDidMount() {
    // this.obterCategorias();
  };

  _redirectCadastro = () => { };

  render() {
    return (
      <ImageBackground
        style={this.escolhaTipoScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View>
          <Text>Quero ser:</Text>
          <TouchableOpacity onPress={this._redirectCadastro('cliente')}>
            <Text>Cliente Finddo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._redirectCadastro('cliente')}>
            <Text>Profissional Finddo</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  escolhaTipoScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
  });
}
