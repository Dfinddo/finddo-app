import React, { Component } from 'react';
import {
  TouchableOpacity, View,
  ImageBackground, ScrollView,
  TextInput, Text,
  StyleSheet, Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';
import { colors } from '../../colors';
import HeaderTransparenteSemHistorico from '../../components/header-transparente-sem-historico';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PerfilScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderTransparenteSemHistorico />
  };

  constructor(props) {
    super(props);
  }

  state = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    cpf: '',
  };

  componentDidMount() {
    const userData = TokenService.getInstance().getUser();
    this.setState({ email: userData.email, nomeCompleto: userData.name, cpf: userData.cpf, telefone: userData.cellphone });
  }

  limparDadosLogin = () => {
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('user');
    TokenService.getInstance().setToken(null);
    TokenService.getInstance().setUser(null);
    this.props.navigation.navigate('Auth');
  }

  logoutConfirm = () => {
    Alert.alert(
      'Finddo',
      'Deseja sair?',
      [
        { text: 'Não', onPress: () => { } },
        { text: 'Sim', onPress: () => { this.logout() } },
      ],
      { cancelable: false },
    );
  }

  logout = () => {
    backendRails
      .delete('/auth/sign_out', { headers: TokenService.getInstance().getHeaders() })
      .finally(() => {
        this.limparDadosLogin();
      });
  }

  render() {
    let IconComponent = Ionicons;
    let iconName = "ios-create";
    let tintColor = colors.amareloIconeEditar;

    return (
      <ImageBackground
        style={this.perfilScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: 50 }}></View>
        <ScrollView>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
              backgroundColor: colors.branco, flexDirection: 'column',
              height: 500, alignItems: 'center',
              justifyContent: 'space-around', width: '90%'
            }}>
              <Image style={{ width: 150, height: 150, borderRadius: 50 }}
                source={require('../../img/func-status.png')} />
              <View style={{
                width: '80%',
                alignItems: 'flex-start'
              }}>
                <View style={{
                  flexDirection: 'row', borderBottomColor: colors.verdeFinddo,
                  borderBottomWidth: 2
                }}>
                  <TextInput
                    style={this.perfilScreenStyle.perfilFormSizeAndFont}
                    placeholder="Nome Completo"
                    keyboardType="default"
                    value={this.state.nomeCompleto}
                    editable={false}
                  />
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }} />
                </View>
                <View style={{
                  flexDirection: 'row', borderBottomColor: colors.verdeFinddo,
                  borderBottomWidth: 2
                }}>
                  <TextInput
                    style={this.perfilScreenStyle.perfilFormSizeAndFont}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    value={this.state.email}
                    editable={false}
                  />
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditField', { tipo: 'email', titulo: 'Email', valor: this.state.email })}>
                      <IconComponent name={iconName} size={25} color={tintColor} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row', borderBottomColor: colors.verdeFinddo,
                  borderBottomWidth: 2
                }}>
                  <TextInput
                    style={this.perfilScreenStyle.perfilFormSizeAndFont}
                    placeholder="Telefone"
                    keyboardType="phone-pad"
                    editable={false}
                    value={this.state.telefone}
                  />
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditField', { tipo: 'telefone', titulo: 'Telefone', valor: this.state.telefone })}>
                      <IconComponent name={iconName} size={25} color={tintColor} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row', borderBottomColor: colors.verdeFinddo,
                  borderBottomWidth: 2
                }}>
                  <TextInput
                    style={this.perfilScreenStyle.perfilFormSizeAndFont}
                    placeholder="CPF"
                    keyboardType="number-pad"
                    value={this.state.cpf}
                    editable={false}
                  />
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }} />
                </View>
              </View>
              <Text
                style={this.perfilScreenStyle.perfilEnderecoSelect}
                onPress={() => { this.props.navigation.navigate('Addresses'); }}>Endereço padrão</Text>
              <Text
                style={this.perfilScreenStyle.perfilEnderecoSelect}
                onPress={() => { }}>Forma de pagamento padrão</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 60 }}>
            <TouchableOpacity
              style={this.perfilScreenStyle.sairButton}
              onPress={() => { this.logoutConfirm() }/*this.login(this.state.usuario, this.state.senha)*/}>
              <Text style={this.perfilScreenStyle.sairButtonText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  perfilScreenStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    sairButton: { marginTop: 10, width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    sairButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
    perfilFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'left',
      width: '80%',
      paddingLeft: 20
    },
    perfilEnderecoSelect:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'center',
      width: 300,
      textDecorationLine: 'underline',
      textAlignVertical: 'bottom'
    },
  });
}
