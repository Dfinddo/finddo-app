import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { backendUrl } from '../../services/backend-rails-api';
import { styles } from './styles';

export default class Accordian extends Component {
	public state: any;
	public setState: any;
	public props: any;

  constructor(props) {
    super(props);
    this.state = {
      // variável não utilizada
      data: props.data,
      accordianClosed: true,
      estadoAtual: 'analise',
      estadoComponente: 'analise'
    }
  }

  componentDidMount() {
    this.setState({ estadoComponente: this.props.estadoInicial });
  }

  /** Esta função é utilizada pelo componente que faz referência ao accordion */
  setEstadoAtual = (estado) => {
    this.setState({ estadoAtual: estado });
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    if (this.state.estadoAtual !== this.state.estadoComponente) {
      return (
        <View>
          <View
            style={styles.accordionFechadoEstadoInativo}>
            <Text
              style={styles.accordionFechadoTextEstadoInativo}>
              {this.props.conteudo}</Text>
          </View>
          <View style={styles.margemPreenchimento} />
        </View>
      );
    } else if (this.state.accordianClosed) {
      return (
        <View>
          <TouchableOpacity
            style={styles.accordionFechadoEstadoAtivo}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={styles.accordionFechadoConteudoEstadoAtivo}>
              <Text style={styles.accordionFechadoConteudoEstadoAtivoText}>
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
        <View style={styles.accordionAberto}>
          <TouchableOpacity
            style={styles.accordionAbertoProfissional}
            onPress={() => {
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <View style={styles.accordionAbertoConteudo}>
              <Text style={{ fontSize: 20, width: 235 }}>
                {this.props.conteudo}</Text>
              <Icon
                style={{ width: 35 }}
                name={this.state.accordianClosed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                size={20} color='gray' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 110 }}
            onPress={() => this.setState({ accordianClosed: !this.state.accordianClosed })}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.accordionAbertoProfissionalFoto}>
                  <Image
                    style={{ width: 85, height: 85, borderRadius: 50 }}
                    source={{ uri: backendUrl + `/${this.props.pedido.professional_photo}` }} />
                </View>
                <View style={styles.accordionAbertoProfissionalInfo}>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>
                    {this.props.pedido.professional_order.name}</Text>
                  <View style={styles.accordionAbertoEstrelas}>
                    {
                      // TODO adicionar classificação do profissional
                      // em quantidade de estrelas
                    }
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
