import React, { Component } from 'react';
import { Modal, Image, ImageBackground, Text, FlatList, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import moipAPI, { headers } from '../../services/moip-api';
import { colors } from '../../colors';
import TokenService from '../../services/token-service';

export default class Servicos extends Component {
  static navigationOptions = {
    title: 'Onde quer atendimento?'
  };

  state = {
    docs: [
      { id: '1', name: 'Hidráulica', image_url: require('../../img/jacek-dylag-unsplash.png') },
      { id: '2', name: 'Elétrica', image_url: require('../../img/eletrica.png') },
      { id: '3', name: 'Pintura', image_url: require('../../img/pintura.png') },
      { id: '4', name: 'Ar condicionado', image_url: require('../../img/ar-condicionado.png') },
      { id: '5', name: 'Instalações', image_url: require('../../img/instalacao.png') },
      { id: '6', name: 'Pequenas reformas', image_url: require('../../img/peq-reforma.png') },
      { id: '7', name: 'Consertos em geral', image_url: require('../../img/consertos.png') },
      { id: '8', name: null }
    ],
    page: 1,
    isLoading: false
  };

  creditCardFilter = (data) => {
    return data.method === "CREDIT_CARD";
  };

  exibirAlertSemCartoes = () => {
    Alert.alert(
      'Forma de pagamento ainda não cadastrada',
      'Para adicionar uma forma de pagamento vá para a aba Perfil',
      [{ text: 'OK', onPress: () => { } }]
    );
  };

  verificarCartoes = (item) => {
    this.setState({ isLoading: true }, () => {
      const tokenService = TokenService.getInstance();

      moipAPI.get('/customers/' + tokenService.getUser().customer_wirecard_id, { headers: headers })
        .then((data) => {
          const clientData = data.data;
          if (clientData.fundingInstruments) {
            const cardData = clientData.fundingInstruments.filter(data => this.creditCardFilter(data));

            if (cardData.length > 0) {
              this.props.navigation.navigate('NovoPedido', { item })
            } else {
              this.exibirAlertSemCartoes();
            }
          } else {
            this.exibirAlertSemCartoes();
          }
        })
        .catch(error => {
          console.log(error);
          this.exibirAlertSemCartoes();
        })
        .finally(_ => {
          this.setState({ isLoading: false });
        });
    })
  };

  exibirItem = (item) => {
    if (item.name === null) {
      return (<View style={{ height: 20 }}></View>);
    }
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => this.verificarCartoes(item)}>
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.servicosStyles.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
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
    },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}
