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
import StatusPedidoStep from '../../components/status-pedido-step';
import StatusPedidoDescricao from '../../components/status-pedido-descricao';

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
    this.emServico = React.createRef();
    this.finalizado = React.createRef();

    /* descricao */
    this.pedidoEmAnaliseD = React.createRef();
    this.agendandoVisitaD = React.createRef();
    this.aCaminhoD = React.createRef();
    this.emServicoD = React.createRef();
    this.finalizadoD = React.createRef();
  }

  state = {
    necessidade: '',
    categoriaPedido: null,
    isLoading: false,
    estadoAtual: 'analise',
    accordianClosed: true
  };

  componentDidMount() {

  };

  salvarPedido = async (orderData) => {
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: '90%' }}>
          <ScrollView style={{
            flex: 1
          }}>
            <View style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center', flexDirection: 'row',
              height: 1000, backgroundColor: 'purple'
            }}>
              <View
                style={{
                  height: 1000, width: '20%',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
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
                  verticalBarVisibility='flex'>
                </StatusPedidoStep>
                <StatusPedidoStep
                  ref={this.emServico}
                  verticalBarVisibility='flex'>
                </StatusPedidoStep>
                <StatusPedidoStep
                  ref={this.finalizado}
                  verticalBarVisibility='none'>
                </StatusPedidoStep>
              </View>
              <View
                style={{
                  height: 1000,
                  backgroundColor: 'blue', width: '80%'
                }}>
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
                <View style={{ height: 90, width: 3 }} />
                <View
                  style={{
                    height: 20, backgroundColor: 'green',
                    marginLeft: 8
                  }}>
                  <Text
                    style={{
                      fontSize: this.state.estadoAtual === 'a-caminho' ? 20 : 18,
                      color: this.state.estadoAtual === 'a-caminho' ? 'black' : 'gray',
                    }}>A caminho</Text>
                </View>
                <View style={{ height: 90, width: 3 }} />
                <StatusPedidoDescricao
                  ref={this.emServicoD}
                  conteudo='Em serviço'
                  estadoInicial='em-servico' />
                <View style={{ height: 90, width: 3 }} />
                <StatusPedidoDescricao
                  ref={this.finalizadoD}
                  conteudo='Finalizado'
                  estadoInicial='finalizado' />
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{
          flex: 1, alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <TouchableOpacity style={{
            width: 340, height: 45,
            borderRadius: 20, backgroundColor: colors.verdeFinddo,
            marginBottom: 6
          }} onPress={() => {
            if (this.state.estadoAtual === 'analise') {
              this.setState({ estadoAtual: 'agendando' });
              this.setStatusAtual('agendando', this.pedidoEmAnalise);
            } else if (this.state.estadoAtual === 'agendando') {
              this.setState({ estadoAtual: 'a-caminho' });
              this.setStatusAtual('a-caminho', this.agendandoVisita);
            } else if (this.state.estadoAtual === 'a-caminho') {
              this.setState({ estadoAtual: 'em-servico' });
              this.setStatusAtual('em-servico', this.aCaminho);
            } else if (this.state.estadoAtual === 'em-servico') {
              this.setState({ estadoAtual: 'finalizado' });
              this.setStatusAtual('finalizado', this.emServico);
              this.setStatusAtual('finalizado', this.finalizado);
            }
          }}>
            <Text style={{
              textAlignVertical: 'center', height: 45,
              fontSize: 18, color: colors.branco,
              textAlign: 'center'
            }}>CANCELAR SERVIÇO</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  setStatusAtual = (status, statusComponentRef) => {
    this.pedidoEmAnaliseD.current.setEstadoAtual(status);
    this.agendandoVisitaD.current.setEstadoAtual(status);
    this.emServicoD.current.setEstadoAtual(status);
    this.finalizadoD.current.setEstadoAtual(status);

    statusComponentRef.current.setEtapaAtiva();
    statusComponentRef.current.setStepConcluido();
  }
}
