import React, { Component } from 'react';
import {
  Text, Modal,
  FlatList, StyleSheet,
  TouchableOpacity, View,
  ImageBackground, Alert, ActivityIndicator
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../colors';
import { NavigationEvents } from 'react-navigation';
import VisualizarPedidoProfissional from '../../components/modal-visualizar-pedido-profissional';

const enumEstadoPedidoMap = {
  analise: 'Pedido em Análise',
  agendando_visita: 'Agendando Visita',
  a_caminho: 'Profissional à Caminho',
  em_servico: 'Serviço em Execução',
  finalizado: 'Concluído',
  cancelado: 'Cancelado'
}

export default class IndexProfissional extends Component {
  static navigationOptions = {
    title: 'Pedidos Disponíveis'
  };

  state = {
    pedidos: [],
    page: 1,
    isShowingPedido: false,
    pedidoCorrente: null,
    isLoadingRequest: false,
  };

  obterPedidos = async (page = 1) => {
    try {
      const tokenService = TokenService.getInstance();
      let response = {};

      response = await
        backendRails
          .get('/orders/available',
            { headers: tokenService.getHeaders() });

      const orders = response.data;

      orders.forEach(element => {
        element.id = element.id + '';
      });

      this.setState({
        pedidos: [...orders],
      });
    } catch (error) {
      console.log(error);
    }
  };

  exibirPedido = (item) => {
    this.setState({ isShowingPedido: true, pedidoCorrente: item });
  }

  confirmarPedido = (pedido) => {
    const id = TokenService.getInstance().getUser().id;
    this.setState({ isLoadingRequest: true }, () => {
      backendRails.get(`/users/profile_photo/${id}`, { headers: TokenService.getInstance().getHeaders() })
        .then(data => {
          if (data.data.photo) {
            Alert.alert(
              'Atendimento',
              'Deseja atender ao pedido?',
              [
                { text: 'Não', onPress: () => { this.setState({ isShowingPedido: false, isLoadingRequest: false }) } },
                { text: 'Sim', onPress: () => { this.associarPedido(pedido) } },
              ],
              { cancelable: false },
            );
          } else {
            Alert.alert(
              'Atendimento',
              'Para começar a atender você precisa adicionar uma foto de perfil (aba Perfil)',
              [
                { text: 'Ok', onPress: () => { this.setState({ isShowingPedido: false, isLoadingRequest: false }) } },
              ],
              { cancelable: false },
            );
          }
        })
        .catch(_ => this.setState({ isShowingPedido: false, isLoadingRequest: false }));
    });
  }

  associarPedido = async (pedido) => {
    this.setState({ isShowingPedido: false, isLoadingRequest: true });

    const tokenService = TokenService.getInstance();

    try {
      let response = await
        backendRails
          .put('/orders/associate/' + pedido.id + '/' + tokenService.getUser().id,
            { order: pedido },
            { headers: tokenService.getHeaders() });

      this.setState({ isLoadingRequest: false });
      this.props.navigation.navigate('AcompanhamentoPedido', { pedido: response.data });
    } catch (error) {
      console.log(error);
      this.setState({ isLoadingRequest: false });
    }
  };

  render() {
    let user = TokenService.getInstance().getUser();
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={this.meusPedidosStyles.container}>
          <NavigationEvents
            onWillFocus={_ => this.obterPedidos()}
          //onDidFocus={payload => console.log('did focus', payload)}
          //onWillBlur={payload => console.log('will blur', payload)}
          //onDidBlur={payload => console.log('did blur', payload)}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoadingRequest}
          >
            <View style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isShowingPedido}
          >
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <VisualizarPedidoProfissional
                pedido={this.state.pedidoCorrente}
                onConfirm={() => this.confirmarPedido(this.state.pedidoCorrente)}
                onCancel={() => this.setState({ isShowingPedido: false })}
              >

              </VisualizarPedidoProfissional>
            </View>
          </Modal>
          <TitutloNovos user={user}></TitutloNovos>
          <FlatList
            data={this.state.pedidos}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) =>
                <TouchableOpacity
                  onPress={() => {/*this.associarPedido(item)*/this.exibirPedido(item) }}
                  style={[this.meusPedidosStyles.item, this.meusPedidosStyles.pedidoLabel]}>
                  <View style={{ width: 260 }}>
                    <Text style={{ fontSize: 20, marginBottom: 5 }}>{item.category.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={this.meusPedidosStyles.pedidoIndicador}></View>
                      <Text style={{ fontSize: 18, color: colors.cinza }}>    {enumEstadoPedidoMap[item.order_status]}</Text>
                    </View>
                  </View>
                  <View style={this.meusPedidosStyles.pedidoSetaDireita}>
                    <Icon
                      style={{ width: 40 }}
                      name={'keyboard-arrow-right'}
                      size={20} color={colors.cinza} />
                  </View>
                </TouchableOpacity>}
          />
        </View>
      </ImageBackground>
    );
  }

  meusPedidosStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
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
      color: colors.branco,
      alignItems: 'center', justifyContent: 'center'
    }
  });
}

function TitutloNovos(props) {
  titulo = 'Pedidos a serem atendidos';

  return (
    <View style={{
      width: '100%', marginLeft: 10,
      alignContent: 'flex-start', marginBottom: 10
    }}>
      <Text style={{ fontSize: 20 }}>{titulo}</Text>
    </View>
  );
}
