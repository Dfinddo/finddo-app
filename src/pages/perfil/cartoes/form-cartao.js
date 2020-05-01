import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet, Modal,
  TouchableOpacity, ScrollView,
  SectionList, Alert, ActivityIndicator,
  Keyboard
} from 'react-native';
import { colors } from '../../../colors';
import TokenService from '../../../services/token-service';
import HeaderFundoTransparente from '../../../components/header-fundo-transparente';
import { StackActions } from 'react-navigation';
import moipAPI, { headersOauth2 } from '../../../services/moip-api';

function Card() {
  return {
    method: 'CREDIT_CARD',
    creditCard: {
      expirationMonth: '',
      expirationYear: '',
      number: '',
      cvc: '',
      holder: {
        fullname: '',
        birthdate: '',
        taxDocument: {
          type: 'CPF',
          number: ''
        },
        phone: {
          countryCode: '55',
          areaCode: '',
          number: ''
        }
      }
    }
  };
}

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}

export default class FormCartaoScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: HeaderFundoTransparente
  };

  state = {
    tituloForm: 'Adicionar Cartão',
    cardData: Card(),
    formInvalid: false,
    formErrors: [],
    isLoading: false,
    isShowingKeyboard: false,
    id: null
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
    Alert.alert(
      'ATENÇÃO',
      'Preencha os dados rigorosamente da MESMA forma que no seu cartão',
      [{ text: 'OK', onPress: () => { } }]
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

  updateBirthdate = (text = '') => {
    const dataFormatada = [];
    const textoASerFormatado = text.replace(/\//gi, '');

    try {
      for (let i = 0; i < textoASerFormatado.length; i++) {
        if (i !== 1 && i !== 3) {
          dataFormatada.push(textoASerFormatado[i]);
        } else {
          dataFormatada.push(textoASerFormatado[i]);
          dataFormatada.push('/');
        }
      }

      return dataFormatada.join('');
    } catch {
      return '';
    }
  }

  preparaDataParaFormatoWirecard = (dataFormatada) => {
    const dataArr = dataFormatada.split('/');
    const dataFormatoWirecard = `${dataArr[2]}-${dataArr[1]}-${dataArr[0]}`;

    return dataFormatoWirecard;
  };

  atualizarDadosCartao = (chave, valor) => {
    const card = this.state.cardData;
    card.creditCard[chave] = valor;

    this.setState({ cardData: card });
  };

  atualizarDadosHolder = (chave, valor) => {
    const card = this.state.cardData;
    if (chave !== 'birthdate') {
      card.creditCard.holder[chave] = valor;
    } else {
      card.creditCard.holder[chave] = this.updateBirthdate(valor);
    }

    this.setState({ cardData: card });
  };

  atualizarDadosHolderDocs = (chave, valor) => {
    const card = this.state.cardData;
    card.creditCard.holder.taxDocument[chave] = valor;

    this.setState({ cardData: card });
  };

  atualizarDadosHolderPhone = (chave, valor) => {
    const card = this.state.cardData;
    card.creditCard.holder.phone[chave] = valor;

    this.setState({ cardData: card });
  };

  validateCard = () => {
    const numberRegex = /^[0-9]*$/;

    const errosArr = [];

    const expirationMonthErrors = [];
    const expirationYearErrors = [];
    const numberErrors = [];
    const cvcErrors = [];
    const fullnameErrors = [];
    const birthdateErrors = [];
    const cpfErrors = [];
    const areaCodeErrors = [];
    const numberPhoneErrors = [];

    // TODO: colocar tamanho máximo no form do input
    // validar data de nascimento no cadastro de usuário
    if (this.state.cardData.creditCard.expirationMonth.length === 0) {
      expirationMonthErrors.push('É obrigatório.');
    } else if (this.state.cardData.creditCard.expirationMonth.length < 2) {
      expirationMonthErrors.push('Inválido.');
    } else if (!numberRegex.test(this.state.cardData.creditCard.expirationMonth)) {
      expirationMonthErrors.push('Apenas números.');
    }

    if (this.state.cardData.creditCard.expirationYear.length === 0) {
      expirationYearErrors.push('É obrigatório.');
    } else if (this.state.cardData.creditCard.expirationYear.length < 2 || this.state.cardData.creditCard.expirationYear.length === 3) {
      expirationYearErrors.push('Inválido.');
    } else if (!numberRegex.test(this.state.cardData.creditCard.expirationYear)) {
      expirationYearErrors.push('Apenas números.');
    }

    if (this.state.cardData.creditCard.number.length === 0) {
      numberErrors.push('É obrigatório.');
    } else if (!numberRegex.test(this.state.cardData.creditCard.number)) {
      numberErrors.push('Apenas números.');
    }

    if (this.state.cardData.creditCard.cvc.length === 0) {
      cvcErrors.push('É obrigatório.');
    } else if (!numberRegex.test(this.state.cardData.creditCard.cvc)) {
      cvcErrors.push('Apenas números.');
    }

    if (this.state.cardData.creditCard.holder.fullname.length === 0) {
      fullnameErrors.push('É obrigatório.');
    }

    if (this.state.cardData.creditCard.holder.birthdate.length === 0) {
      birthdateErrors.push('É obrigatório.');
    } else if (this.state.cardData.creditCard.holder.birthdate.length !== 10) {
      birthdateErrors.push('Inválida.');
    }

    if (this.state.cardData.creditCard.holder.taxDocument.number.length === 0) {
      cpfErrors.push('É obrigatório.');
    }

    if (this.state.cardData.creditCard.holder.phone.areaCode.length !== 2) {
      areaCodeErrors.push('Inválido.');
    }

    if (this.state.cardData.creditCard.holder.phone.number.length < 8) {
      numberPhoneErrors.push('Inválido.');
    }

    if (expirationMonthErrors.length > 0) {
      errosArr.push({ title: 'Mês de Expiração', data: expirationMonthErrors });
    }
    if (expirationYearErrors.length > 0) {
      errosArr.push({ title: 'Ano de Expiração', data: expirationYearErrors });
    }
    if (numberErrors.length > 0) {
      errosArr.push({ title: 'Número de Cartão', data: numberErrors });
    }
    if (cvcErrors.length > 0) {
      errosArr.push({ title: 'Código de Segurança', data: cvcErrors });
    }
    if (fullnameErrors.length > 0) {
      errosArr.push({ title: 'Nome do Titular', data: fullnameErrors });
    }
    if (birthdateErrors.length > 0) {
      errosArr.push({ title: 'Data de Nascimento do Titular', data: birthdateErrors });
    }
    if (cpfErrors.length > 0) {
      errosArr.push({ title: 'CPF do Titular', data: cpfErrors });
    }
    if (areaCodeErrors.length > 0) {
      errosArr.push({ title: 'DDD', data: areaCodeErrors });
    }
    if (numberPhoneErrors.length > 0) {
      errosArr.push({ title: 'Telefone do Titular', data: numberPhoneErrors });
    }

    if (errosArr.length > 0) {
      this.setState({ formErrors: [...errosArr] });
      this.setState({ formInvalid: true });
    } else {
      this.salvarCartao();
    }
  };

  salvarCartao = async () => {
    try {
      this.setState({ isLoading: true });
      const user = TokenService.getInstance().getUser();
      const preparedData = JSON.parse(JSON.stringify(this.state.cardData));
      preparedData.creditCard.holder.birthdate = this.preparaDataParaFormatoWirecard(preparedData.creditCard.holder.birthdate);

      const response = await moipAPI
        .post(`/customers/${user.customer_wirecard_id}/fundinginstruments`,
          preparedData, { headers: headersOauth2 });

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
        style={this.formCartaoScreenStyle.backgroundImageContent}
        source={require('../../../img/Ellipse.png')} >
        <View style={{ height: 60 }}></View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.formCartaoScreenStyle.modalStyle}>
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
            <View style={this.formCartaoScreenStyle.modalBase}>
              <View style={this.formCartaoScreenStyle.modalDialog}>
                <View style={this.formCartaoScreenStyle.modalDialogContent}>
                  <Text style={this.formCartaoScreenStyle.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={this.formCartaoScreenStyle.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={this.formCartaoScreenStyle.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={this.formCartaoScreenStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={this.formCartaoScreenStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={this.formCartaoScreenStyle.cadastroForm}>
            <View style={this.formCartaoScreenStyle.cadastroMainForm}>
              <Text style={this.formCartaoScreenStyle.fontTitle}>{this.state.tituloForm}</Text>

              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('expirationMonth', text) }}
                placeholder="Expiração MM" keyboardType={'number-pad'}
                maxLength={2}
                value={this.state.cardData.creditCard.expirationMonth}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('expirationYear', text) }}
                placeholder="Expiração AA ou AAAA (igual ao seu cartão)" keyboardType={'number-pad'}
                maxLength={4}
                value={this.state.cardData.creditCard.expirationYear}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('number', text) }}
                placeholder="Número" keyboardType={"number-pad"}
                maxLength={50}
                value={this.state.cardData.creditCard.number}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('cvc', text) }}
                placeholder="cvv" keyboardType={"number-pad"}
                maxLength={10}
                value={this.state.cardData.creditCard.cvc}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolder('fullname', text) }}
                placeholder="Titular (Nome completo)"
                value={this.state.cardData.creditCard.holder.fullname}
                maxLength={150}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolder('birthdate', text) }}
                placeholder="Data nascimento (dd/mm/aaaa)" keyboardType={"number-pad"}
                value={this.state.cardData.creditCard.holder.birthdate}
                maxLength={10}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderDocs('number', text) }}
                placeholder="CPF (apenas números)" keyboardType={"number-pad"}
                maxLength={11}
                value={this.state.cardData.creditCard.holder.taxDocument.number}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderPhone('areaCode', text) }}
                placeholder="DDD" keyboardType={"number-pad"}
                maxLength={2}
                value={this.state.cardData.creditCard.holder.phone.areaCode}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderPhone('number', text) }}
                placeholder="Telefone" keyboardType={"number-pad"}
                maxLength={11}
                value={this.state.cardData.creditCard.holder.phone.number}
              />
              <View style={{ height: 8 }}></View>
            </View>
          </View>
        </ScrollView>
        <BotaoCriar isShowingKeyboard={this.state.isShowingKeyboard} onPress={() => this.validateCard()}></BotaoCriar>
      </ImageBackground>
    );
  }

  formCartaoScreenStyle = StyleSheet.create({
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