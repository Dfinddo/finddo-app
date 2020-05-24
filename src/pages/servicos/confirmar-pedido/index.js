import React, { Component } from 'react';
import VisualizarPedido from '../../../components/modal-visualizar-pedido';
import PedidoCorrenteService from '../../../services/pedido-corrente-service';
import { ImageBackground, View, Alert, ActivityIndicator } from 'react-native';
import TokenService from '../../../services/token-service';
import { colors } from '../../../colors';
import backendRails from '../../../services/backend-rails-api';
import { StackActions, NavigationActions } from 'react-navigation';
import FotoService from '../../../services/foto-service';

const fotoDefault = require('../../../img/add_foto_problema.png');

export class ConfirmarPedido extends Component {
  static navigationOptions = {
    title: `Confirme seu pedido`,
    headerBackTitle: 'Voltar'
  }

  constructor(props) {
    super(props);

    this.state = {
      necessidade: '',
      imageServicoUrl: require('../../../img/jacek-dylag-unsplash.png'),
      categoriaPedido: null,
      isLoading: false,
      dataPedido: null,
      hora: null,
      horaFim: null,
      urgencia: '',
      isConfirming: false,
      foto1: fotoDefault,
      foto1Setada: false,
      foto2: fotoDefault,
      foto2Setada: false,
      foto3: fotoDefault,
      foto3Setada: false,
      foto4: fotoDefault,
      foto4Setada: false,
      fotosPedido: [],
      isSelectEndereco: false,
      enderecos: [],
      enderecoSelecionado: null,
      temPedido: false
    };
  }

  componentDidMount() {
    const pedidoService = PedidoCorrenteService.getInstance();
    const pedidoCorrente = pedidoService.getPedidoCorrente();

    this.setState({
      necessidade: pedidoCorrente.necessidade,
      categoriaPedido: { name: 'Teste' },
      urgencia: pedidoCorrente.urgencia,
      dataPedido: pedidoCorrente.dataPedido,
      hora: pedidoCorrente.hora,
      horaFim: pedidoCorrente.horaFim,
      enderecoSelecionado: pedidoCorrente.address,
      fotosPedido: [],
      temPedido: true
    });
  }

  salvarPedidoLocalStorage = () => {
    const tokenService = TokenService.getInstance();
    const pedidoService = PedidoCorrenteService.getInstance();

    if (!tokenService.getUser()) {
      Alert.alert(
        'Acesse sua conta',
        'Para poder continuar com seu pedido, '
        + 'você precisa estar logado no Finddo',
        [
          {
            text: 'Cancelar', onPress: () => { }
          },
          {
            text: 'Login', onPress: () => {
              this.setState({ isLoading: true }, () => {
                pedidoService.salvarPedidoLocalStorage(pedidoService.getPedidoCorrente())
                  .then(_ => {
                    this.setState({ isLoading: false });
                    this.props.navigation.navigate('Auth');
                  }).catch(_ => {
                    const pedido = pedidoService.getPedidoCorrente();
                    if (pedido.foto1) { delete pedido.foto1 };
                    if (pedido.foto2) { delete pedido.foto2 };
                    if (pedido.foto3) { delete pedido.foto3 };
                    if (pedido.foto4) { delete pedido.foto4 };

                    pedidoService.salvarPedidoLocalStorage(pedidoService.getPedidoCorrente())
                      .then(_ => {
                        this.setState({ isLoading: false });
                        this.props.navigation.navigate('Auth');
                      })
                  });
              });
            }
          },
        ]);
    } else {
      this.salvarPedido(pedidoService.getPedidoCorrente());
    }
  }

  salvarPedido = (orderData) => {
    const pedidoService = PedidoCorrenteService.getInstance();

    this.setState({ isLoading: true }, () => {
      const order = {};
      order.description = orderData.necessidade;
      order.category_id = +orderData.categoriaPedido.id;
      order.user_id = TokenService.getInstance().getUser().id;
      order.start_order = `${orderData.dataPedido.toDateString()} ${orderData.hora}`;
      order.hora_inicio = `${orderData.hora}`;
      order.hora_fim = `${orderData.horaFim}`;
      if (orderData.urgencia === 'definir-data') {
        order.urgency = 'urgent';
        order.end_order = `${orderData.dataPedido.toDateString()} ${orderData.horaFim}`;
      }
      const images = [];
      if (pedidoService.getPedidoCorrente().foto1) { images.push({ base64: pedidoService.getPedidoCorrente().foto1.base64, file_name: 'foto1.jpg' }) }
      if (pedidoService.getPedidoCorrente().foto2) { images.push({ base64: pedidoService.getPedidoCorrente().foto2.base64, file_name: 'foto2.jpg' }) }
      if (pedidoService.getPedidoCorrente().foto3) { images.push({ base64: pedidoService.getPedidoCorrente().foto3.base64, file_name: 'foto3.jpg' }) }
      if (pedidoService.getPedidoCorrente().foto4) { images.push({ base64: pedidoService.getPedidoCorrente().foto4.base64, file_name: 'foto4.jpg' }) }

      if (orderData.address.id) {
        order.address_id = this.state.enderecoSelecionado.id;
      } else {
        order.address_id = null
      }

      backendRails.post('/orders', { order, images, address: orderData.address }, { headers: TokenService.getInstance().getHeaders() })
        .then((response) => {
          FotoService.getInstance().setFotoId(0);
          FotoService.getInstance().setFotoData(null);
          pedidoService.salvarPedidoLocalStorage(null).then(_ => {
            this.setState({ isLoading: true }, () => {

              pedidoService.setPedidoCorrente(null);
              setTimeout(() => {

                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Services' })],
                  key: 'Finddo'
                });
                this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate('AcompanhamentoPedido', { pedido: response.data });
              }, 2000);
            });
          });
        })
        .catch((error) => {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            Alert.alert(
              'Falha ao realizar operação',
              'Revise seus dados e tente novamente',
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
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../../../img/Ellipse.png')}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
          </View>
        </ImageBackground>);
    } else {
      return (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../../../img/Ellipse.png')}>
          <View style={{
            flex: 1,
            paddingTop: 10,
            alignItems: 'center'
          }}>
            {(() => {
              if (this.state.temPedido) {
                return (<VisualizarPedido
                  pedido={this.state}
                  onConfirm={() => { this.salvarPedidoLocalStorage() }}
                  onCancel={() => {
                    const resetAction = StackActions.pop();
                    this.props.navigation.dispatch(resetAction);
                  }} />);
              } else {
                return (null);
              }
            })()}
          </View>
        </ImageBackground>
      );
    }
  }
}
