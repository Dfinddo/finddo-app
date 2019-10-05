import React, { Component } from 'react';
import { Button, Text, TextInput, View, StyleSheet } from 'react-native';

export default class PrimeiraParte extends Component {
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

  render() {
    return (
      <View>
        <Text>Crie sua conta</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ name: text }) }}
          placeholder="Nome Completo"
          value={this.state.name}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ email: text }) }}
          placeholder="Email"
          value={this.state.email}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ cellphone: text }) }}
          placeholder="(99) 9999-99999"
          value={this.state.cellphone}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ cpf: text }) }}
          placeholder="CPF"
          value={this.state.cpf}
        />
        <Button
          title="Continuar"
          onPress={() => this.props.navigation.navigate('ParteDois', this.state)}
        />
      </View>
    );
  }
}

const loginStyle = StyleSheet.create({
  loginForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loginFormSizeAndFont: { fontSize: 25, height: 45 },
  fontTitle: {
    fontSize: 30
  }
});