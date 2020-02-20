import React, { Component } from 'react';
import {
  Text,
  FlatList, StyleSheet,
  TouchableOpacity, View,
  ImageBackground,
  Picker,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Alert
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../colors';
import { NavigationEvents } from 'react-navigation';
import VisualizarPedido from '../../components/modal-visualizar-pedido';

const enumEstadoPedidoMap = {
  analise: 'Pedido em Análise',
  agendando_visita: 'Agendando Visita',
  a_caminho: 'Profissional à Caminho',
  em_servico: 'Serviço em Execução',
  finalizado: 'Concluído',
  cancelado: 'Cancelado',
  none: 'Selecione um status'
}

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
    tipoPedidoSelecionado: Object.keys(enumEstadoPedidoMap)[6],
    loadingData: false,
    loadingOrders: false,
    isShowingPedido: false,
    pedidoCorrente: null
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
      console.log(error);
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
      console.log(error);
    } finally {
      this.setState({ loadingOrders: false });
    }
  };

  associarPedido = async (pedido) => {
    Alert.alert(
      'Finddo',
      'O que deseja fazer?',
      [
        {
          text: 'Visualizar pedido',
          onPress: () => {
            this.setState({ pedidoCorrente: pedido, isShowingPedido: true });
          }
        },
        {
          text: 'Verificar status',
          onPress: () => this.props.navigation.navigate('AcompanhamentoPedido', { pedido })
        }
      ],
      { cancelable: false },
    );
  };

  render() {
    let user = TokenService.getInstance().getUser();
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={meusPedidosStyles.container}>
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
            <Picker
              selectedValue={this.state.tipoPedidoSelecionado}
              style={{
                height: 50, width: 320,
              }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ tipoPedidoSelecionado: itemValue })
              }>
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[0]} value={Object.keys(enumEstadoPedidoMap)[0]} />
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[2]} value={Object.keys(enumEstadoPedidoMap)[2]} />
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[3]} value={Object.keys(enumEstadoPedidoMap)[3]} />
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[4]} value={Object.keys(enumEstadoPedidoMap)[4]} />
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[5]} value={Object.keys(enumEstadoPedidoMap)[5]} />
              <Picker.Item label={Object.values(enumEstadoPedidoMap)[6]} value={Object.keys(enumEstadoPedidoMap)[6]} />
            </Picker>
          </View>
          <View style={{ height: 425 }}>
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
          <NovoPedido botaoStyle={meusPedidosStyles.novoPedidoButton}
            onPress={() => {
              this.props.navigation.navigate('Services');
            }} user={user}
          ></NovoPedido>
        </View>
      </ImageBackground>
    );
  }
}

const meusPedidosStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center'
  },
  item: {
    padding: 10,
    fontSize: 35,
    height: 70,
  },
  pedidoLabel: {
    borderRadius: 12, backgroundColor: colors.branco,
    marginBottom: 10, width: 340,
    alignItems: 'center', justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  pedidoIndicador: {
    width: 20, height: 20,
    borderRadius: 40, borderColor: colors.bordaIconeStatus,
    backgroundColor: colors.verdeEscuroStatus, borderWidth: 1
  },
  pedidoSetaDireita: {
    width: 40, height: 40,
    flex: 1, alignItems: 'flex-end',
    justifyContent: 'center'
  },
  novoPedidoButton: {
    backgroundColor: colors.verdeFinddo, height: 45,
    width: 340, borderRadius: 20,
    color: colors.branco, marginTop: 10,
    alignItems: 'center', justifyContent: 'center'
  }
});

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
                style={[meusPedidosStyles.item, meusPedidosStyles.pedidoLabel]}>
                <View style={{ width: 260 }}>
                  <Text style={{ fontSize: 20, marginBottom: 5 }}>{item.category.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={meusPedidosStyles.pedidoIndicador}></View>
                    <Text style={{ fontSize: 18, color: colors.cinza }}>    {enumEstadoPedidoMap[item.order_status]}</Text>
                  </View>
                </View>
                <View style={meusPedidosStyles.pedidoSetaDireita}>
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