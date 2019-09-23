import React, { Component } from 'react';
import { TextInput, View, Picker, StyleSheet } from 'react-native';
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
    selectedValue: ''
  };

  componentDidMount() {
    this.obterCategorias();
  };

  obterCategorias = async (page = 1) => {
    try {
      const tokenService = TokenService.getInstance();
      const response = await backendRails.get('/categories', { headers: tokenService.getHeaders() });

      const categories = response.data;
      categories.forEach(element => {
        element.id = element.id + '';
      });

      this.setState({
        docs: [...this.state.docs, ...categories],
      });

      this.setState({
        selectedValue: this.state.docs[0]
      });
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    let serviceItems = this.state.docs.map((s, i) => {
      return <Picker.Item key={s.id} value={s.name} label={s.name} />
    });

    return (
      <View>
        <TextInput
          style={loginStyle.loginFormSizeAndFont}
          placeholder="Nos conte o que precisa"
          onChangeText={(necessidade) => this.setState({ necessidade: necessidade })}
          value={this.state.necessidade}
        />
        <Picker
          selectedValue={this.state.selectedValue}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({
              selectedValue: itemValue
            });
          }}>

          {serviceItems}

        </Picker>
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