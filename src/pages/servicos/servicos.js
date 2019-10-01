import React, { Component } from 'react';
import { Image, ImageBackground, Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';

export default class Servicos extends Component {
  static navigationOptions = {
    title: 'Onde quer atendimento?'
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
      const response = await backendRails.get('/categories', { headers: TokenService.getInstance().getHeaders() });

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

  exibirItem = (item) => {
    return (
      <View>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.name}</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('NovoPedido', { item })}>
          <Image
            style={{marginTop: 4, borderRadius: 16}} 
            source={require('../../img/jacek-dylag-unsplash.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
        style={this.servicosStyles.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={this.servicosStyles.container}>
          <FlatList
            data={this.state.docs}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) => this.exibirItem(item)}
          />
        </View>
      </ImageBackground>
    );
  }

  servicosStyles = StyleSheet.create({
    container: {
      marginTop: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    backgroundImageContent: {
      width: '100%', height: '100%'
    }
  });
}
