import React, { Component } from 'react';
import {
  Button, Text,
  FlatList, StyleSheet,
  TouchableOpacity, View,
  ImageBackground
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  componentDidMount() {
    this.obterPedidos();
  };

  obterPedidos = async (page = 1) => {
    try {
      const tokenService = TokenService.getInstance();
      const response = await
        backendRails
          .get('/orders/user/' + tokenService.getUser().id + '/active',
            { headers: tokenService.getHeaders() });

      const orders = response.data;

      orders.forEach(element => {
        element.id = element.id + '';
      });

      this.setState({
        pedidos: [...this.state.pedidos, ...orders],
      });
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={styles.container}>
          <View style={{
            width: '100%', marginLeft: 10,
            alignContent: 'flex-start', marginBottom: 10
          }}>
            <Text style={{ fontSize: 20 }}>Pedidos em andamento:</Text>
          </View>
          <FlatList
            data={this.state.pedidos}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) =>
                <TouchableOpacity
                  onPress={() => { this.props.navigation.navigate('AcompanhamentoPedido'); }}
                  style={[styles.item, {
                    borderRadius: 12, backgroundColor: 'white',
                    marginBottom: 10, width: 340,
                    alignItems: 'center', justifyContent: 'flex-start',
                    flexDirection: 'row'
                  }]}>
                  <View style={{ width: 260 }}>
                    <Text style={{ fontSize: 20, marginBottom: 5 }}>{item.category.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{
                        width: 20, height: 20,
                        borderRadius: 40, borderColor: 'black',
                        backgroundColor: 'green', borderWidth: 1
                      }}></View>
                      <Text style={{ fontSize: 18, color: 'gray' }}>    {enumEstadoPedidoMap[item.order_status]}</Text>
                    </View>
                  </View>
                  <View style={{
                    width: 40, height: 40,
                    flex: 1, alignItems: 'flex-end',
                    justifyContent: 'center'
                  }}>
                    <Icon
                      style={{ width: 40 }}
                      name={'keyboard-arrow-right'}
                      size={20} color='gray' />
                  </View>
                </TouchableOpacity>}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'green', height: 45,
              width: 340, borderRadius: 20,
              color: 'white',
              alignItems: 'center', justifyContent: 'center'
            }}
            onPress={() => {
              this.props.navigation.navigate('Services');
            }}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>NOVO PEDIDO</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
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
});
