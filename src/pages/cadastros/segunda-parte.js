import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet,
  TouchableOpacity, ScrollView
} from 'react-native';
import { colors } from '../../colors';
import UserDTO from '../../models/UserDTO';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

export default class SegundaParte extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: HeaderFundoTransparente
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

          this.props.navigation.navigate('App');
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
      <ImageBackground
        style={this.parteDoisScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')} >
        <ScrollView>
          <View style={this.parteDoisScreenStyle.cadastroForm}>
            <View
              style={this.parteDoisScreenStyle.finddoLogoStyle}></View>
            <View style={this.parteDoisScreenStyle.cadastroMainForm}>
              <Text style={this.parteDoisScreenStyle.fontTitle}>Crie sua conta</Text>

              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cep: text }) }}
                placeholder="CEP"
                value={this.state.cep}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ estado: text }) }}
                placeholder="Estado"
                value={this.state.estado}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cidade: text }) }}
                placeholder="Cidade"
                value={this.state.cidade}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ rua: text }) }}
                placeholder="Rua"
                value={this.state.rua}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ numero: text }) }}
                placeholder="Número"
                value={this.state.numero}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ complemento: text }) }}
                placeholder="Complemento"
                value={this.state.complemento}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ password: text }) }}
                placeholder="Senha"
                value={this.state.password}
                secureTextEntry={true}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ password_confirmation: text }) }}
                placeholder="Confirmar Senha"
                value={this.state.password_confirmation}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              style={this.parteDoisScreenStyle.continuarButton}
              onPress={() => this.signUp(this.state)}>
              <Text style={this.parteDoisScreenStyle.continuarButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  parteDoisScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 60 },
    cadastroForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    cadastroMainForm: { alignItems: 'center', justifyContent: 'center', width: 360, height: 420, backgroundColor: colors.branco },
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
