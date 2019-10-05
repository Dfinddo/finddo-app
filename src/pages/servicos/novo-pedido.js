import React, { Component } from 'react';
import { Button, TextInput, View, Picker, StyleSheet } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';

export default class NovoPedido extends Component {
  static navigationOptions = {
    title: 'Novo Pedido'
  };

  state = {
    necessidade: '',
    docs: [],
    page: 1,
    categoriaPedido: null
  };

  componentDidMount() {
    this.obterCategorias();
  };

  obterCategorias = async (page = 1) => {
    const { navigation } = this.props;
    const categoriaPedido = navigation.getParam('item', 'no item');
    this.setState({ categoriaPedido });
    console.log(categoriaPedido);
  };


  render() {
    return (
      <View>
        <TextInput
          style={loginStyle.loginFormSizeAndFont}
          placeholder="Nos conte o que precisa"
          onChangeText={(necessidade) => this.setState({ necessidade: necessidade })}
          value={this.state.necessidade}
        />
        <Button
          title="Próximo"
          onPress={() => {
            this.props.navigation.navigate('FotosPedido', { necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido });
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