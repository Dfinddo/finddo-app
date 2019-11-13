import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { colors } from '../colors';

export default class StatusPedidoDescricao extends Component {
  state = {
    estadoAtual: 'analise',
    estadoComponente: 'analise'
  };

  componentDidMount() {
    this.setState({ estadoComponente: this.props.estadoInicial });
  }

  setEstadoAtual = (estado) => {
    this.setState({ estadoAtual: estado });
  }

  render() {
    return (
      <View>
        <View
          style={{
            marginTop: this.props.hasMarginTop ? 20 : 0, height: 20,
            marginLeft: 8
          }}>
          <Text
            style={{
              fontSize: this.state.estadoAtual === this.state.estadoComponente ? 20 : 18,
              color: this.state.estadoAtual === this.state.estadoComponente ? colors.preto : colors.cinza,
            }}>{this.props.conteudo}</Text>
        </View>
      </View>
    );
  }
}
