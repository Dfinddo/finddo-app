import React, { Component } from 'react';
import {
  Text, Modal,
  FlatList,
  TouchableOpacity, View,
  ImageBackground, Alert, ActivityIndicator,
  RefreshControl
} from 'react-native';
import backendRails from '../../../services/backend-rails-api';
import TokenService from '../../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../colors';
import { NavigationEvents } from 'react-navigation';
import VisualizarPedidoProfissional from '../../../components/modal-visualizar-pedido-profissional';
import { styles } from './styles';

export default class IndexProfissional extends Component {
	public setState: any;
	public props: any;
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
    }
  };

  exibirPedido = (item) => {
    this.setState({ isShowingPedido: true, pedidoCorrente: item });
  }

  confirmarPedido = (pedido) => {
    const user = TokenService.getInstance().getUser();
    this.setState({ isLoadingRequest: true }, () => {
      backendRails.get(`/users/profile_photo/${user.id}`, { headers: TokenService.getInstance().getHeaders() })
        .then(data => {
          if (data.data.photo && user.token_wirecard_account) {
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
              'Para começar a atender você precisa adicionar uma foto de perfil e autorizar as transações (aba Perfil)',
              [
                { text: 'Ok', onPress: () => { this.setState({ isShowingPedido: false, isLoadingRequest: false }) } },
              ],
              { cancelable: false },
            );
          }
        })
        .catch(error => {
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
          this.setState({ isShowingPedido: false, isLoadingRequest: false })
        });
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
      this.setState({ isLoadingRequest: false });
    }
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
            refreshControl={<RefreshControl
              colors={[colors.verdeFinddo]}
              refreshing={this.state.isLoadingRequest}
              onRefresh={() => this.obterPedidos()}
            />}
            renderItem={
              ({ item }) =>
                <TouchableOpacity
                  onPress={() => {/*this.associarPedido(item)*/this.exibirPedido(item) }}
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
      </ImageBackground>
    );
  }
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

export const enumEstadoPedidoMap = {
  analise: 'Pedido em Análise',
  agendando_visita: 'Agendando Visita',
  a_caminho: 'Profissional à Caminho',
  em_servico: 'Serviço em Execução',
  finalizado: 'Concluído',
  cancelado: 'Cancelado'
}
