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
import { ListaDeEnderecos } from '../../pages/perfil/enderecos';

const fotoDefault = require('../../img/add_foto_problema.png');

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
    foto1: fotoDefault,
    foto1Setada: false,
    foto2: fotoDefault,
    foto2Setada: false,
    foto3: fotoDefault,
    foto3Setada: false,
    foto4: fotoDefault,
    foto4Setada: false,
    fotosPedido: [],
    isSelectEndereco: false,
    enderecos: [],
    enderecoSelecionado: null
  };

  componentDidMount() {
    this.obterDadosPrimeiraPartePedido();
  };

  obterFoto = () => {
    const fotoService = FotoService.getInstance();
    const photo = fotoService.getFotoData();
    const numeroFoto = fotoService.getFotoId();

    const images = this.state.fotosPedido;

    if (photo) {
      switch (numeroFoto) {
        case 1:
          images.push({ image: photo, file_name: 'foto1' });
          this.setState({ foto1: photo, foto1Setada: true, isLoading: false, fotosPedido: [...images] });
          break;
        case 2:
          images.push({ image: photo, file_name: 'foto2' });
          this.setState({ foto2: photo, foto2Setada: true, isLoading: false, fotosPedido: [...images] });
          break;
        case 3:
          images.push({ image: photo, file_name: 'foto3' });
          this.setState({ foto3: photo, foto3Setada: true, isLoading: false, fotosPedido: [...images] });
          break;
        case 4:
          images.push({ image: photo, file_name: 'foto4' });
          this.setState({ foto4: photo, foto4Setada: true, isLoading: false, fotosPedido: [...images] });
          break;
        default:
          this.setState({ isLoading: false });
          break;
      }
    } else {
      this.setState({ isLoading: false });
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

  selecionarEndereco = () => {
    this.setState({ isLoading: true }, () => {
      const tokenService = TokenService.getInstance();

      backendRails.get('/addresses/user/' + tokenService.getUser().id, { headers: tokenService.getHeaders() })
        .then((data) => {
          const addresses = data.data;
          addresses.forEach(element => {
            element.id = '' + element.id;
          });

          this.setState({ enderecos: [...addresses] });
        }).finally(_ => {
          this.setState({ isLoading: false, isSelectEndereco: true });
        });
    });
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
    order.address_id = this.state.enderecoSelecionado.id;
    if (this.state.urgencia === 'definir-data') {
      order.start_order = `${this.state.dataPedido.toDateString()} ${this.state.hora}`;
      order.end_order = `${this.state.dataPedido.toDateString()} ${this.state.horaFim}`;
      order.urgency = 'urgent';
    }

    const images = this.state.fotosPedido.map((foto) => { return { base64: foto.image.base64, file_name: foto.file_name } });

    backendRails.post('/orders', { order, images }, { headers: TokenService.getInstance().getHeaders() })
      .then((response) => {
        FotoService.getInstance().setFotoId(0);
        FotoService.getInstance().setFotoData(null);
        this.setState({ isLoading: false });
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Services' })],
          key: 'Finddo'
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('AcompanhamentoPedido', { pedido: response.data });
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

  selecionarItem = (item) => {
    this.setState({ isSelectEndereco: false, enderecoSelecionado: item.item }, () => {
      this.confirmarPedido();
    });
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
              visible={this.state.isSelectEndereco}>
              <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1, backgroundColor: colors.branco
              }}>
                <Text style={{
                  fontSize: 24, fontWeight: 'bold',
                  marginVertical: 18, paddingHorizontal: 20
                }}>Escolha o endereço onde o serviço será realizado:</Text>
                <ListaDeEnderecos
                  readOnly={true}
                  navigation={this.props.navigation}
                  enderecos={this.state.enderecos}
                  selecionarItem={this.selecionarItem}
                  comp={this}></ListaDeEnderecos>
                <TouchableOpacity
                  style={this.fotosPedidoStyles.botaoContinuar}
                  onPress={() => this.setState({ isSelectEndereco: false })}>
                  <Text style={this.fotosPedidoStyles.botaoContinuarTexto}>VOLTAR</Text>
                </TouchableOpacity>
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
                onWillFocus={_ => {
                  this.setState({ isLoading: true }, () => {
                    setTimeout(() => { this.obterFoto() }, 1000);
                  })
                  // this.setState({ isLoading: true }, () => { this.obterFoto1() });
                }}
              //onDidFocus={_ => this.obterFoto1()}
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
                    FotoService.getInstance().setFotoId(1);
                    this.props.navigation.navigate('CameraPedido');
                  }} style={{ alignItems: 'center', marginTop: 30 }}>
                    <Image
                      style={{ width: 120, height: 120 }}
                      source={this.state.foto1} />
                  </TouchableOpacity>
                  <View style={this.fotosPedidoStyles.fotosProblemaContainer}>
                    <TouchableOpacity onPress={() => {
                      FotoService.getInstance().setFotoId(2);
                      this.props.navigation.navigate('CameraPedido');
                    }}>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={this.state.foto2} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      FotoService.getInstance().setFotoId(3);
                      this.props.navigation.navigate('CameraPedido');
                    }}>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={this.state.foto3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      FotoService.getInstance().setFotoId(4);
                      this.props.navigation.navigate('CameraPedido');
                    }}>
                      <Image
                        style={{ width: 80, height: 80 }}
                        source={this.state.foto4} />
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
            onPress={() => /*this.confirmarPedido()*/ this.selecionarEndereco()}>
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
