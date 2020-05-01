import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
  Modal
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import { colors } from '../../colors';
import { StackActions, NavigationActions } from 'react-navigation';
import { SvgXml } from 'react-native-svg';
import { finddoLogo } from '../../img/svg/finddo-logo';
import moipAPI, { headersOauth2 } from '../../services/moip-api';
import UUIDGenerator from 'react-native-uuid-generator';
import { developConfig, productionConfig } from '../../../credenciais-e-configuracoes';

export default class ValorServicoScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    valorServico: '',
    valorComTaxa: 0,
    valorTaxa: 0,
    isLoading: false,
    pedido: null
  };

  constructor(props) {
    super(props);
  }

  calcularValorServico = (valor) => {
    const valorServico = Number(valor);
    let valorComTaxa = 0;

    if (valorServico < 80) {
      valorComTaxa = valorServico * 1.25;
      this.setState({ valorTaxa: valorComTaxa - valorServico });

      return valorComTaxa;
    } else if (valorServico < 500) {
      valorComTaxa = valorServico * 1.2;
      this.setState({ valorTaxa: valorComTaxa - valorServico });

      return valorComTaxa;
    } else if (valorServico >= 500) {
      valorComTaxa = valorServico * 1.15;
      this.setState({ valorTaxa: valorComTaxa - valorServico });

      return valorComTaxa;
    }
  };

  formatarValorServico = (valor) => {
    return `R$ ${String((Math.round((valor + Number.EPSILON) * 100) / 100).toFixed(2))}`;
  };

  prepararPedidoWirecard = (pedido, uuid) => {
    const pedidoWirecard = {};

    pedidoWirecard.ownId = uuid;
    pedidoWirecard.amount = {};
    pedidoWirecard.amount.currency = 'BRL';
    pedidoWirecard.items = [];

    const item = {};

    item.product = pedido.category.name;
    item.quantity = 1;
    item.detail = 'Prestação de serviço residencial';
    item.price = this.formatarValorServico(this.state.valorComTaxa).split('').slice(3).join('').replace('.', '').replace(',', '');

    pedidoWirecard.items.push(item);

    pedidoWirecard.customer = {};
    pedidoWirecard.customer.id = pedido.user.customer_wirecard_id;

    pedidoWirecard.receivers = [];

    const primaryReceiver = {
      type: 'PRIMARY',
      feePayor: true,
      moipAccount: {
        id: developConfig.moipCredsData.moipAccountId
      },
      amount: {
        fixed: this.formatarValorServico(this.state.valorTaxa).split('').slice(3).join('').replace('.', '').replace(',', '')
      }
    };

    const secondaryReceiver = {
      type: 'SECONDARY',
      feePayor: false,
      moipAccount: {
        id: TokenService.getInstance().getUser().id_wirecard_account
      },
      amount: {
        fixed: this.formatarValorServico(Number(this.state.valorServico)).split('').slice(3).join('').replace('.', '').replace(',', '')
      }
    };

    pedidoWirecard.receivers.push(primaryReceiver, secondaryReceiver);

    return pedidoWirecard;
  }

  componentDidMount() {
    const { navigation } = this.props;
    const pedido = navigation.getParam('pedido', null);

    if (pedido) {
      this.setState({ pedido });
    }
  }

  render() {
    return (
      <ImageBackground
        style={this.telaValorStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.telaValorStyle.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={this.telaValorStyle.loginForm}>
            <SvgXml xml={finddoLogo} width={126} height={30} style={this.telaValorStyle.finddoLogoStyle}></SvgXml>
            <View style={this.telaValorStyle.loginMainForm}>
              <Text style={this.telaValorStyle.fontTitle}>Cobrança</Text>
              <TextInput
                style={this.telaValorStyle.loginFormSizeAndFont}
                placeholder="Valor do serviço"
                keyboardType="number-pad"
                onChangeText={
                  (valor) => {
                    try {
                      this.setState({ valorServico: valor }, () => {
                        this.setState({ valorComTaxa: this.calcularValorServico(this.state.valorServico) })
                      });
                    }
                    catch { }
                  }}
                value={this.state.valorServico}
              />
              <TextInput
                style={this.telaValorStyle.loginFormSizeAndFont}
                placeholder="Total a ser cobrado"
                value={this.formatarValorServico(this.state.valorComTaxa)}
                editable={false}
              />
            </View>
            <TouchableOpacity
              style={this.telaValorStyle.loginButton}
              onPress={() => {
                if (!this.state.valorServico || this.state.valorComTaxa < 0) {
                  Alert.alert(
                    'Finddo',
                    'Por favor defina um valor para o pedido',
                    [
                      { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: false },
                  );
                } else {
                  const order = this.state.pedido;

                  Alert.alert(
                    'Finddo',
                    `Confirma o valor ${this.formatarValorServico(this.state.valorComTaxa)}?`,
                    [
                      { text: 'Cancelar', onPress: () => { } },
                      {
                        text: 'OK', onPress: () => {
                          this.setState({ isLoading: true }, () => {
                            order.price = this.state.valorComTaxa * 100;

                            UUIDGenerator.getRandomUUID().then((uuid) => {
                              const pedidoWirecard = this.prepararPedidoWirecard(this.state.pedido, uuid);
                              moipAPI.post('/orders', pedidoWirecard, { headers: headersOauth2 }).then(responseWirecard => {
                                order.order_wirecard_own_id = responseWirecard.data.ownId;
                                order.order_wirecard_id = responseWirecard.data.id;

                                backendRails.patch(`/orders/${this.state.pedido.id}`,
                                  { order },
                                  { headers: TokenService.getInstance().getHeaders() })
                                  .then(response => {
                                    this.setState(
                                      { pedido: response.data, isLoading: false },
                                      () => {
                                        const resetAction = StackActions.reset({
                                          index: 0,
                                          actions: [NavigationActions.navigate({ routeName: 'Acompanhamento', params: { pedido: this.state.pedido } })],
                                        });
                                        this.props.navigation.dispatch(resetAction);
                                      }
                                    );
                                  })
                                  .catch(error => {
                                    if (error.response) {
                                      /*
                                       * The request was made and the server responded with a
                                       * status code that falls out of the range of 2xx
                                       */
                                      Alert.alert(
                                        'Falha ao processar pedido',
                                        'Seu pedido foi processado porém houve um erro interno, acesse a seção Contato em Ajuda para mais informações.',
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
                                        'Falha de conexão',
                                        'Seu pedido foi processado porém houve um erro interno, acesse a seção Contato em Ajuda para mais informações.',
                                        [
                                          { text: 'OK', onPress: () => { } },
                                        ],
                                        { cancelable: false },
                                      );
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
                                    'Falha ao processar pedido',
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
                            })
                          });
                        }
                      },
                    ],
                    { cancelable: false },
                  );
                }
              }}>
              <Text style={this.telaValorStyle.loginButtonText}>COBRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  telaValorStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
    loginForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 340, height: 250, backgroundColor: colors.branco },
    loginButton: {
      marginTop: 40, marginBottom: 10,
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    loginButtonText: {
      fontSize: 18, color: colors.branco, textAlign: 'center'
    },
    loginFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      borderBottomColor: colors.verdeFinddo,
      borderBottomWidth: 2,
      textAlign: 'left',
      width: 300,
    },
    loginEsqueciSenha:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'center',
      width: 300,
      textDecorationLine: 'underline',
      textAlignVertical: 'bottom'
    },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    cadastreSe: { fontWeight: 'bold', textDecorationLine: 'underline' }
  });
}
