import React, { Component } from 'react';
import { Button, Text, TextInput, View, StyleSheet } from 'react-native';
import UserDTO from '../../models/UserDTO';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';

export default class SegundaParte extends Component {
  static navigationOptions = {
    title: 'Finddo'
  };

  state = {
    name: '',
    email: '',
    cellphone: '',
    cpf: '',
    cep: '20123456',
    estado: 'RJ',
    cidade: 'Rio de Janeiro',
    rua: 'Rua Teste',
    numero: '34',
    complemento: 'ap 320',
    password: '12345678',
    password_confirmation: '12345678'
  };

  componentDidMount() {
    this.obterParametrosParteUm();
  };

  obterParametrosParteUm = () => {
    const { navigation } = this.props;
    const name = navigation.getParam('name', 'sem nome');
    const email = navigation.getParam('email', 'sem email');
    const cellphone = navigation.getParam('cellphone', 'sem telefone');
    const cpf = navigation.getParam('cpf', 'sem cpf');

    this.setState({ name, email, cellphone, cpf });
  };

  signUp = async (userState) => {
    const user = new UserDTO(userState);
    try {
      const response = await backendRails.post('/auth', user);

      const userData = {};
      userData['access-token'] = response['headers']['access-token'];
      userData['client'] = response['headers']['client'];
      userData['uid'] = response['headers']['uid'];

      AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(
        () => {
          const tokenService = TokenService.getInstance();
          tokenService.setToken(userData);

          this.props.navigation.navigate('Servicos');
        }
      ).catch(
        (error) => {
          console.log(error);
          throw new Error('Problema ao se persistir as credenciais.');
        }
      );
    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View>
        <Text>Crie sua conta</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ cep: text }) }}
          placeholder="CEP"
          value={this.state.cep}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ estado: text }) }}
          placeholder="Estado"
          value={this.state.estado}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ cidade: text }) }}
          placeholder="Cidade"
          value={this.state.cidade}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ rua: text }) }}
          placeholder="Rua"
          value={this.state.rua}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ numero: text }) }}
          placeholder="Número"
          value={this.state.numero}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ complemento: text }) }}
          placeholder="Complemento"
          value={this.state.complemento}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ password: text }) }}
          placeholder="Senha"
          value={this.state.password}
          secureTextEntry={true}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => { this.setState({ password_confirmation: text }) }}
          placeholder="Confirmar Senha"
          value={this.state.password_confirmation}
          secureTextEntry={true}
        />
        <Button
          title="Criar"
          onPress={() => {
            this.signUp(this.state);
          }}
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