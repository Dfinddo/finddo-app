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
import moipAPI, { headers } from '../../../services/moip-api';

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

  atualizarDadosCartao = (chave, valor) => {
    const card = this.state.cardData;
    card.creditCard[chave] = valor;

    this.setState({ cardData: card });
  };

  atualizarDadosHolder = (chave, valor) => {
    const card = this.state.cardData;
    card.creditCard.holder[chave] = valor;

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
    this.salvarCartao();
  };

  salvarCartao = async () => {
    try {
      this.setState({ isLoading: true });
      const user = TokenService.getInstance().getUser();
      const response = await moipAPI
        .post(`/customers/${user.customer_wirecard_id}/fundinginstruments`,
          this.state.cardData, { headers: headers });

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
                value={this.state.cardData.creditCard.expirationMonth}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('expirationYear', text) }}
                placeholder="Expiração AAAA" keyboardType={'number-pad'}
                value={this.state.cardData.creditCard.expirationYear}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('number', text) }}
                placeholder="Número" keyboardType={"number-pad"}
                value={this.state.cardData.creditCard.number}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosCartao('cvc', text) }}
                placeholder="cvc" keyboardType={"number-pad"}
                value={this.state.cardData.creditCard.cvc}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolder('fullname', text) }}
                placeholder="Titular (Nome completo)"
                value={this.state.cardData.creditCard.holder.fullname}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolder('birthdate', text) }}
                placeholder="Data nascimento (dd/mm/aaaa)" keyboardType={"numbers-and-punctuation"}
                value={this.state.cardData.creditCard.holder.birthdate}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderDocs('number', text) }}
                placeholder="CPF" keyboardType={"number-pad"}
                value={this.state.cardData.creditCard.holder.taxDocument.number}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderPhone('areaCode', text) }}
                placeholder="DDD" keyboardType={"number-pad"}
                value={this.state.cardData.creditCard.holder.phone.areaCode}
              />
              <TextInput
                style={this.formCartaoScreenStyle.cadastroFormSizeAndFont}
                onChangeText={text => { this.atualizarDadosHolderPhone('number', text) }}
                placeholder="Telefone" keyboardType={"number-pad"}
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
          }}>SALVAR</Text>
        </TouchableOpacity>
      </View>);
  } else {
    return (null);
  }
}