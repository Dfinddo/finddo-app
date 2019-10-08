import React, { Component } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import { StackActions, NavigationActions } from 'react-navigation';

export default class FotosPedido extends Component {
  static navigationOptions = {
    title: 'Novo Pedido'
  };

  state = {
    necessidade: '',
    categoriaPedido: null
  };

  componentDidMount() {
    this.obterCategorias();
  };

  obterCategorias = async (page = 1) => {
    const { navigation } = this.props;
    const necessidade = navigation.getParam('necessidade', 'no necessidade');
    const categoriaPedido = navigation.getParam('categoriaPedido', 'no categoria');

    this.setState({ necessidade, categoriaPedido });
  };

  salvarPedido = async (orderData) => {
    const order = {};
    order.description = orderData.necessidade;
    order.category_id = +orderData.categoriaPedido.id;
    order.user_id = TokenService.getInstance().getUser().id;

    const response = await backendRails.post('/orders', { order }, { headers: TokenService.getInstance().getHeaders() });

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MeusPedidos' }, { id: response.data.id })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View>
        <Text>Nos ajude com fotos do problema (opcional)</Text>
        <Button
          title="Adicionar Fotos"
          onPress={() => {
            console.log(this.state);
          }}
        />
        <Button
          title="Confirmar"
          onPress={() => {
            this.salvarPedido(this.state);
          }}
        />
      </View>
    );
  }
}

const loginStyle = StyleSheet.create({
  loginForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loginFormSizeAndFont: { fontSize: 25, height: 45 },
  fontTitle: {
    fontSize: 30
  }
});