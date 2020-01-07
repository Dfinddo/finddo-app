import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../colors';
import TokenService from '../services/token-service';

export default class VisualizarPedido extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    order: null
  };

  componentDidMount() {
    const order = {};
    order.description = this.props.pedido.necessidade;
    order.category = this.props.pedido.categoriaPedido.name;
    order.urgencia = this.props.pedido.urgencia;
    order.user_id = TokenService.getInstance().getUser().id;
    if (this.props.pedido.dataPedido) {
      order.start_order = this.props.pedido.dataPedido;
    }
    this.setState({ order });
  }

  render() {
    let diaInicio = '';
    let diaFim = '';

    if (this.state.order) {

      if (this.state.order.start_order && this.state.order.urgencia === 'semana') {
        diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;

        const dataFim = new Date(this.props.pedido.dataPedido.toDateString());
        dataFim.setDate(dataFim.getDate() + 7);

        diaFim = `${dataFim.getDate()}/${+dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;
      } else if (this.state.order.start_order && this.state.order.urgencia === 'definir-data') {
        diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;
      }

      return (
        <View style={{
          flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <View style={{
            width: 320, height: '90%',
            backgroundColor: 'white', borderRadius: 20
          }}>
            <ScrollView>
              <View style={{ alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 13 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Detalhes do Pedido</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Tipo:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{this.state.order.category}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Descrição:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{this.state.order.description}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Fotos:</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Data:</Text>{
                  (() => {
                    switch (this.state.order.urgencia) {
                      case 'semana':
                        return <Text style={this.visualizarPedidoStyle.textos}>Entre {diaInicio} e {diaFim} (semanal)</Text>;
                      case 'urgente':
                        return <Text style={this.visualizarPedidoStyle.textos}>Urgente</Text>;
                      case 'definir-data':
                        return <Text style={this.visualizarPedidoStyle.textos}>{diaInicio} (data definida)</Text>;
                      default:
                        return null;
                    }
                  })()}
              </View>
            </ScrollView>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={this.props.onConfirm}
                style={{
                  width: 300, backgroundColor: colors.verdeFinddo,
                  justifyContent: 'center', alignItems: 'center',
                  borderRadius: 20, height: 45, marginBottom: 10
                }}>
                <Text style={{ color: colors.branco, fontSize: 18 }}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.props.onCancel}
                style={{
                  width: 300, backgroundColor: colors.verdeFinddo,
                  justifyContent: 'center', alignItems: 'center',
                  borderRadius: 20, height: 45, marginBottom: 10
                }}>
                <Text style={{ color: colors.branco, fontSize: 18 }}>VOLTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    else {
      return (null);
    }
  }

  visualizarPedidoStyle = StyleSheet.create({
    titulos: {
      paddingHorizontal: 13, textAlign: 'left',
      fontSize: 25, width: '100%',
      fontWeight: 'bold', marginTop: 10
    },
    textos: {
      paddingHorizontal: 13, textAlign: 'left',
      fontSize: 18, width: '100%',
      marginTop: 5
    }
  });
}