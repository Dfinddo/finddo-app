import React, { Component } from 'react';
import {
  View, Text,
  ScrollView, ImageBackground,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { colors } from '../../colors';
import StatusPedidoStep from '../../components/status-pedido-step';
import StatusPedidoDescricao from '../../components/status-pedido-descricao';
import Accordian from '../../components/accordion-pedido';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';

export default class AcompanhamentoPedido extends Component {
  static navigationOptions = {
    title: 'Acompanhe seu pedido'
  };

  constructor(props) {
    super(props);

    /* marcadores */
    this.pedidoEmAnalise = React.createRef();
    this.aCaminho = React.createRef();
    this.emServico = React.createRef();

    /* descricao */
    this.pedidoEmAnaliseD = React.createRef();
    this.aCaminhoD = React.createRef();
    this.emServicoD = React.createRef();
  }

  state = {
    estadoAtual: 'analise',
    acaoBotao: 'PRÓXIMO',
    pedido: null
  };

  componentDidMount() {
  };

  obterPedido = () => {
    try {
      if (!this.state.pedido) {
        const { navigation } = this.props;
        const pedido = navigation.getParam('pedido', null);

        this.setState({ pedido, estadoAtual: pedido.order_status }, () => this.atualizaStatus());
      }
    } catch {
      // TODO: implementação de erro
    }
  };

  render() {
    if (this.state.pedido) {
      return (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../../img/Ellipse.png')}>
          <View style={{ height: '90%' }}>
            <NavigationEvents
              onWillFocus={_ => this.obterPedido()}
            //onDidFocus={payload => console.log('did focus', payload)}
            //onWillBlur={payload => console.log('will blur', payload)}
            //onDidBlur={payload => console.log('did blur', payload)}
            />
            <ScrollView style={{
              flex: 1
            }}>
              <View style={this.acompanhamentoStyles.acompanhamentoContainer}>
                <View
                  style={this.acompanhamentoStyles.acompanhamentoPontosContainer}>
                  <StatusPedidoStep
                    ref={this.pedidoEmAnalise}
                    hasMarginTop={true}
                    verticalBarVisibility='flex'>
                  </StatusPedidoStep>
                  <StatusPedidoStep
                    ref={this.aCaminho}
                    verticalBarVisibility='flex'>
                  </StatusPedidoStep>
                  <StatusPedidoStep
                    ref={this.emServico}
                    verticalBarVisibility='none'>
                  </StatusPedidoStep>
                </View>
                <View
                  style={this.acompanhamentoStyles.acompanhamentoConteudoContainer}>
                  <StatusPedidoDescricao
                    ref={this.pedidoEmAnaliseD}
                    hasMarginTop={true}
                    conteudo='Pedido em análise'
                    estadoInicial='analise' />
                  <View style={{ height: 80, width: 3 }} />
                  <View
                    style={{ height: 120, zIndex: 10 }}>
                    <Accordian
                      conteudo='A caminho'
                      estadoInicial='a_caminho'
                      ref={this.aCaminhoD} />
                  </View>
                  <StatusPedidoDescricao
                    ref={this.emServicoD}
                    conteudo='Serviço em Execução'
                    estadoInicial='em_servico' />
                </View>
              </View>
            </ScrollView>
          </View>
          {(() => {
            const tokenService = TokenService.getInstance();
            if (tokenService.getUser().user_type === 'professional') {
              return (
                <View style={this.acompanhamentoStyles.acompanhamentoBotaoContainer}>
                  <TouchableOpacity style={this.acompanhamentoStyles.acompanhamentoBotao} onPress={() => this.atualizarStatus(this.state.pedido)}>
                    <Text style={this.acompanhamentoStyles.corBotao}>{this.state.acaoBotao}</Text>
                  </TouchableOpacity>
                </View>);
            } else {
              return (null);
            }
          })()}
        </ImageBackground>
      );
    }
    else {
      return (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../../img/Ellipse.png')}>
          <View style={{ height: '90%' }}>
            <NavigationEvents
              onWillFocus={_ => this.obterPedido()}
            //onDidFocus={payload => console.log('did focus', payload)}
            //onWillBlur={payload => console.log('will blur', payload)}
            //onDidBlur={payload => console.log('did blur', payload)}
            />
            <View>
              <Text>Não há pedido ativo, selecione um pedido em andamento na aba histórico para acompanhar seu estado</Text>
            </View>
          </View>
        </ImageBackground>
      );
    }
  }

  atualizaStatus = () => {
    if (this.state.estadoAtual === 'analise') {
      this.setState({ estadoAtual: 'analise' }, () => {
        this.setStatusAtual('analise', this.pedidoEmAnalise);
      });
    } else if (this.state.estadoAtual === 'a_caminho') {
      this.setState({ estadoAtual: 'a_caminho' }, () => {
        this.setStatusAtual('a_caminho', this.pedidoEmAnalise);
        this.setStatusAtual('a_caminho', this.aCaminho)
      });
    } else if (this.state.estadoAtual === 'em_servico') {
      this.setState({ estadoAtual: 'em_servico' }, () => {
        this.setStatusAtual('em_servico', this.pedidoEmAnalise);
        this.setStatusAtual('em_servico', this.aCaminho)
        this.setStatusAtual('em_servico', this.emServico)
      });
    } else {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Acompanhamento' })],
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  setStatusAtual = (status, statusComponentRef) => {
    this.pedidoEmAnaliseD.current.setEstadoAtual(status);
    this.aCaminhoD.current.setEstadoAtual(status);
    this.emServicoD.current.setEstadoAtual(status);

    statusComponentRef.current.setEtapaAtiva();
    statusComponentRef.current.setStepConcluido();
  }

  atualizarStatus = async (pedido) => {
    let novoStatus = '';

    switch (pedido.order_status) {
      case 'analise':
        novoStatus = 'a_caminho';
        break;
      case 'a_caminho':
        novoStatus = 'em_servico';
        break;
      case 'em_servico':
        novoStatus = 'finalizado';
        break;
      default:
        break;
    }

    try {
      const tokenService = TokenService.getInstance();
      let response = {};

      const novoPedido = this.state.pedido;
      novoPedido.order_status = novoStatus;

      response = await
        backendRails
          .put('/orders/' + novoPedido.id, { order: novoPedido },
            { headers: tokenService.getHeaders() });

      this.setState({ pedido: response.data, estadoAtual: response.data.order_status }, () => { this.atualizaStatus() });
    }
    catch (error) {
      console.log(error);
    }
  }

  acompanhamentoStyles = StyleSheet.create({
    acompanhamentoContainer: {
      flex: 1, alignItems: 'center',
      justifyContent: 'center', flexDirection: 'row',
      height: 500
    },
    acompanhamentoPontosContainer: {
      height: 500, width: '15%',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    acompanhamentoConteudoContainer: {
      height: 500, width: '85%'
    },
    acompanhamentoBotaoContainer: {
      flex: 1, alignItems: 'center',
      justifyContent: 'flex-end'
    },
    acompanhamentoBotao: {
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      marginBottom: 6
    },
    corBotao: {
      textAlignVertical: 'center', height: 45,
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    }
  });
}
