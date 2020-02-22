import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { backendUrl } from '../services/backend-rails-api';

export default class Accordian extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      accordianClosed: true,
      estadoAtual: 'analise',
      estadoComponente: 'analise'
    }
  }

  componentDidMount() {
    this.setState({ estadoComponente: this.props.estadoInicial });
  }

  setEstadoAtual = (estado) => {
    this.setState({ estadoAtual: estado });
  }

  render() {
    if (this.state.estadoAtual !== this.state.estadoComponente) {
      return (
        <View>
          <View
            style={this.accordionStyle.accordionFechadoEstadoInativo}>
            <Text
              style={this.accordionStyle.accordionFechadoTextEstadoInativo}>{this.props.conteudo}</Text>
          </View>
          <View style={{ height: 80 }} />
        </View>
      );
    } else if (this.state.accordianClosed) {
      return (
        <View>
          <TouchableOpacity
            style={this.accordionStyle.accordionFechadoEstadoAtivo}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={this.accordionStyle.accordionFechadoConteudoEstadoAtivo}>
              <Text style={this.accordionStyle.accordionFechadoConteudoEstadoAtivoText}>
                {this.props.conteudo}</Text>
              <Icon
                style={{ width: 35 }}
                name={this.state.accordianClosed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                size={20} color='gray' />
            </View>
          </TouchableOpacity>
          <View style={{ height: 90 }} />
        </View>
      );
    } else {
      return (
        <View style={this.accordionStyle.accordionAberto}>
          <TouchableOpacity
            style={{ paddingLeft: 8, height: 40 }}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={this.accordionStyle.accordionAbertoConteudo}>
              <Text style={{ fontSize: 20, width: 235 }}>{this.props.conteudo}</Text>
              <Icon
                style={{ width: 35 }}
                name={this.state.accordianClosed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                size={20} color='gray' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 110 }}
            onPress={() => this.setState({ accordianClosed: !this.state.accordianClosed })}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text> </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={this.accordionStyle.accordionAbertoProfissionalFoto}>
                  <Image
                    style={{ width: 85, height: 85, borderRadius: 50 }}
                    source={{ uri: backendUrl + `/${this.props.pedido.professional_photo}` }} />
                </View>
                <View style={this.accordionStyle.accordionAbertoProfissionalInfo}>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>{this.props.pedido.professional_order.name}</Text>
                  <View style={this.accordionStyle.accordionAbertoEstrelas}>
                    <Image
                      style={this.accordionStyle.accordionAbertoEstrela}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={this.accordionStyle.accordionAbertoEstrela}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={this.accordionStyle.accordionAbertoEstrela}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={this.accordionStyle.accordionAbertoEstrela}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={this.accordionStyle.accordionAbertoEstrela}
                      source={require('../img/estrela.png')} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  accordionStyle = StyleSheet.create({
    accordionFechadoEstadoInativo: {
      height: 40,
      justifyContent: 'center'
    },
    accordionFechadoTextEstadoInativo: {
      fontSize: 18,
      color: 'gray',
    },
    accordionFechadoEstadoAtivo: {
      height: 40, width: 270,
      borderRadius: 10, backgroundColor: 'white',
      paddingLeft: 8
    },
    accordionFechadoConteudoEstadoAtivo: {
      flex: 1, flexDirection: 'row',
      width: 270, alignItems: 'center'
    },
    accordionFechadoConteudoEstadoAtivoText: {
      fontSize: 20, width: 235
    },
    accordionAberto: {
      height: 170, backgroundColor: 'white',
      width: 270, borderRadius: 10
    },
    accordionAbertoConteudo: {
      flex: 1, flexDirection: 'row',
      width: 270, alignItems: 'flex-start',
      paddingTop: 9
    },
    accordionAbertoProfissionalFoto: {
      width: 90, height: 110,
      alignItems: 'center', justifyContent: 'center',
    },
    accordionAbertoProfissionalInfo: {
      width: 180, height: 110,
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: 8
    },
    accordionAbertoEstrelas: {
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'row'
    },
    accordionAbertoEstrela: {
      width: 20, height: 20,
      marginRight: 5
    }
  });
}
