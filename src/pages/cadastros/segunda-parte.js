import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet, Modal,
  TouchableOpacity, ScrollView,
  SectionList, Alert, ActivityIndicator,
  Keyboard
} from 'react-native';
import { colors } from '../../colors';
import UserDTO from '../../models/UserDTO';
import backendRails from '../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';
import { termos } from './termos';
import moipAPI, { headers } from '../../services/moip-api';
import { v4 as uuidv4 } from 'uuid';

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
    birthdate: '',
    cep: '',
    estado: 'RJ',
    cidade: 'Rio de Janeiro',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    formInvalid: false,
    formErrors: [],
    isLoading: false,
    isShowingKeyboard: false,
    showTermos: false,
  };

  componentDidMount() {
    this.obterParametrosParteUm();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  };

  _keyboardDidShow = () => {
    this.setState({ isShowingKeyboard: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowingKeyboard: false });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  criarClienteMoip = (clientData) => {
    const clienteMoip = {};

    const dataNascimentoArray = clientData.birthdate.split('/');
    const dataNascimento = `${dataNascimentoArray[2]}-${dataNascimentoArray[1]}-${dataNascimentoArray[0]}`;

    const ddd = `${clientData.cellphone[0]}${clientData.cellphone[1]}`;
    const numberTel = clientData.cellphone.split('').slice(2).join('');

    clienteMoip.ownId = uuidv4();
    clienteMoip.fullname = clientData.name;
    clienteMoip.email = clientData.email;
    clienteMoip.birthDate = dataNascimento;
    clienteMoip.taxDocument = {};
    clienteMoip.taxDocument.type = 'CPF';
    clienteMoip.taxDocument.number = clientData.cpf;
    clienteMoip.phone = {};
    clienteMoip.phone.countryCode = '55';
    clienteMoip.phone.areaCode = ddd;
    clienteMoip.phone.number = numberTel;

    return clienteMoip;
  };

  obterParametrosParteUm = () => {
    const { navigation } = this.props;
    const name = navigation.getParam('name', 'sem nome');
    const email = navigation.getParam('email', 'sem email');
    const cellphone = navigation.getParam('cellphone', 'sem telefone');
    const cpf = navigation.getParam('cpf', 'sem cpf');
    const user_type = navigation.getParam('user_type', 'sem tipo');
    const birthdate = navigation.getParam('birthdate', 'no_birthdate');

    this.setState({ name, email, cellphone, cpf, user_type, birthdate });
  };

  validateFields = () => {
    const passwordRegex = /^[0-9a-zA-Z]*$/;
    const numberRegex = /^[0-9]*$/;

    const errosArr = [];

    const cepErrors = [];
    const estadoErrors = [];
    const cidadeErrors = [];
    const bairroErrors = [];
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

    if (this.state.bairro.length === 0) {
      bairroErrors.push('É obrigatório.');
    } else if (this.state.cidade.length > 128) {
      bairroErrors.push('Tamanho máximo 128.');
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
    if (bairroErrors.length > 0) {
      errosArr.push({ title: 'Bairro', data: bairroErrors });
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

  signUp = (userState) => {
    const user = new UserDTO(userState);
    const userWithAddress = UserDTO.gerarUsuarioComEnderecoDefault(user);

    this.setState({ isLoading: true });
    moipAPI.post('customers', this.criarClienteMoip(this.state), { headers: headers })
      .then(responseWirecard => {
        userWithAddress.user.customer_wirecard_id = responseWirecard.data.id;
        backendRails.post('/users', userWithAddress).then(response => {
          const userData = {};
          userData['access-token'] = response['headers']['access-token'];
          userData['client'] = response['headers']['client'];
          userData['uid'] = response['headers']['uid'];

          const userDto = new UserDTO(response.data);

          AsyncStorage.setItem('userToken', JSON.stringify(userData)).then(
            _ => {
              AsyncStorage.setItem('user', JSON.stringify(userDto)).then(_ => {
                const tokenService = TokenService.getInstance();
                tokenService.setToken(userData);
                tokenService.setUser(userDto);

                this.props.navigation.navigate('App');
              });
            }).catch((_) => {
              Alert.alert(
                'Falha ao se conectar',
                'Verifique sua conexão e tente novamente',
                [
                  { text: 'OK', onPress: () => { } },
                ],
                { cancelable: false },
              );
              this.setState({ isLoading: false });
            });
        }).catch(error => {
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
        });
      }).catch(error => {
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
        }
        this.setState({ isLoading: false });
      });
  }

  render() {
    // TODO: tipo inputs aqui e no login form
    return (
      <ImageBackground
        style={this.parteDoisScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')} >
        <View style={{ height: 60 }}></View>
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
                    <Text style={this.parteDoisScreenStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showTermos}
          >
            <View style={this.parteDoisScreenStyle.modalBase}>
              <View style={this.parteDoisScreenStyle.modalDialog}>
                <View style={[this.parteDoisScreenStyle.modalDialogContent, { height: 500 }]}>
                  <Text style={this.parteDoisScreenStyle.modalErrosTitulo}>Termos:</Text>
                  <ScrollView>
                    <Text style={{ fontSize: 18 }}>{termos}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={[this.parteDoisScreenStyle.modalErrosBotaoContinuar, { marginTop: 8 }]}
                    onPress={() => this.setState({ showTermos: false })}>
                    <Text style={this.parteDoisScreenStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={this.parteDoisScreenStyle.cadastroForm}>
            <View style={this.parteDoisScreenStyle.cadastroMainForm}>
              <Text style={this.parteDoisScreenStyle.fontTitle}>Crie sua conta</Text>

              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cep: text }) }}
                placeholder="CEP"
                keyboardType={'number-pad'}
                value={this.state.cep}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ estado: text }) }}
                placeholder="Estado"
                editable={false}
                value={this.state.estado}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cidade: text }) }}
                placeholder="Cidade"
                editable={false}
                value={this.state.cidade}
              />
              <TextInput
                style={this.parteDoisScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ bairro: text }) }}
                placeholder="Bairro"
                value={this.state.bairro}
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
              <View style={{ height: 8 }}></View>
              <Text style={{ fontSize: 18 }}>Ao criar sua conta, você está concordando</Text>
              <Text style={{ fontSize: 18 }}>com os nossos<Text onPress={() => this.setState({ showTermos: true })} style={{ color: colors.verdeFinddo }}> Termos e Condições de Uso</Text></Text>
            </View>
          </View>
        </ScrollView>
        <BotaoCriar isShowingKeyboard={this.state.isShowingKeyboard} onPress={() => this.validateFields()}></BotaoCriar>
      </ImageBackground>
    );
  }

  parteDoisScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
    cadastroForm: {
      flex: 1, alignItems: 'center',
      justifyContent: 'center', height: 550
    },
    cadastroMainForm: {
      alignItems: 'center', justifyContent: 'center',
      width: 340, height: 510,
      backgroundColor: colors.branco
    },
    continuarButtonText: {
      textAlignVertical: 'center', height: 45,
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    },
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
    modalDialogContent: {
      backgroundColor: colors.branco, width: 340,
      borderRadius: 18, opacity: 1,
      alignItems: 'center'
    },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
    modalErrosSectionList: { maxHeight: '60%', width: '100%' },
    modalErrosTituloErro: { fontSize: 24, fontWeight: 'bold' },
    modalErrosBotaoContinuar: {
      marginTop: 40, marginBottom: 10,
      width: 320, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo
    },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}

function BotaoCriar(props) {
  if (props.isShowingKeyboard === false) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            marginBottom: 10, width: 340,
            height: 45, borderRadius: 20,
            backgroundColor: colors.verdeFinddo
          }}
          onPress={props.onPress}>
          <Text style={{
            textAlignVertical: 'center', height: 45,
            fontSize: 18, color: colors.branco,
            textAlign: 'center'
          }}>CRIAR</Text>
        </TouchableOpacity>
      </View>);
  } else {
    return (null);
  }
}