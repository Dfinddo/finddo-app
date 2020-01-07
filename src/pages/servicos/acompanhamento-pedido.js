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
import { StackActions, NavigationActions } from 'react-navigation';

export default class AcompanhamentoPedido extends Component {
  static navigationOptions = {
    title: 'Acompanhe seu pedido'
  };

  constructor(props) {
    super(props);

    /* marcadores */
    this.pedidoEmAnalise = React.createRef();
    this.agendandoVisita = React.createRef();
    this.aCaminho = React.createRef();

    /* descricao */
    this.pedidoEmAnaliseD = React.createRef();
    this.agendandoVisitaD = React.createRef();
    this.aCaminhoD = React.createRef();
  }

  state = {
    estadoAtual: 'analise',
    acaoBotao: 'PRÓXIMO'
  };

  componentDidMount() {
  };

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: '90%' }}>
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
                  ref={this.agendandoVisita}
                  verticalBarVisibility='flex'>
                </StatusPedidoStep>
                <StatusPedidoStep
                  ref={this.aCaminho}
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
                <View style={{ height: 90, width: 3 }} />
                <StatusPedidoDescricao
                  ref={this.agendandoVisitaD}
                  conteudo='Agendando visita'
                  estadoInicial='agendando' />
                <View style={{ height: 80, width: 3 }} />
                <View
                  style={{ height: 120, zIndex: 10 }}>
                  <Accordian
                    conteudo='A caminho'
                    estadoInicial='a-caminho'
                    ref={this.aCaminhoD} />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={this.acompanhamentoStyles.acompanhamentoBotaoContainer}>
          <TouchableOpacity style={this.acompanhamentoStyles.acompanhamentoBotao} onPress={() => this.atualizaStatus()}>
            <Text style={this.acompanhamentoStyles.corBotao}>{this.state.acaoBotao}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  atualizaStatus = () => {
    if (this.state.estadoAtual === 'analise') {
      this.setState({ estadoAtual: 'agendando' });
      this.setStatusAtual('agendando', this.pedidoEmAnalise);
    } else if (this.state.estadoAtual === 'agendando') {
      this.setState({ estadoAtual: 'a-caminho' });
      this.setStatusAtual('a-caminho', this.agendandoVisita);
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
    this.agendandoVisitaD.current.setEstadoAtual(status);
    this.aCaminhoD.current.setEstadoAtual(status);

    statusComponentRef.current.setEtapaAtiva();
    statusComponentRef.current.setStepConcluido();
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
