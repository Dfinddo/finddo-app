import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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
            style={{
              height: 40,
              justifyContent: 'center'
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'gray',
              }}>{this.props.conteudo}</Text>
          </View>
          <View style={{ height: 80 }} />
        </View>
      );
    } else if (this.state.accordianClosed) {
      return (
        <View>
          <TouchableOpacity
            style={{
              height: 40, width: 270,
              borderRadius: 10, backgroundColor: 'white',
              paddingLeft: 8
            }}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={{ flex: 1, flexDirection: 'row', width: 270, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, width: 235 }}>{this.props.conteudo}</Text>
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
        <View style={{
          height: 170, backgroundColor: 'white',
          width: 270, borderRadius: 10
        }}>
          <TouchableOpacity
            style={{
              paddingLeft: 8, height: 40
            }}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={{
              flex: 1, flexDirection: 'row',
              width: 270, alignItems: 'flex-start',
              paddingTop: 9
            }}>
              <Text style={{ fontSize: 20, width: 235 }}>{this.props.conteudo}</Text>
              <Icon
                style={{ width: 35 }}
                name={this.state.accordianClosed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                size={20} color='gray' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            height: 110,
          }} onPress={() => this.setState({ accordianClosed: !this.state.accordianClosed })}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>Previsão de chegada: 00/00 às 00:00</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 90, height: 110,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image
                    style={{ width: 85, height: 85, borderRadius: 50 }}
                    source={require('../img/func-status.png')} />
                </View>
                <View style={{
                  width: 180, height: 110,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingLeft: 8
                }}>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>Nome do profissional</Text>
                  <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row'
                  }}>
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={require('../img/estrela.png')} />
                    <Image
                      style={{ width: 20, height: 20 }}
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

}
