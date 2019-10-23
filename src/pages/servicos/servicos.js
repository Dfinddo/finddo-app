import React, { Component } from 'react';
import { Image, ImageBackground, Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';

export default class Servicos extends Component {
  static navigationOptions = {
    title: 'Onde quer atendimento?'
  };

  state = {
    docs: [
      { id: '1', name: 'Hidráulica', image_url: require('../../img/jacek-dylag-unsplash.png') },
      { id: '2', name: 'Elétrica', image_url: require('../../img/eletrica.jpg') },
      { id: '3', name: 'Pintura', image_url: require('../../img/pintura.jpg') },
      { id: '4', name: 'Ar condicionado', image_url: require('../../img/ar-condicionado.jpg') },
      { id: '5', name: 'Instalações', image_url: require('../../img/instalacao.jpg') },
      { id: '6', name: 'Pequenas reformas', image_url: require('../../img/peq-reforma.jpg') },
      { id: '7', name: 'Consertos em geral', image_url: require('../../img/consertos.jpg') },
      { id: '8', name: null }
    ],
    page: 1,
  };

  componentDidMount() {
    // this.obterSubcategorias();
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
    if (item.name === null) {
      return (<View style={{ height: 20 }}></View>);
    }
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('NovoPedido', { item })}>
          <Image
            style={{
              marginTop: 4, borderRadius: 16,
              width: 320, height: 180
            }}
            source={item.image_url} />
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
