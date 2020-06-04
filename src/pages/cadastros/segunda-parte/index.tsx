import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  Modal,
  TouchableOpacity, ScrollView,
  SectionList, Alert, ActivityIndicator,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { colors } from '../../../colors';
import UserDTO from '../../../models/UserDTO';
import backendRails from '../../../services/backend-rails-api';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../../services/token-service';
import HeaderFundoTransparente from '../../../components/header-fundo-transparente';
import { termos } from '../termos';
import { politica } from '../politica';
import moipAPI, { headersOauth2 } from '../../../services/moip-api';
import UUIDGenerator from 'react-native-uuid-generator';
import { formatarCpf } from '../formatadores/formatador-cpf';
import { styles } from './styles';

export default class SegundaParte extends Component {
	public keyboardDidShowListener: any;
	public keyboardDidHideListener: any;
	public setState: any;
	public props: any;
	public navigation: any;
	public bairro: any;
	public logradouro: any;
	public complemento: any;
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: () => <HeaderFundoTransparente />,
  };

  state = {
    name: '',
    surname: '',
    mothers_name: '',
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
    showPolitica: false,
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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isShowingKeyboard: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowingKeyboard: false });
  }

  criarContaMoip = (clientData) => {
    const contaMoip = {};

    const dataNascimentoArray = clientData.birthdate.split('/');
    const dataNascimento = `${dataNascimentoArray[2]}-${dataNascimentoArray[1]}-${dataNascimentoArray[0]}`;

    const ddd = `${clientData.cellphone[0]}${clientData.cellphone[1]}`;
    const numberTel = clientData.cellphone.split('').slice(2).join('');

    contaMoip.email = {};
    contaMoip.email.address = clientData.email;

    contaMoip.person = {};
    contaMoip.person.name = clientData.name;
    contaMoip.person.lastName = clientData.surname;
    contaMoip.person.taxDocument = {};
    contaMoip.person.taxDocument.type = 'CPF';
    contaMoip.person.taxDocument.number = clientData.cpf;

    contaMoip.person.birthDate = dataNascimento;
    contaMoip.person.phone = {};
    contaMoip.person.phone.countryCode = '55';
    contaMoip.person.phone.areaCode = ddd;
    contaMoip.person.phone.number = numberTel;

    contaMoip.person.parentsName = {};
    contaMoip.person.parentsName.mother = clientData.mothers_name;

    contaMoip.person.address = {};
    contaMoip.person.address.street = clientData.rua;
    contaMoip.person.address.streetNumber = clientData.numero;
    contaMoip.person.address.district = clientData.bairro;
    contaMoip.person.address.zipCode = clientData.cep;
    contaMoip.person.address.city = clientData.cidade;
    contaMoip.person.address.state = clientData.estado;
    contaMoip.person.address.country = 'BRA';
    contaMoip.person.address.complement = clientData.complemento;

    contaMoip.type = 'MERCHANT';

    return contaMoip;
  };

  criarClienteMoip = (clientData, uuid) => {
    const clienteMoip = {};

    const dataNascimentoArray = clientData.birthdate.split('/');
    const dataNascimento = `${dataNascimentoArray[2]}-${dataNascimentoArray[1]}-${dataNascimentoArray[0]}`;

    const ddd = `${clientData.cellphone[0]}${clientData.cellphone[1]}`;
    const numberTel = clientData.cellphone.split('').slice(2).join('');

    clienteMoip.ownId = uuid;
    clienteMoip.fullname = `${clientData.name} ${clientData.surname}`;
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
    const surname = navigation.getParam('surname', 'sem sobrenome');
    const mothers_name = navigation.getParam('mothers_name', null);
    const email = navigation.getParam('email', 'sem email');
    const cellphone = navigation.getParam('cellphone', 'sem telefone');
    const cpf = navigation.getParam('cpf', 'sem cpf');
    const user_type = navigation.getParam('user_type', 'sem tipo');
    const birthdate = navigation.getParam('birthdate', 'no_birthdate');

    this.setState({ name, surname, email, cellphone, cpf, user_type, birthdate, mothers_name });
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
    }
  };

  cadastrarUsuario = (usuario, possuiContaMoip = false) => {
    usuario.player_ids = [TokenService.getInstance().getPlayerIDOneSignal()];

    backendRails.post('/users', usuario).then(response => {
      const userData = {};
      userData['access-token'] = response['headers']['access-token'];
      userData['client'] = response['headers']['client'];
      userData['uid'] = response['headers']['uid'];

      const userDto = new UserDTO(response.data);

      if (userDto.user_type === 'professional') {
        if (possuiContaMoip) {
          Alert.alert(
            'Aviso',
            'Foi identificado que você já possui uma conta Wirecard, vá para a aba perfil e'
            + ' autorize o Finddo a executar transações para sua conta.',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            'Aviso',
            'Para que você comece a atender pedidos, vá pra a aba de perfil,'
            + ' configure sua conta Wirecard e '
            + ' autorize o Finddo a executar transações para sua conta.',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        }
      }

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
            'Falha ao salvar sua sessão',
            'Favor sair e fazer login, seu cadastro foi concluído.',
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
  }

  handleErrorCadastro = (error) => {
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
  }

  signUp = (userState) => {
    const user = new UserDTO(userState);
    const userWithAddress = UserDTO.gerarUsuarioComEnderecoDefault(user);

    this.setState({ isLoading: true }, () => {
      if (userWithAddress.user.user_type === 'user') {
        UUIDGenerator.getRandomUUID().then((uuid) => {
          moipAPI.post('customers', this.criarClienteMoip(this.state, uuid), { headers: headersOauth2 })
            .then(responseWirecard => {
              userWithAddress.user.customer_wirecard_id = responseWirecard.data.id;
              userWithAddress.user.own_id_wirecard = responseWirecard.data.ownId;

              this.cadastrarUsuario(userWithAddress);
            }).catch(error => {
              this.handleErrorCadastro(error);
            });
        });
      } else {
        const cpfFormatado = formatarCpf(this.state.cpf);

        moipAPI.get(`accounts/exists?tax_document=${cpfFormatado}`, { headers: headersOauth2 })
          .then(res => {
            this.cadastrarUsuario(userWithAddress, true);
          })
          .catch(error => {
            if (error.response.status === 404) {
              moipAPI.post('accounts', this.criarContaMoip(this.state), { headers: headersOauth2 })
                .then(response => {
                  userWithAddress.user.id_wirecard_account = response.data.id;
                  userWithAddress.user.set_account = response.data._links.setPassword.href;
                  userWithAddress.user.is_new_wire_account = true;
                  this.cadastrarUsuario(userWithAddress);
                }).catch(error => {
                  this.handleErrorCadastro(error);
                });
            } else {
              this.handleErrorCadastro(error);
            }
          });
      }
    });

  }

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')} >
        <View style={{ height: 60 }}></View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={styles.modalStyle}>
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
            <View style={styles.modalBase}>
              <View style={styles.modalDialog}>
                <View style={styles.modalDialogContent}>
                  <Text style={styles.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={styles.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={styles.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={[
                      styles.modalErrosBotaoContinuar,
                      {
                        marginTop: 8, alignItems: 'center', justifyContent: 'center'
                      }
                    ]}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={styles.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showPolitica}
          >
            <View style={styles.modalBase}>
              <View style={styles.modalDialog}>
                <View style={[styles.modalDialogContent, { height: 500 }]}>
                  <Text style={styles.modalErrosTitulo}>Política:</Text>
                  <ScrollView>
                    <Text style={{ fontSize: 18 }}>{politica}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={[
                      styles.modalErrosBotaoContinuar,
                      {
                        marginTop: 8, alignItems: 'center', justifyContent: 'center'
                      }
                    ]}
                    onPress={() => this.setState({ showPolitica: false })}>
                    <Text style={styles.continuarButtonText}>VOLTAR</Text>
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
            <View style={styles.modalBase}>
              <View style={styles.modalDialog}>
                <View style={[styles.modalDialogContent, { height: 500 }]}>
                  <Text style={styles.modalErrosTitulo}>Termos:</Text>
                  <ScrollView>
                    <Text style={{ fontSize: 18 }}>{termos}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={[
                      styles.modalErrosBotaoContinuar,
                      {
                        marginTop: 8, alignItems: 'center', justifyContent: 'center'
                      }
                    ]}
                    onPress={() => this.setState({ showTermos: false })}>
                    <Text style={styles.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.cadastroForm}>
            <Text style={styles.fontTitle}>Crie sua conta</Text>
            <View style={styles.cadastroMainForm}>
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cep: text }) }}
                placeholder="CEP"
                onBlur={() => {
                  if (this.state.cep.length === 8) {
                    this.setState({ isLoading: true }, () => {
                      axios.create({
                        baseURL: 'https://viacep.com.br/ws'
                      })
                        .get(`${this.state.cep}/json`)
                        .then(response => {
                          const { bairro, logradouro, complemento } = response.data;

                          this.setState({ bairro, rua: logradouro, complemento, isLoading: false });
                        })
                        .catch(_ => this.setState({ isLoading: false }))
                    });
                  }
                }}
                keyboardType={'number-pad'}
                value={this.state.cep}
                maxLength={8}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ estado: text }) }}
                placeholder="Estado"
                editable={false}
                value={this.state.estado}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cidade: text }) }}
                placeholder="Cidade"
                editable={false}
                value={this.state.cidade}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ bairro: text }) }}
                placeholder="Bairro"
                value={this.state.bairro}
                maxLength={128}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ rua: text }) }}
                placeholder="Rua"
                value={this.state.rua}
                maxLength={128}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ numero: text }) }}
                keyboardType="number-pad"
                placeholder="Número"
                maxLength={10}
                value={this.state.numero}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ complemento: text }) }}
                placeholder="Complemento"
                value={this.state.complemento}
                maxLength={128}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ password: text }) }}
                placeholder="Senha"
                value={this.state.password}
                secureTextEntry={true}
                maxLength={12}
                numberOfLines={1}
              />
              <TextInput
                style={styles.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ password_confirmation: text }) }}
                placeholder="Confirmar Senha"
                value={this.state.password_confirmation}
                secureTextEntry={true}
                maxLength={12}
                numberOfLines={1}
              />
              <View style={{ height: 8 }}></View>
              <View style={{ width: 300 }}>
                <Text style={{ fontSize: 18 }}>Ao criar sua conta, você está concordando</Text>
                <Text style={{ fontSize: 18 }}>com os nossos<Text onPress={() => this.setState({ showTermos: true })} style={{ color: colors.verdeFinddo }}> Termos e Condições de Uso</Text></Text>
                <Text style={{ fontSize: 18 }}>e com nossa<Text onPress={() => this.setState({ showPolitica: true })} style={{ color: colors.verdeFinddo }}> Política de Privacidade.</Text></Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <BotaoCriar isShowingKeyboard={this.state.isShowingKeyboard} onPress={() => this.validateFields()}></BotaoCriar>
      </ImageBackground>
    );
  }
}

function BotaoCriar(props) {
  if (props.isShowingKeyboard === false) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            marginBottom: 10, width: 340,
            height: 45, borderRadius: 20,
            backgroundColor: colors.verdeFinddo,
            alignItems: 'center', justifyContent: 'center'
          }}
          onPress={props.onPress}>
          <Text style={{
            fontSize: 18, color: colors.branco,
            textAlign: 'center'
          }}>CRIAR</Text>
        </TouchableOpacity>
      </View>);
  } else {
    return (null);
  }
}

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}
