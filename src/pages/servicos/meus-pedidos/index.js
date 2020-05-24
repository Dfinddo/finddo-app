import React, { Component } from 'react';
import {
  Text, FlatList,
  TouchableOpacity, View,
  ImageBackground,
  ActivityIndicator, Modal,
  RefreshControl, Alert,
} from 'react-native';
import backendRails from '../../../services/backend-rails-api';
import TokenService from '../../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../colors';
import { NavigationEvents } from 'react-navigation';
import VisualizarPedido from '../../../components/modal-visualizar-pedido';
import CustomPicker from '../../../components/custom-picker';
import { styles } from './styles';

export default class MeusPedidos extends Component {
  static navigationOptions = {
    title: 'Pedidos'
  };

  state = {
    pedidos: [],
    page: 1,
    pedidosAnalise: [],
    pedidosCaminho: [],
    pedidosServico: [],
    pedidosFinalizado: [],
    pedidosCancelado: [],
    tipoPedidoSelecionado: estadoPedidoValues[0].value,
    loadingData: false,
    loadingOrders: false,
    isShowingPedido: false,
    pedidoCorrente: null,
    enderecoSelecionado: null
  };

  obterPedidos = async (page = 1) => {
    this.setState({ loadingData: true });
    let user = TokenService.getInstance().getUser();
    const typeUser = 'user';

    try {
      const tokenService = TokenService.getInstance();
      let response = {};
      if (user.user_type === typeUser) {
        response = await
          backendRails
            .get('/orders/user/' + tokenService.getUser().id + '/active',
              { headers: tokenService.getHeaders() });
      } else {
        response = await
          backendRails
            .get('/orders/available',
              { headers: tokenService.getHeaders() });
      }

      const orders = response.data;

      orders.forEach(element => {
        element.id = element.id + '';
      });

      const pedidosAnalise = orders.filter((order) => {
        return order.order_status === 'analise';
      });

      const pedidosCaminho = orders.filter((order) => {
        return order.order_status === 'a_caminho';
      });

      const pedidosServico = orders.filter((order) => {
        return order.order_status === 'em_servico';
      });

      const pedidosFinalizado = orders.filter((order) => {
        return order.order_status === 'finalizado';
      });

      const pedidosCancelado = orders.filter((order) => {
        return order.order_status === 'cancelado';
      });

      this.setState({
        pedidos: [...orders],
        pedidosAnalise: [...pedidosAnalise],
        pedidosCaminho: [...pedidosCaminho],
        pedidosServico: [...pedidosServico],
        pedidosFinalizado: [...pedidosFinalizado],
        pedidosCancelado: [...pedidosCancelado],
      });
    } catch (error) {
      // console.log(error);
    } finally {
      this.setState({ loadingData: false });
    }
  };

  obterPedidosRefresh = async (page = 1) => {
    this.setState({ loadingOrders: true });
    let user = TokenService.getInstance().getUser();
    const typeUser = 'user';

    try {
      const tokenService = TokenService.getInstance();
      let response = {};
      if (user.user_type === typeUser) {
        response = await
          backendRails
            .get('/orders/user/' + tokenService.getUser().id + '/active',
              { headers: tokenService.getHeaders() });
      } else {
        response = await
          backendRails
            .get('/orders/available',
              { headers: tokenService.getHeaders() });
      }

      const orders = response.data;

      orders.forEach(element => {
        element.id = element.id + '';
      });

      const pedidosAnalise = orders.filter((order) => {
        return order.order_status === 'analise';
      });

      const pedidosCaminho = orders.filter((order) => {
        return order.order_status === 'a_caminho';
      });

      const pedidosServico = orders.filter((order) => {
        return order.order_status === 'em_servico';
      });

      const pedidosFinalizado = orders.filter((order) => {
        return order.order_status === 'finalizado';
      });

      const pedidosCancelado = orders.filter((order) => {
        return order.order_status === 'cancelado';
      });

      this.setState({
        pedidos: [...orders],
        pedidosAnalise: [...pedidosAnalise],
        pedidosCaminho: [...pedidosCaminho],
        pedidosServico: [...pedidosServico],
        pedidosFinalizado: [...pedidosFinalizado],
        pedidosCancelado: [...pedidosCancelado],
      });
    } catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        Alert.alert(
          'Erro',
          'Verifique sua conexão e tente novamente',
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
    } finally {
      this.setState({ loadingOrders: false });
    }
  };

  associarPedido = async (pedido) => {
    const buttons = [
      {
        text: 'Visualizar pedido',
        onPress: () => {
          this.setState({ pedidoCorrente: pedido, enderecoSelecionado: pedido.address, isShowingPedido: true });
        }
      },
      {
        text: 'Verificar status',
        onPress: () => this.props.navigation.navigate('AcompanhamentoPedido', { pedido })
      }
    ];
    Alert.alert(
      'Finddo',
      'O que deseja fazer?',
      pedido.order_status === 'finalizado' ? [buttons[0]] : buttons,
      { cancelable: false },
    );
  };

