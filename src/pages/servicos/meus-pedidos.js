import React, { Component } from 'react';
import { Button, Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';

export default class MeusPedidos extends Component {
  static navigationOptions = {
    title: 'Meus Pedidos'
  };

  state = {
    docs: [],
    page: 1,
  };

  componentDidMount() {
    this.obterSubcategorias();
  };

  obterSubcategorias = async (page = 1) => {
    try {
      const response = await backendRails.get('/orders', { headers: TokenService.getInstance().getHeaders() });

      const categories = response.data;
      categories.forEach(element => {
        element.id = element.id + '';
      });

      this.setState({
        docs: [...this.state.docs, ...categories],
      });
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.docs}
          keyExtractor={item => item.id}
          renderItem={
            ({ item }) =>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.item}>
                <Text>{item.description}</Text>
              </TouchableOpacity>}
        />
        <Button
          title="Novo Pedido"
          onPress={() => {
            this.props.navigation.navigate('Services');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
