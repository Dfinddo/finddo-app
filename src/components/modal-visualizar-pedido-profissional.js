import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../colors';

export default class VisualizarPedidoProfissional extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    order: null
  };

  componentDidMount() {
    console.log(this.props);

    const order = {};
    order.description = this.props.pedido.description;
    order.category = this.props.pedido.category.name;
    // TODO: inserir urgência no backend
    // order.urgencia = this.props.pedido.urgencia;
    order.user = this.props.pedido.user.name;
    order.start_order = new Date(this.props.pedido.start_order);
    order.address = this.props.pedido.address;
    this.setState({ order });
  }

  render() {
    let diaInicio = '';

    if (this.state.order) {
      diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;

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
                <Text style={this.visualizarPedidoStyle.titulos}>Nome cliente:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{this.state.order.user}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Endereço:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.street}, ${this.state.order.address.number}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.complement}, ${this.state.order.address.cep}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.district}`}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Data:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{diaInicio} (data definida)</Text>
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