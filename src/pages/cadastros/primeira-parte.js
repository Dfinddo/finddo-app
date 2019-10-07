import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet,
  TouchableOpacity, ScrollView
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

export default class PrimeiraParte extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: HeaderFundoTransparente
  };

  state = {
    name: 'teste',
    email: 'teste@email.com',
    cellphone: '21980808080',
    cpf: '12345678900',
    tipoCliente: 'cliente'
  };

  componentDidMount() {
    const { navigation } = this.props;
    const tipoCliente = navigation.getParam('tipoCliente', 'não há tipo');

    if (tipoCliente !== 'não há tipo') {
      this.setState({ tipoCliente });
    }
  }

  render() {
    return (
      <ImageBackground
        style={this.parteUmScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <View style={this.parteUmScreenStyle.cadastroForm}>
            <View
              style={this.parteUmScreenStyle.finddoLogoStyle}></View>
            <View style={this.parteUmScreenStyle.cadastroMainForm}>
              <Text style={this.parteUmScreenStyle.fontTitle}>Crie sua conta</Text>

              <TextInput
                style={this.parteUmScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ name: text }) }}
                placeholder="Nome Completo"
                value={this.state.name}
              />
              <TextInput
                style={this.parteUmScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ email: text }) }}
                placeholder="Email"
                value={this.state.email}
              />
              <TextInput
                style={this.parteUmScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cellphone: text }) }}
                placeholder="(99) 9999-99999"
                value={this.state.cellphone}
              />
              <TextInput
                style={this.parteUmScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cpf: text }) }}
                placeholder="CPF"
                value={this.state.cpf}
              />
            </View>
            <TouchableOpacity
              style={this.parteUmScreenStyle.continuarButton}
              onPress={() => this.props.navigation.navigate('ParteDois', this.state)}>
              <Text style={this.parteUmScreenStyle.continuarButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  parteUmScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
    cadastroForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    cadastroMainForm: { alignItems: 'center', justifyContent: 'center', width: 360, height: 260, backgroundColor: colors.branco },
    continuarButton: { marginTop: 40, marginBottom: 10, width: 360, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    continuarButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
    cadastroFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      borderBottomColor: colors.verdeFinddo,
      borderBottomWidth: 2,
      textAlign: 'left',
      width: 300,
    },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
  });
}
