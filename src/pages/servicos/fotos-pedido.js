import React, { Component } from 'react';
import {
  Modal, View,
  Text, StyleSheet,
  ScrollView, ImageBackground,
  TouchableOpacity, Image,
  ActivityIndicator, Alert
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import { StackActions, NavigationActions } from 'react-navigation';
import { colors } from '../../colors';

export default class FotosPedido extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.categoriaPedido.name}`,
  });

  state = {
    necessidade: '',
    imageServicoUrl: require('../../img/jacek-dylag-unsplash.png'),
    categoriaPedido: null,
    isLoading: false,
    dataPedido: null
  };

  componentDidMount() {
    this.obterDadosPrimeiraPartePedido();
  };

  obterDadosPrimeiraPartePedido = () => {
    const { navigation } = this.props;
    const necessidade = navigation.getParam('necessidade', 'no necessidade');
    const categoriaPedido = navigation.getParam('categoriaPedido', 'no categoria');
    const dataPedido = navigation.getParam('dataPedido', 'sem_data');

    if (dataPedido !== 'sem_data') {
      this.setState({ dataPedido });
    }

    this.setState({ necessidade, categoriaPedido });
    this.setState({ imageServicoUrl: categoriaPedido.image_url });
  };

  salvarPedido = async (orderData) => {
    this.setState({ isLoading: true });

    const order = {};
    order.description = orderData.necessidade;
    order.category_id = +orderData.categoriaPedido.id;
    order.user_id = TokenService.getInstance().getUser().id;
    if (this.state.dataPedido) {
      console.log(this.state.dataPedido.toDateString());

      order.start_order = `${this.state.dataPedido.toDateString()} ${this.state.dataPedido.getHours()}:${this.state.dataPedido.getMinutes()}:${this.state.dataPedido.getSeconds()}`;
    }

    backendRails.post('/orders', { order }, { headers: TokenService.getInstance().getHeaders() })
      .then((response) => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Services' })],
          key: 'Finddo'
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('AcompanhamentoPedido', { id: response.data.id });
      })
      .catch((error) => {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          Alert.alert(
            'Falha ao realizar operação',
            'Revise seus dados e tente novamente',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          Alert.alert(
            'Falha ao se conectar',
            'Verifique sua conexão e tente novamente',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        } else {
          /* Something happened in setting up the request and triggered an Error */
        }
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: '90%' }}>
          <ScrollView style={{ flex: 1 }}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isLoading}
            >
              <View style={this.fotosPedidoStyles.loaderContainer}>
                <View>
                  <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
                </View>
              </View>
            </Modal>
            <View style={this.fotosPedidoStyles.imagemCategoriaContainer}>
              <Image source={this.state.imageServicoUrl}
                style={{ width: '100%' }} />
              <View style={this.fotosPedidoStyles.formPedidoContainer}>
                <View style={this.fotosPedidoStyles.maisFotosContainer}>
                  <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>
                    Nos ajude com fotos do problema (opcional)
                  </Text>
                  <TouchableOpacity style={{ alignItems: 'center', marginTop: 30 }}>
                    <Image
                      style={{ width: 120, height: 120 }}
                      source={require('../../img/add_foto_problema.png')} />
                  </TouchableOpacity>
                  <View style={this.fotosPedidoStyles.fotosProblemaContainer}>
                    <TouchableOpacity>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../../img/add_foto_problema.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../../img/add_foto_problema.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../../img/add_foto_problema.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={this.fotosPedidoStyles.botaoContainer}>
          <TouchableOpacity
            style={this.fotosPedidoStyles.botaoContinuar}
            onPress={() => this.salvarPedido(this.state)}>
            <Text style={this.fotosPedidoStyles.botaoContinuarTexto}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  fotosPedidoStyles = StyleSheet.create({
    loaderContainer: {
      flex: 1, alignItems: 'center',
      justifyContent: 'center'
    },
    imagemCategoriaContainer: {
      height: 508,
      flex: 1, alignItems: 'center',
      justifyContent: 'flex-start'
    },
    formPedidoContainer: {
      height: 300, paddingHorizontal: 20,
      flex: 1, alignItems: 'center',
      width: '100%', justifyContent: 'flex-start'
    },
    maisFotosContainer: {
      marginTop: 8, height: 300,
      backgroundColor: colors.branco,
      width: '100%'
    },
    fotosProblemaContainer: {
      flexDirection: 'row', justifyContent: 'space-evenly',
      alignItems: 'center', marginTop: 30
    },
    botaoContainer: {
      flex: 1, alignItems: 'center',
      justifyContent: 'flex-end'
    },
    botaoContinuar: {
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      marginBottom: 6
    },
    botaoContinuarTexto: {
      textAlignVertical: 'center', height: 45,
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    }
  });
}
