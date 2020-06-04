import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { colors } from '../colors';
import { backendUrl } from '../services/backend-rails-api';

export default class VisualizarPedidoProfissional extends Component {
	public props: any;
	public setState: any;

  constructor(props) {
    super(props);
  }

  state = {
    order: null
  };

  componentDidMount() {
    const order = {};
    if (this.props.pedido.isShowingPedido) {
      order.description = this.props.pedido.pedidoCorrente.description;
      order.category = this.props.pedido.pedidoCorrente.category.name;
      order.urgency = this.props.pedido.pedidoCorrente.urgency;
      order.user = this.props.pedido.pedidoCorrente.user.name;
      order.professional_order = this.props.pedido.pedidoCorrente.professional_order;
      order.start_order = new Date(this.props.pedido.pedidoCorrente.start_order.split(".")[0]);
      order.end_order = new Date(this.props.pedido.pedidoCorrente.end_order.split(".")[0]);
      order.address = this.props.pedido.pedidoCorrente.address;
      order.images = this.props.pedido.pedidoCorrente.images;
      order.cellphone = this.props.pedido.pedidoCorrente.user.cellphone;
      order.hora_inicio = this.props.pedido.pedidoCorrente.hora_inicio;
      order.hora_fim = this.props.pedido.pedidoCorrente.hora_fim;
    } else {
      order.description = this.props.pedido.description;
      order.category = this.props.pedido.category.name;
      order.urgency = this.props.pedido.urgency;
      order.user = this.props.pedido.user.name;
      order.professional_order = this.props.pedido.professional_order;
      order.start_order = new Date(this.props.pedido.start_order.split(".")[0]);
      order.end_order = new Date(this.props.pedido.end_order.split(".")[0]);
      order.address = this.props.pedido.address;
      order.images = this.props.pedido.images;
      order.cellphone = this.props.pedido.user.cellphone;
      order.hora_inicio = this.props.pedido.hora_inicio;
      order.hora_fim = this.props.pedido.hora_fim;
    }
    this.setState({ order });
  }

  render() {
    let diaInicio = '';
    let diaFim = '';
    let horaInicio = '';
    let minutosInicio = '';
    let horaFim = '';
    let minutosFim = '';

    if (this.state.order) {
      const data = this.state.order.start_order;
      const dataF = this.state.order.end_order;

      diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;
      diaFim = `${this.state.order.end_order.getDate()}/${+this.state.order.end_order.getMonth() + 1}/${this.state.order.end_order.getFullYear()}`;

      horaInicio = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();
      minutosInicio = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();

      horaFim = dataF.getHours() < 10 ? '0' + dataF.getHours() : dataF.getHours();
      minutosFim = dataF.getMinutes() < 10 ? '0' + dataF.getMinutes() : dataF.getMinutes();
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
                {
                  (() => {
                    const fotos = this.state.order.images.map((foto, index) => { return { id: "" + index, foto: { image: { uri: backendUrl + foto } } } })

                    return (
                      <FlatList data={fotos} renderItem={({ item }) => {
                        return (<Image source={item.foto.image} style={{ width: 240, height: 240, marginTop: 10 }} />);
                      }} />
                    );
                  })()
                }
                <Text style={this.visualizarPedidoStyle.titulos}>Nome cliente:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{this.state.order.user}</Text>
                {
                  (() => {
                    if (this.state.order.professional_order) {
                      return (
                        <View style={{ width: '100%' }}>
                          <Text style={this.visualizarPedidoStyle.titulos}>Contato:</Text>
                          <Text style={this.visualizarPedidoStyle.textos}>{this.state.order.cellphone}</Text>
                        </View>
                      );
                    } else {
                      return (null);
                    }
                  })()
                }
                <Text style={this.visualizarPedidoStyle.titulos}>Endereço:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.street}, ${this.state.order.address.number}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.complement}, ${this.state.order.address.cep}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.state.order.address.district}`}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Data:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>
                  {diaInicio}, entre {horaInicio} e {horaFim} ({this.state.order.urgencia === 'definir-data' ? "Com" : "Sem"} urgência)
                </Text>
                {
                  (() => {
                    return null;
                    switch (this.state.order.urgency) {
                      case 'not_urgent':
                        return <Text style={this.visualizarPedidoStyle.textos}>Entre {diaInicio} e {diaFim}, e entre os horários {this.state.order.hora_inicio} e {this.state.order.hora_fim} (Sem urgência)</Text>;
                      case 'urgente':
                        return <Text style={this.visualizarPedidoStyle.textos}>Urgente</Text>;
                      case 'urgent':
                        return <Text style={this.visualizarPedidoStyle.textos}>{diaInicio}, entre {this.state.order.hora_inicio} e {this.state.order.hora_fim} (Com urgência)</Text>;
                      default:
                        return null;
                    }
                  })()
                }
              </View>
            </ScrollView>
            <View style={{ alignItems: 'center' }}>
              {
                (() => {
                  if (this.props.pedido.isShowingPedido) {
                    return (null);
                  } else {
                    return (<TouchableOpacity
                      onPress={this.props.onConfirm}
                      style={{
                        width: 300, backgroundColor: colors.verdeFinddo,
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: 20, height: 45, marginBottom: 10
                      }}>
                      <Text style={{ color: colors.branco, fontSize: 18 }}>CONFIRMAR</Text>
                    </TouchableOpacity>);
                  }
                })()
              }
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
