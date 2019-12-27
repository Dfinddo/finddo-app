import React, { Component } from 'react';
import {
  Text,
  FlatList, StyleSheet,
  TouchableOpacity, View,
  ImageBackground
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../colors';
import { NavigationEvents } from 'react-navigation';

const enumEstadoPedidoMap = {
  analise: 'Pedido em Análise',
  agendando_visita: 'Agendando Visita',
  a_caminho: 'Profissional à Caminho',
  em_servico: 'Serviço em Execução',
  finalizado: 'Concluído',
  cancelado: 'Cancelado'
}

export default class MeusPedidos extends Component {
  static navigationOptions = {
    title: 'Acompanhe seu pedido'
  };

  state = {
    pedidos: [],
    page: 1,
  };

  obterPedidos = async (page = 1) => {
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

      this.setState({
        pedidos: [...orders],
      });
    } catch (error) {
      console.log(error);
    }
  };

  associarPedido = async (pedido) => {
    const tokenService = TokenService.getInstance();
    if (tokenService.getUser().user_type === 'user') {
      this.props.navigation.navigate('AcompanhamentoPedido');
    } else {
      try {
        pedido.professional_order = tokenService.getUser().id;
        let response = await
          backendRails
            .put('/orders/associate/' + tokenService.getUser().id,
              { order: pedido },
              { headers: tokenService.getHeaders() });

        this.props.navigation.navigate('AcompanhamentoPedido', { data: response.data });
      } catch (error) {
        console.log(error);
      }
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
          <TitutloNovos user={user}></TitutloNovos>
          <FlatList
            data={this.state.pedidos}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) =>
                <TouchableOpacity
                  onPress={() => this.associarPedido(item)}
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
          <NovoPedido botaoStyle={this.meusPedidosStyles.novoPedidoButton}
            onPress={() => {
              this.props.navigation.navigate('Services');
            }} user={user}
          ></NovoPedido>
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

function TitutloNovos(props) {
  user = props.user;
  titulo = user.user_type === 'user' ? 'Pedidos em andamento' : 'Pedidos a serem atendidos';

  return (
    <View style={{
      width: '100%', marginLeft: 10,
      alignContent: 'flex-start', marginBottom: 10
    }}>
      <Text style={{ fontSize: 20 }}>{titulo}</Text>
    </View>
  );
}
