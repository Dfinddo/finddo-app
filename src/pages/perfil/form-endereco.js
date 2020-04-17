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
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';
import { StackActions } from 'react-navigation';

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}

export default class FormEnderecoScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: HeaderFundoTransparente
  };

  state = {
    tituloForm: '',
    id: null,
    nome: '',
    cep: '',
    estado: 'RJ',
    cidade: 'Rio de Janeiro',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    selected: false,
    formInvalid: false,
    formErrors: [],
    isLoading: false,
    isShowingKeyboard: false,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    const { navigation } = this.props;
    const endereco = navigation.getParam('endereco', null);
    const editar = navigation.getParam('editar', null);

    if (editar) {
      this.setState({
        tituloForm: 'Editar Endereço'
      });
    } else {
      this.setState({
        tituloForm: 'Adicionar Endereço'
      });
    }

    if (endereco) {
      this.setState({
        id: endereco.id,
        nome: endereco.name,
        cep: endereco.cep,
        bairro: endereco.district,
        rua: endereco.street,
        numero: endereco.number,
        complemento: endereco.complement,
        selected: endereco.selected,
      });
    }
  };

  _keyboardDidShow = () => {
    this.setState({ isShowingKeyboard: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowingKeyboard: false });
  }

  obterEndereco = () => {
    const tokenService = TokenService.getInstance();
    const address = {};

    if (this.state.id) {
      address['id'] = this.state.id;
    }
    address['name'] = this.state.nome;
    address['cep'] = this.state.cep;
    address['district'] = this.state.bairro;
    address['street'] = this.state.rua;
    address['number'] = this.state.numero;
    address['complement'] = this.state.complemento;
    address['selected'] = this.state.selected;
    address['user_id'] = tokenService.getUser().id;

    return address;
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  validateFields = () => {
    const numberRegex = /^[0-9]*$/;

    const errosArr = [];

    const nomeErrors = [];
    const cepErrors = [];
    const estadoErrors = [];
    const cidadeErrors = [];
    const bairroErrors = [];
    const ruaErrors = [];
    const numeroErrors = [];
    const complementoErrors = [];

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

    if (this.state.nome.length === 0) {
      nomeErrors.push('É obrigatório.');
    } else if (this.state.cidade.length > 128) {
      nomeErrors.push('Tamanho máximo 128.');
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

    if (nomeErrors.length > 0) {
      errosArr.push({ title: 'Nome do endereço', data: nomeErrors });
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

    if (errosArr.length > 0) {
      this.setState({ formErrors: [...errosArr] });
      this.setState({ formInvalid: true });
    } else {
      this.salvarEndereco();
    }
  };

  salvarEndereco = async () => {
    const address = this.obterEndereco();
    const tokenService = TokenService.getInstance();

    try {
      this.setState({ isLoading: true });
      const response = this.state.id
        ? await backendRails.put(`/addresses/${address.id}`, { address }, { headers: tokenService.getHeaders() })
        : await backendRails.post('/addresses', { address }, { headers: tokenService.getHeaders() });

      this.setState({ isLoading: false, id: response.data.id });

      const popAction = StackActions.pop({
        n: 1,
      });
      this.props.navigation.dispatch(popAction);
    }
    catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        Alert.alert(
          'Erro',
          'Verifique os dados e tente novamente',
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
        style={this.formEnderecoScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')} >
        <View style={{ height: 60 }}></View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.formEnderecoScreenStyle.modalStyle}>
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
            <View style={this.formEnderecoScreenStyle.modalBase}>
              <View style={this.formEnderecoScreenStyle.modalDialog}>
                <View style={this.formEnderecoScreenStyle.modalDialogContent}>
                  <Text style={this.formEnderecoScreenStyle.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={this.formEnderecoScreenStyle.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={this.formEnderecoScreenStyle.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={this.formEnderecoScreenStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={this.formEnderecoScreenStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={this.formEnderecoScreenStyle.cadastroForm}>
            <View style={this.formEnderecoScreenStyle.cadastroMainForm}>
              <Text style={this.formEnderecoScreenStyle.fontTitle}>{this.state.tituloForm}</Text>

              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ nome: text }) }}
                placeholder="Nome do endereço"
                value={this.state.nome}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cep: text }) }}
                placeholder="CEP"
                keyboardType={'number-pad'}
                value={this.state.cep}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ estado: text }) }}
                placeholder="Estado"
                editable={false}
                value={this.state.estado}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ cidade: text }) }}
                placeholder="Cidade"
                editable={false}
                value={this.state.cidade}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ bairro: text }) }}
                placeholder="Bairro"
                value={this.state.bairro}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ rua: text }) }}
                placeholder="Rua"
                value={this.state.rua}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ numero: text }) }}
                placeholder="Número"
                value={this.state.numero}
              />
              <TextInput
                style={this.formEnderecoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.setState({ complemento: text }) }}
                placeholder="Complemento"
                value={this.state.complemento}
              />
              <View style={{ height: 8 }}></View>
            </View>
          </View>
        </ScrollView>
        <BotaoCriar isShowingKeyboard={this.state.isShowingKeyboard} onPress={() => this.validateFields()}></BotaoCriar>
      </ImageBackground>
    );
  }

  formEnderecoScreenStyle = StyleSheet.create({
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
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
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
            backgroundColor: colors.verdeFinddo,
            alignItems: 'center', justifyContent: 'center'
          }}
          onPress={props.onPress}>
          <Text style={{
            fontSize: 18, color: colors.branco,
            textAlign: 'center'
          }}>SALVAR</Text>
        </TouchableOpacity>
      </View>);
  } else {
    return (null);
  }
}