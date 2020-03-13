import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { colors } from '../colors';
import TokenService from '../services/token-service';
import { backendUrl } from '../services/backend-rails-api';

export default class VisualizarPedido extends Component {
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
      order.urgencia = this.props.pedido.pedidoCorrente.urgency === 'urgent' ? 'definir-data' : 'semana';
      order.user_id = this.props.pedido.pedidoCorrente.user.id
      order.start_order = new Date(this.props.pedido.pedidoCorrente.start_order.split('.')[0]);
      order.hora_inicio = this.props.pedido.pedidoCorrente.hora_inicio;
      order.hora_fim = this.props.pedido.pedidoCorrente.hora_fim;
    } else {
      order.description = this.props.pedido.necessidade;
      order.category = this.props.pedido.categoriaPedido.name;
      order.urgencia = this.props.pedido.urgencia;
      order.user_id = TokenService.getInstance().getUser().id;
      if (this.props.pedido.dataPedido) {
        order.start_order = this.props.pedido.dataPedido;
      }
      order.hora_inicio = this.props.pedido.hora;
      order.hora_fim = this.props.pedido.horaFim;
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
      
      if (this.state.order.start_order && this.state.order.urgencia === 'semana') {
        diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;

        let dataFim = null;
        if (this.props.pedido.isShowingPedido) {
          dataFim = new Date(this.props.pedido.pedidoCorrente.start_order.split(".")[0]);
        } else {
          dataFim = new Date(this.props.pedido.dataPedido.toDateString());
        }

        dataFim.setDate(dataFim.getDate() + 7);

        horaInicio = this.state.order.hora_inicio;
        horaFim = this.state.order.hora_fim;

        diaFim = `${dataFim.getDate()}/${+dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;
      } else if (this.state.order.start_order && this.state.order.urgencia === 'definir-data') {
        if (this.props.pedido.isShowingPedido) {
          const data = new Date(this.props.pedido.pedidoCorrente.start_order.split(".")[0]);
          const dataF = new Date(this.props.pedido.pedidoCorrente.end_order.split(".")[0]);

          diaInicio = `${data.getDate()}/${+data.getMonth() + 1}/${data.getFullYear()}`;

          horaInicio = this.props.pedido.pedidoCorrente.hora_inicio;
          minutosInicio = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();

          horaFim = this.props.pedido.pedidoCorrente.hora_fim;
          minutosFim = dataF.getMinutes() < 10 ? '0' + dataF.getMinutes() : dataF.getMinutes();
        } else {
          diaInicio = `${this.state.order.start_order.getDate()}/${+this.state.order.start_order.getMonth() + 1}/${this.state.order.start_order.getFullYear()}`;

          horaInicio = this.props.pedido.hora;
          minutosInicio = this.props.pedido.hora.split(":")[1];

          horaFim = this.props.pedido.horaFim;
          minutosFim = this.props.pedido.horaFim.split(":")[1];
        }
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
                <Text style={this.visualizarPedidoStyle.titulos}>Endereço:</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.props.pedido.enderecoSelecionado.street}, ${this.props.pedido.enderecoSelecionado.number}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.props.pedido.enderecoSelecionado.complement}, ${this.props.pedido.enderecoSelecionado.cep}`}</Text>
                <Text style={this.visualizarPedidoStyle.textos}>{`${this.props.pedido.enderecoSelecionado.district}`}</Text>
                <Text style={this.visualizarPedidoStyle.titulos}>Fotos:</Text>
                {
                  (() => {
                    let fotos = [];
                    if (this.props.pedido.isShowingPedido) {
                      fotos = this.props.pedido.pedidoCorrente.images.map((foto, index) => { return { id: "" + index, foto: { image: { uri: backendUrl + foto } } } })
                    } else {
                      fotos = this.props.pedido.fotosPedido.map((foto, index) => { return { id: "" + index, foto }; });
                    }

                    return (
                      <FlatList data={fotos} renderItem={({ item }) => {
                        return (<Image source={item.foto.image} style={{ width: 240, height: 240, marginTop: 10 }} />);
                      }} />
                    );
                  })()
                }
                <Text style={this.visualizarPedidoStyle.titulos}>Data:</Text>{
                  (() => {
                    switch (this.state.order.urgencia) {
                      case 'semana':
                        return <Text style={this.visualizarPedidoStyle.textos}>Entre {diaInicio} e {diaFim}, e entre os horários {horaInicio} e {horaFim} (Sem urgência)</Text>;
                      case 'urgente':
                        return <Text style={this.visualizarPedidoStyle.textos}>Urgente</Text>;
                      case 'definir-data':
                        return <Text style={this.visualizarPedidoStyle.textos}>{diaInicio}, entre {horaInicio} e {horaFim} (Com urgência)</Text>;
                      default:
                        return null;
                    }
                  })()}
              </View>
            </ScrollView>
            <View style={{ alignItems: 'center' }}>
              {(() => {
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
              })()}
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