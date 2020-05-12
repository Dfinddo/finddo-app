import React, { Component } from 'react';
import VisualizarPedido from '../../components/modal-visualizar-pedido';
import PedidoCorrenteService from '../../services/pedido-corrente-service';
import { ImageBackground, View, Alert } from 'react-native';
import TokenService from '../../services/token-service';
import { StackActions } from 'react-navigation';

const fotoDefault = require('../../img/add_foto_problema.png');

export class ConfirmarPedido extends Component {
  static navigationOptions = {
    title: `Confirme seu pedido`,
    headerBackTitle: 'Voltar'
  }

  constructor(props) {
    super(props);

    this.state = {
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
      enderecoSelecionado: null,
      temPedido: false
    };
  }

  componentDidMount() {
    const pedidoService = PedidoCorrenteService.getInstance();
    const pedidoCorrente = pedidoService.getPedidoCorrente();
    console.log(pedidoService.getPedidoCorrente());

    this.setState({
      necessidade: pedidoCorrente.necessidade,
      categoriaPedido: { name: 'Teste' },
      urgencia: pedidoCorrente.urgencia,
      dataPedido: pedidoCorrente.dataPedido,
      hora: pedidoCorrente.hora,
      horaFim: pedidoCorrente.horaFim,
      enderecoSelecionado: pedidoCorrente.address,
      fotosPedido: [],
      temPedido: true
    });
  }

  salvarPedidoLocalStorage = () => {
    const tokenService = TokenService.getInstance();

    if (!tokenService.getUser()) {
      Alert.alert(
        'Acesse sua conta',
        'Para poder continuar com seu pedido, '
        + 'você precisa estar logado no Finddo',
        [
          {
            text: 'Cancelar', onPress: () => { }
          },
          {
            text: 'Login', onPress: () => {
              this.setState({ isLoading: true }, () => {
                const pedidoService = PedidoCorrenteService.getInstance();
                pedidoService.salvarPedidoLocalStorage(pedidoService.getPedidoCorrente())
                  .then(_ => {
                    this.setState({ isLoading: false });
                    this.props.navigation.navigate('Auth');
                  });
              });
            }
          },
        ]);
    }
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{
          flex: 1,
          paddingTop: 10,
          alignItems: 'center'
        }}>
          {(() => {
            if (this.state.temPedido) {
              return (<VisualizarPedido
                pedido={this.state}
                onConfirm={() => { this.salvarPedidoLocalStorage() }}
                onCancel={() => {
                  const resetAction = StackActions.pop();
                  this.props.navigation.dispatch(resetAction);
                }} />);
            } else {
              return (null);
            }
          })()}
        </View>
      </ImageBackground>
    );
  }
}
