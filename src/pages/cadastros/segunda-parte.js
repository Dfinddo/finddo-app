import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet, Modal,
  TouchableOpacity, ScrollView,
  SectionList, Alert, ActivityIndicator
} from 'react-native';
import { colors } from '../../colors';
import UserDTO from '../../models/UserDTO';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}

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
    password_confirmation: '12345678',
    user_type: '',
    formInvalid: false,
    formErrors: [],
    isLoading: false
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
    const user_type = navigation.getParam('user_type', 'sem tipo');

    this.setState({ name, email, cellphone, cpf, user_type });
  };

  validateFields = () => {
    const passwordRegex = /^[0-9a-zA-Z]*$/;
    const numberRegex = /^[0-9]*$/;

    const errosArr = [];

    const cepErrors = [];
    const estadoErrors = [];
    const cidadeErrors = [];
    const ruaErrors = [];
    const numeroErrors = [];
    const complementoErrors = [];
    const passwordErrors = [];
    const passwordConfErrors = [];

    if (this.state.cep.length === 0) {
      cepErrors.push('É obrigatório.');
    } else if (this.state.cep.length > 10) {
      cepErrors.push('Tamanho máximo 10.');
    } else if (!numberRegex.test(this.state.cep)) {
      cepErrors.push('Apenas números.');
    }

    if (this.state.estado.length === 0) {
      estadoErrors.push('É obrigatório.');
    } else if (this.state.estado.length > 2) {
      estadoErrors.push('Tamanho máximo 2.');
    }

    if (this.state.cidade.length === 0) {
      cidadeErrors.push('É obrigatório.');
    } else if (this.state.cidade.length > 128) {
      cidadeErrors.push('Tamanho máximo 128.');
    }

    if (this.state.rua.length === 0) {
      ruaErrors.push('É obrigatório.');
    } else if (this.state.rua.length > 128) {
      ruaErrors.push('Tamanho máximo 128.');
    }

    if (this.state.numero.length === 0) {
      numeroErrors.push('É obrigatório.');
    } else if (this.state.numero.length > 10) {
      numeroErrors.push('Tamanho máximo 10.');
    }

    if (this.state.complemento.length === 0) {
      complementoErrors.push('É obrigatório.');
    } else if (this.state.complemento.length > 128) {
      complementoErrors.push('Tamanho máximo 128.');
    }

    if (this.state.password.length === 0) {
      passwordErrors.push('É obrigatório.');
    } else if (this.state.password.length > 12 || this.state.password.length < 8) {
      passwordErrors.push('Entre 8 e 12 caracteres.');
    } else if (!passwordRegex.test(this.state.password)) {
      passwordErrors.push('Apenas letras maiúsculas ou minúsculas e dígitos, sem acentos.');
    }

    if (this.state.password_confirmation !== this.state.password) {
      passwordConfErrors.push('As senhas não conferem.');
    }

    if (cepErrors.length > 0) {
      errosArr.push({ title: 'CEP', data: cepErrors });
    }
    if (estadoErrors.length > 0) {
      errosArr.push({ title: 'Estado', data: estadoErrors });
    }
    if (cidadeErrors.length > 0) {
      errosArr.push({ title: 'Cidade', data: cidadeErrors });
    }
    if (ruaErrors.length > 0) {
      errosArr.push({ title: 'Rua', data: ruaErrors });
    }
    if (numeroErrors.length > 0) {
      errosArr.push({ title: 'Número', data: numeroErrors });
    }
    if (complementoErrors.length > 0) {
      errosArr.push({ title: 'Complemento', data: complementoErrors });
    }
    if (passwordErrors.length > 0) {
      errosArr.push({ title: 'Senha', data: passwordErrors });
    }
    if (passwordConfErrors.length > 0) {
      errosArr.push({ title: 'Confirmação de Senha', data: passwordConfErrors });
    }

    if (errosArr.length > 0) {
      this.setState({ formErrors: [...errosArr] });
      this.setState({ formInvalid: true });
    } else {
      const stateDto = JSON.parse(JSON.stringify(this.state));
      delete stateDto.formErrors;
      delete stateDto.formInvalid;
      delete stateDto.isLoading;
      this.signUp(stateDto);
      this.props.navigation.navigate('ParteDois', this.state);
    }
  };

  signUp = async (userState) => {
    const user = new UserDTO(userState);
    try {
      this.setState({ isLoading: true });
      const response = await backendRails.post('/auth', user);

      const userData = {};
      userData['access-token'] = response['headers']['access-token'];
      userData['client'] = response['headers']['client'];
      userData['uid'] = response['headers']['uid'];

      const userDto = new UserDTO(response.data.data);

      AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(
        async () => {
          try {
            await AsyncStorage.setItem('user', JSON.stringify(userDto));

            const tokenService = TokenService.getInstance();
            tokenService.setToken(userData);
            tokenService.setUser(userDto);

            this.props.navigation.navigate('App');
          } catch (error) {
            Alert.alert(
              'Falha ao se conectar',
              'Verifique sua conexão e tente novamente',
              [
                { text: 'OK', onPress: () => { } },
              ],
              { cancelable: false },
            );
            this.setState({ isLoading: false });
          }
        }
      ).catch(
        (error) => {
          Alert.alert(
            'Falha ao se conectar',
            'Verifique sua conexão e tente novamente',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
          this.setState({ isLoading: false });
        }
      );
    }
    catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        Alert.alert(
          'Erro ao se cadastrar',
          'Verifique seus dados e tente novamente',
          [
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false },
        );
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
    }
  }

  render() {
    // TODO: tipo inputs aqui e no login form
    return (
      <ImageBackground
        style={this.parteDoisScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')} >
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.parteDoisScreenStyle.modalStyle}>
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
            <View style={this.parteDoisScreenStyle.modalBase}>
              <View style={this.parteDoisScreenStyle.modalDialog}>
                <View style={this.parteDoisScreenStyle.modalDialogContent}>
                  <Text style={this.parteDoisScreenStyle.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={this.parteDoisScreenStyle.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={this.parteDoisScreenStyle.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={this.parteDoisScreenStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={this.parteDoisScreenStyle.continuarButtonText}>Voltar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
              onPress={() => this.validateFields()}>
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
    modalBase: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    modalDialog: {
      padding: 16, borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%',
      height: '80%', flex: 1,
      alignItems: 'center', justifyContent: 'center'
    },
    modalDialogContent: { backgroundColor: 'white', width: '100%', borderRadius: 18, opacity: 1 },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
    modalErrosSectionList: { maxHeight: '60%', width: '100%' },
    modalErrosTituloErro: { fontSize: 24, fontWeight: 'bold' },
    modalErrosBotaoContinuar: { marginTop: 40, marginBottom: 10, width: '100%', height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}
