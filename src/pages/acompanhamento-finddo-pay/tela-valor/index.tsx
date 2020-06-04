import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
  Modal
} from 'react-native';
import backendRails from '../../../services/backend-rails-api';
import TokenService from '../../../services/token-service';
import { colors } from '../../../colors';
import { StackActions, NavigationActions } from 'react-navigation';
import { SvgXml } from 'react-native-svg';
import { finddoLogo } from '../../../img/svg/finddo-logo';
import moipAPI, { headersOauth2 } from '../../../services/moip-api';
import UUIDGenerator from 'react-native-uuid-generator';
import { ambienteASerConstruido } from '../../../../credenciais-e-configuracoes';
import { styles } from './styles';

export default class ValorServicoScreen extends Component {
	public setState: any;
	public props: any;
	public navigation: any;
  static navigationOptions = {
    headerShown: false,
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
        id: ambienteASerConstruido.moipCredsData.moipAccountId
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
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
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
          <View style={styles.loginForm}>
            <SvgXml xml={finddoLogo} width={126} height={30} style={styles.finddoLogoStyle}></SvgXml>
            <View style={styles.loginMainForm}>
              <Text style={styles.fontTitle}>Cobrança</Text>
              <TextInput
                style={styles.loginFormSizeAndFont}
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
                style={styles.loginFormSizeAndFont}
                placeholder="Total a ser cobrado"
                value={this.formatarValorServico(this.state.valorComTaxa)}
                editable={false}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
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
              <Text style={styles.loginButtonText}>COBRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
