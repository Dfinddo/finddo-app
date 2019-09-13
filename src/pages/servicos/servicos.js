import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import backendRails from '../../services/backend-rails-api';

export default class Servicos extends Component {
  static navigationOptions = {
    title: 'Serviços'
  };

  state = {
    productInfo: {},
    docs: [],
    page: 1,
  };

  componentDidMount() {
    this.obterSubcategorias();
  };

  obterSubcategorias = async (page = 1) => {
    try {
      const response = await backendRails.get('/subcategories');

      const subcategories = response.data;
      subcategories.forEach(element => {
        element.id = element.id+'';
      });

      this.setState({
        docs: [...this.state.docs, ...subcategories],
      });

      console.log(this.state);
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
          renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
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
