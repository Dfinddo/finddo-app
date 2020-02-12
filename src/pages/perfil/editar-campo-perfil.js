import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, StyleSheet,
  TouchableOpacity,
  TextInput, ScrollView, Modal, SectionList, Alert, ActivityIndicator
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import UserDTO from '../../models/UserDTO';

const campos = {
  email: 'email',
  telefone: 'telefone'
};

export default class EditarCampoPerfil extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />
  };

  state = {
    valor: null,
    titulo: '',
    tipo: '',
    formErrors: [],
    formInvalid: false,
    isLoading: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const valor = navigation.getParam('valor', 'sem valor');
    const titulo = navigation.getParam('titulo', 'sem titulo');
    const tipo = navigation.getParam('tipo', 'sem tipo');

    this.setState({ valor, titulo, tipo });
  }

  updateField = (key, value) => {
    this.setState({ isLoading: true });
    const user = TokenService.getInstance();

    const requestObj = {};
    requestObj[key] = value;

    backendRails.put('/auth', requestObj, { headers: user.getHeaders() }).then(response => {
      const userDto = new UserDTO(response.data.data);

      const userData = {};
      userData['access-token'] = response['headers']['access-token'];
      userData['client'] = response['headers']['client'];
      userData['uid'] = response['headers']['uid'];

      AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(_ => {
        user.setToken(userData);
        AsyncStorage.setItem('user', JSON.stringify(userDto)).then(_ => {
          user.setUser(userDto);

          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Profile' })],
          });
          this.props.navigation.dispatch(resetAction);
        });
      });
    }).catch(error => {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        try {
          switch (this.state.tipo) {
            case 'telefone':
              if (error.response.data.errors.cellphone.find((em) => em === 'has already been taken')) {
                Alert.alert(
                  'Erro',
                  'Telefone já cadastrado',
                  [
                    { text: 'OK', onPress: () => { } },
                  ],
                  { cancelable: false },
                );
              }
              break;
            case 'email':
              if (error.response.data.errors.email.find((em) => em === 'has already been taken')) {
                Alert.alert(
                  'Erro',
                  'Email já cadastrado',
                  [
                    { text: 'OK', onPress: () => { } },
                  ],
                  { cancelable: false },
                );
              }
              break;
            default:
              break;
          }

        } catch {
          Alert.alert(
            'Erro',
            'Verifique seus dados e tente novamente',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        }
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        Alert.alert(
          'Falha ao se conectar',
          'Verifique sua conexão e tente novamente',
          [
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false },
        );
      } else {
        /* Something happened in setting up the request and triggered an Error */
      }
      this.setState({ isLoading: false });
    });
  };

  validateFields = () => {
    const numberRegex = /^[0-9]*$/;
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const errosArr = [];

    const emailErrors = [];
    const telErrors = [];

    if (this.state.tipo === 'email') {
      if (this.state.valor.length === 0) {
        emailErrors.push('É obrigatório.');
      } else if (this.state.valor.length > 128) {
        emailErrors.push('Tamanho máximo 128.');
      } else if (!emailRegex.test(this.state.valor)) {
        emailErrors.push('Email inválido.');
      }
    }

    if (this.state.tipo === 'telefone') {
      if (this.state.valor.length === 0) {
        telErrors.push('É obrigatório.');
      } else if (
        this.state.valor.length < 8
        || this.state.valor.length > 11
        || !numberRegex.test(this.state.valor)) {
        telErrors.push('Número inválido.');
      }
    }

    if (emailErrors.length > 0) {
      errosArr.push({ title: 'Email', data: emailErrors });
    }
    if (telErrors.length > 0) {
      errosArr.push({ title: 'Telefone Celular', data: telErrors });
    }

    if (errosArr.length > 0) {
      this.setState({ formErrors: [...errosArr] });
      this.setState({ formInvalid: true });
    } else {
      if (this.state.tipo === 'telefone') {
        this.updateField('cellphone', this.state.valor);
      } else {
        this.updateField(this.state.tipo, this.state.valor);
      }
    }
  };

  render() {
    return (
      <ImageBackground
        style={this.editarCampoPerfilStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.editarCampoPerfilStyle.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.formInvalid}
          >
            <View style={this.editarCampoPerfilStyle.modalBase}>
              <View style={this.editarCampoPerfilStyle.modalDialog}>
                <View style={this.editarCampoPerfilStyle.modalDialogContent}>
                  <Text style={this.editarCampoPerfilStyle.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={this.editarCampoPerfilStyle.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={this.editarCampoPerfilStyle.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={this.editarCampoPerfilStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={this.editarCampoPerfilStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={{ height: 220 }}></View>
          <View style={this.editarCampoPerfilStyle.fieldForm}>
            <View style={this.editarCampoPerfilStyle.containerForm}>
              <Text style={this.editarCampoPerfilStyle.fontTitle}>{this.state.titulo}</Text>
              {
                (() => {
                  if (this.state.tipo === campos.email) {
                    return (<TextInput
                      style={this.editarCampoPerfilStyle.formSizeAndFont}
                      onChangeText={text => { this.setState({ valor: text }) }}
                      placeholder="Email"
                      keyboardType="email-address"
                      value={this.state.valor}
                    />);
                  } else if (this.state.tipo === campos.telefone) {
                    return (<TextInput
                      style={this.editarCampoPerfilStyle.formSizeAndFont}
                      onChangeText={text => { this.setState({ valor: text }) }}
                      placeholder="Telefone"
                      keyboardType="phone-pad"
                      value={this.state.valor}
                    />);
                  } else {
                    return (null);
                  }
                })()
              }
            </View>
            <TouchableOpacity
              style={this.editarCampoPerfilStyle.continuarButton}
              onPress={() => this.validateFields()}>
              <Text style={this.editarCampoPerfilStyle.continuarButtonText}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground >
    );
  }

  editarCampoPerfilStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    fieldForm: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 240 },
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
      width: 340,
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
      width: 340,
      backgroundColor: colors.branco
    },
    modalBase: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    modalDialog: {
      padding: 16, borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%',
      height: '80%', flex: 1,
      alignItems: 'center', justifyContent: 'center'
    },
    modalDialogContent: { backgroundColor: colors.branco, width: 340, borderRadius: 18, opacity: 1, alignItems: 'center' },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
    modalErrosSectionList: { maxHeight: '60%', width: '100%' },
    modalErrosTituloErro: { fontSize: 24, fontWeight: 'bold' },
    modalErrosBotaoContinuar: { marginTop: 40, marginBottom: 10, width: 320, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}
