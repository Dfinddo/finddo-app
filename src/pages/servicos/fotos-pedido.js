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
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { colors } from '../../colors';
import VisualizarPedido from '../../components/modal-visualizar-pedido';
import FotoService from '../../services/foto-service';

export default class FotosPedido extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.categoriaPedido.name}`,
  });

  state = {
    necessidade: '',
    imageServicoUrl: require('../../img/jacek-dylag-unsplash.png'),
    categoriaPedido: null,
    isLoading: false,
    dataPedido: null,
    hora: null,
    horaFim: null,
    urgencia: '',
    isConfirming: false,
    foto1: require('../../img/add_foto_problema.png'),
    foto1Setada: false
  };

  componentDidMount() {
    this.obterDadosPrimeiraPartePedido();
  };

  obterFoto1 = () => {
    const fotoService = FotoService.getInstance();
    const photo = fotoService.getFotoData();

    if (photo) {
      this.setState({ foto1: photo });
    }
  }

  obterDadosPrimeiraPartePedido = () => {
    const { navigation } = this.props;
    const necessidade = navigation.getParam('necessidade', 'no necessidade');
    const categoriaPedido = navigation.getParam('categoriaPedido', 'no categoria');
    const dataPedido = navigation.getParam('dataPedido', 'sem_data');
    const hora = navigation.getParam('hora', 'sem_hora');
    const horaFim = navigation.getParam('horaFim', 'sem_hora_fim');
    const urgencia = navigation.getParam('urgencia', 'sem_urgencia');

    if (dataPedido !== 'sem_data') {
      this.setState({ dataPedido, hora, horaFim });
    }

    if (urgencia !== 'sem_urgencia') {
      this.setState({ urgencia });
    }

    this.setState({ necessidade, categoriaPedido });
    this.setState({ imageServicoUrl: categoriaPedido.image_url });
  };

  confirmarPedido = () => {
    this.setState({ isConfirming: true });
  };

  fecharDialogConfirmacaoSemConfirmarPedido = () => {
    this.setState({ isConfirming: false });
  };

  salvarAposPedidoConfirmado = () => {
    this.setState({ isConfirming: false });
    this.salvarPedido(this.state);
  };

  salvarPedido = async (orderData) => {
    this.setState({ isLoading: true });

    const order = {};
    order.description = orderData.necessidade;
    order.category_id = +orderData.categoriaPedido.id;
    order.user_id = TokenService.getInstance().getUser().id;
    if (this.state.urgencia === 'definir-data') {
      order.start_order = `${this.state.dataPedido.toDateString()} ${this.state.hora}`;
      order.end_order = `${this.state.dataPedido.toDateString()} ${this.state.horaFim}`;
      order.urgency = 'urgent';
    }

    const images = [];
    const image = {};
    image.base64 = this.state.foto1.base64;
    image.file_name = 'foto1';

    images.push(image);

    this.setState({ isLoading: false });

    console.log(JSON.stringify({ order, images }));

    // backendRails.post('/orders', { order, images }, { headers: TokenService.getInstance().getHeaders() })
    //   .then((response) => {
    //     this.setState({ isLoading: false });
    //     const resetAction = StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: 'Services' })],
    //       key: 'Finddo'
    //     });
    //     this.props.navigation.dispatch(resetAction);
    //     this.props.navigation.navigate('AcompanhamentoPedido', { pedido: response.data });
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       /*
    //        * The request was made and the server responded with a
    //        * status code that falls out of the range of 2xx
    //        */
    //       Alert.alert(
    //         'Falha ao realizar operação',
    //         'Revise seus dados e tente novamente',
    //         [
    //           { text: 'OK', onPress: () => { } },
    //         ],
    //         { cancelable: false },
    //       );
    //     } else if (error.request) {
    //       /*
    //        * The request was made but no response was received, `error.request`
    //        * is an instance of XMLHttpRequest in the browser and an instance
    //        * of http.ClientRequest in Node.js
    //        */
    //       Alert.alert(
    //         'Falha ao se conectar',
    //         'Verifique sua conexão e tente novamente',
    //         [
    //           { text: 'OK', onPress: () => { } },
    //         ],
    //         { cancelable: false },
    //       );
    //     } else {
    //       /* Something happened in setting up the request and triggered an Error */
    //     }
    //     this.setState({ isLoading: false });
    //   });
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ flex: 1 }}>
          <ScrollView>
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
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isConfirming}>
              <VisualizarPedido
                pedido={this.state}
                onConfirm={() => this.salvarAposPedidoConfirmado()}
                onCancel={() => this.fecharDialogConfirmacaoSemConfirmarPedido()}></VisualizarPedido>
            </Modal>
            <View style={this.fotosPedidoStyles.imagemCategoriaContainer}>
              <NavigationEvents
                //onWillFocus={}
                onDidFocus={_ => this.obterFoto1()}
              //onWillBlur={payload => console.log('will blur', payload)}
              //onDidBlur={payload => console.log('did blur', payload)}
              />
              <Image source={this.state.imageServicoUrl}
                style={{ width: '100%' }} />
              <View style={this.fotosPedidoStyles.formPedidoContainer}>
                <View style={this.fotosPedidoStyles.maisFotosContainer}>
                  <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>
                    Nos ajude com fotos do problema (opcional)
                  </Text>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('CameraPedido');
                  }} style={{ alignItems: 'center', marginTop: 30 }}>
                    <Image
                      style={{ width: 120, height: 120 }}
                      source={this.state.foto1} />
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
            onPress={() => this.confirmarPedido()}>
            <Text style={this.fotosPedidoStyles.botaoContinuarTexto}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  fotosPedidoStyles = StyleSheet.create({
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)'
    },
    imagemCategoriaContainer: {
      height: 540,
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    formPedidoContainer: {
      height: 300, paddingHorizontal: 20,
      alignItems: 'center',
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
      alignItems: 'center',
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