  render() {
    let user = TokenService.getInstance().getUser();
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../../img/Ellipse.png')}>
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={_ => this.obterPedidos()}
          //onDidFocus={payload => console.log('did focus', payload)}
          //onWillBlur={payload => console.log('will blur', payload)}
          //onDidBlur={payload => console.log('did blur', payload)}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isShowingPedido}
          >
            <VisualizarPedido
              pedido={this.state}
              onConfirm={() => this.setState({ isShowingPedido: false })}
              onCancel={() => this.setState({ isShowingPedido: false })}></VisualizarPedido>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.loadingData}
          >
            <View style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
            </View>
          </Modal>
          <View style={{
            height: 60, backgroundColor: colors.branco,
            width: 340, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 10
          }}>
            <CustomPicker
              style={styles.selecionaStatus}
              items={estadoPedidoValues}
              onSelect={({ value }) => this.setState({ tipoPedidoSelecionado: value })}
            />
          </View>
          <View style={{ height: 400 }}>
            {(() => {
              switch (this.state.tipoPedidoSelecionado) {
                case ('analise'):
                  return (
                    <ListaPedidos
                      pedidos={this.state.pedidosAnalise}
                      refreshing={this.state.loadingOrders}
                      onRefresh={() => {
                        this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                      }}
                      onPressItem={(item) => this.associarPedido(item)} />
                  );
                case ('a_caminho'):
                  return (
                    <ListaPedidos
                      pedidos={this.state.pedidosCaminho}
                      refreshing={this.state.loadingOrders}
                      onRefresh={() => {
                        this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                      }}
                      onPressItem={(item) => this.associarPedido(item)} />
                  );
                case ('em_servico'):
                  return (
                    <ListaPedidos
                      pedidos={this.state.pedidosServico}
                      refreshing={this.state.loadingOrders}
                      onRefresh={() => {
                        this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                      }}
                      onPressItem={(item) => this.associarPedido(item)} />
                  );
                case ('finalizado'):
                  return (
                    <ListaPedidos
                      pedidos={this.state.pedidosFinalizado}
                      refreshing={this.state.loadingOrders}
                      onRefresh={() => {
                        this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                      }}
                      onPressItem={(item) => this.associarPedido(item)} />
                  );
                case ('cancelado'):
                  return (
                    <ListaPedidos
                      pedidos={this.state.pedidosCancelado}
                      refreshing={this.state.loadingOrders}
                      onRefresh={() => {
                        this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                      }}
                      onPressItem={(item) => this.associarPedido(item)} />
                  );
                default: return (
                  <ListaPedidos
                    pedidos={this.state.pedidos}
                    refreshing={this.state.loadingOrders}
                    onRefresh={() => {
                      this.setState({ loadingOrders: true }, () => this.obterPedidosRefresh())
                    }}
                    onPressItem={(item) => this.associarPedido(item)} />);
              }
            })()
            }
          </View>
          <NovoPedido botaoStyle={styles.novoPedidoButton}
            onPress={() => {
              this.props.navigation.navigate('Services');
            }} user={user}
          />
        </View>
      </ImageBackground>
    );
  }
}

function NovoPedido(props) {
  user = props.user;
  if (user.user_type === 'user') {
    return (
      <TouchableOpacity
        style={props.botaoStyle}
        onPress={props.onPress}>
        <Text style={{ fontSize: 20, color: colors.branco }}>NOVO PEDIDO</Text>
      </TouchableOpacity>
    );
  } else {
    return (null);
  }
}

function ListaPedidos(props) {
  if (props.pedidos.length > 0) {
    return (
      <View>
        <FlatList
          data={props.pedidos}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              colors={[colors.verdeFinddo]}
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
            />
          }
          renderItem={
            ({ item }) =>
              <TouchableOpacity
                onPress={() => props.onPressItem(item)}
                style={[styles.item, styles.pedidoLabel]}>
                <View style={{ width: 260 }}>
                  <Text style={{ fontSize: 20, marginBottom: 5 }}>{item.category.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.pedidoIndicador}></View>
                    <Text style={{ fontSize: 18, color: colors.cinza }}>    {enumEstadoPedidoMap[item.order_status]}</Text>
                  </View>
                </View>
                <View style={styles.pedidoSetaDireita}>
                  <Icon
                    style={{ width: 40 }}
                    name={'keyboard-arrow-right'}
                    size={20} color={colors.cinza} />
                </View>
              </TouchableOpacity>}
        />
      </View>
    );
  } else {
    return (null);
  }
}

const estadoPedidoValues = [
  { content: 'Selecione um status', value: 'none', id: '0' },
  { content: 'Pedido em Análise', value: 'analise', id: '1' },
  { content: 'Agendando Visita', value: 'agendando_visita', id: '2' },
  { content: 'Profissional à Caminho', value: 'a_caminho', id: '3' },
  { content: 'Serviço em Execução', value: 'em_servico', id: '4' },
  { content: 'Concluído', value: 'finalizado', id: '5' },
  { content: 'Cancelado', value: 'cancelado', id: '6' },
];

const enumEstadoPedidoMap = {
  analise: 'Pedido em Análise',
  agendando_visita: 'Agendando Visita',
  a_caminho: 'Profissional à Caminho',
  em_servico: 'Serviço em Execução',
  finalizado: 'Concluído',
  cancelado: 'Cancelado',
  none: 'Selecione um status'
}