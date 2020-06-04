import React, { Component } from 'react';
import {
  Modal, Image,
  ImageBackground, Text,
  FlatList,
  TouchableOpacity, View,
} from 'react-native';
import { colors } from '../../../colors';
import { SvgXml } from 'react-native-svg';
import { bolaCheia } from '../../../img/svg/bola-cheia';
import { bolaApagada } from '../../../img/svg/bola-apagada';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { passo0 } from '../../../img/svg/passo-0';
import { passo1 } from '../../../img/svg/passo-1';
import { passo2 } from '../../../img/svg/passo-2';
import { passo3 } from '../../../img/svg/passo-3';
import { fechar } from '../../../img/svg/fechar';
import AsyncStorage from '@react-native-community/async-storage';
import PedidoCorrenteService from '../../../services/pedido-corrente-service';
import { NavigationEvents } from 'react-navigation';
import TokenService from '../../../services/token-service';
import { styles } from './styles';

export default class Servicos extends Component {
	public setState: any;
	public props: any;
  static navigationOptions = {
    title: 'Onde quer atendimento?',
    headerBackTitle: 'Voltar'
  };

  state = {
    docs: [
      { id: '1', name: 'Hidráulica', image_url: require('../../../img/jacek-dylag-unsplash.png') },
      { id: '2', name: 'Elétrica', image_url: require('../../../img/eletrica.png') },
      { id: '3', name: 'Pintura', image_url: require('../../../img/pintura.png') },
      { id: '4', name: 'Ar condicionado', image_url: require('../../../img/ar-condicionado.png') },
      { id: '5', name: 'Instalações', image_url: require('../../../img/instalacao.png') },
      { id: '6', name: 'Pequenas reformas', image_url: require('../../../img/peq-reforma.png') },
      { id: '7', name: 'Consertos em geral', image_url: require('../../../img/consertos.png') },
      { id: '8', name: null }
    ],
    isLoading: false,
    isShowingTutorial: false,
    currentTutorialStep: 0,
    continuarPedidoFeito: false
  };

  componentDidMount() {
    const pedidoService = PedidoCorrenteService.getInstance();
    const tokenService = TokenService.getInstance();

    pedidoService.getPedidoLocalStorage().then((pedido) => {
      if (pedido && tokenService.getUser()) {
        this.setState({ continuarPedidoFeito: true });
      } else {
        this.verificaRealizacaoTutorial();
      }
    });
  }

  carregaPedidoLocalStorage = () => {
    const pedidoService = PedidoCorrenteService.getInstance();

    this.setState({ isLoading: true }, () => {
      pedidoService.getPedidoLocalStorage().then(
        (pedido) => {
          if (pedido) {
            pedidoService.setPedidoFromLocalStorage(pedido);
          }
          console.log(pedidoService.getPedidoCorrente());
        }).finally(() => {
          this.setState({ isLoading: false });
        });
    });
  };

  setCategoriaPedido = (categoria) => {
    const pedidoService = PedidoCorrenteService.getInstance();
    let pedido = pedidoService.getPedidoCorrente();

    if (!pedido) {
      pedido = {};
    }
    pedido['categoriaPedido'] = categoria;

    pedidoService.setPedidoCorrente(pedido);
  }

  exibirItem = (item) => {
    if (item.name === null) {
      return (<View style={{ height: 20 }}></View>);
    }
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => {
          this.setCategoriaPedido(item);
          this.props.navigation.navigate('NovoPedido', { item });
        }}>
          <Image
            style={{
              marginTop: 4, borderRadius: 16,
              width: 320, height: 180
            }}
            source={item.image_url} />
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Verifica se o app já executou o tutorial no aparelho em que está instalado
   */
  verificaRealizacaoTutorial = async () => {
    const jaRealizou = await AsyncStorage.getItem('tutorial-realizado');

    if (!jaRealizou) {
      this.setState({ isShowingTutorial: true });
    }
  };

  marcarTutorialRealizado = async () => {
    await AsyncStorage.setItem('tutorial-realizado', 'true');

    this.setState({ isShowingTutorial: false });
  }

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={_ => this.carregaPedidoLocalStorage()}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.continuarPedidoFeito}
          >
            <View style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{
                width: 320, height: 200,
                borderRadius: 20, backgroundColor: colors.branco,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: 20, color: colors.preto,
                  marginBottom: 20
                }}>Deseja retomar o pedido?</Text>
                <TouchableOpacity style={{
                  backgroundColor: colors.verdeFinddo,
                  alignItems: 'center', justifyContent: 'center',
                  height: 45, width: 280, borderRadius: 20
                }} onPress={() => this.setState({ continuarPedidoFeito: false }, () => {
                  this.props.navigation.navigate('ConfirmarPedido');
                })}>
                  <Text style={{ fontSize: 18, color: colors.branco }}>SIM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: colors.verdeFinddo,
                  alignItems: 'center', justifyContent: 'center',
                  height: 45, width: 280, borderRadius: 20, marginTop: 20
                }} onPress={() => this.setState({ continuarPedidoFeito: false }, () => {
                  const pedidoService = PedidoCorrenteService.getInstance();

                  pedidoService.salvarPedidoLocalStorage(null);
                })}>
                  <Text style={{ fontSize: 18, color: colors.branco }}>CRIAR NOVO PEDIDO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isShowingTutorial}
          >
            <View style={{
              flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <View
                style={{
                  width: 320, height: 520,
                  backgroundColor: colors.branco, borderRadius: 20,
                  alignItems: 'center', justifyContent: 'center'
                }}>
                <TouchableOpacity
                  onPress={() => this.marcarTutorialRealizado()}
                  style={{ marginHorizontal: 10, top: 10, left: 280, position: 'absolute' }}>
                  <SvgXml
                    xml={fechar}
                    width={20} height={20}></SvgXml>
                </TouchableOpacity>
                <View style={{ height: 20 }}></View>
                <View style={{
                  height: 100, width: '100%',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {(() => {
                    switch (this.state.currentTutorialStep) {
                      case 0:
                        return (
                          <Text style={{
                            fontSize: 28, fontWeight: 'bold',
                          }}>Bem-vindos à Fin<Text style={{ color: colors.verdeFinddo }}>dd</Text>o!</Text>);
                      case 1:
                        return (
                          <Text style={{
                            fontSize: 28, fontWeight: 'bold',
                          }}>Informe o problema</Text>);
                      case 2:
                        return (
                          <Text style={{
                            fontSize: 22, fontWeight: 'bold',
                            textAlign: 'center'
                          }}>O profissional irá informar o valor do serviço e só o realizará em caso de aprovação.</Text>);
                      case 3:
                        return (
                          <Text style={{
                            fontSize: 22, fontWeight: 'bold',
                            textAlign: 'center'
                          }}>Todos os nossos profissionais parceiros são <Text style={{ color: colors.verdeFinddo }}>qualificados</Text>, verificados e oriundos de indicação.</Text>);
                      default:
                        return (null);
                    }
                  })()}
                </View>
                <View style={{
                  height: 320, width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {(() => {
                    if (this.state.currentTutorialStep > 0) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ currentTutorialStep: this.state.currentTutorialStep - 1 });
                          }}
                          style={{
                            height: '100%', width: 40,
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                          <Icon
                            style={{ width: 35 }}
                            name={'keyboard-arrow-left'}
                            size={35} color='gray' />
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <View style={{
                          height: '100%', width: 40,
                          alignItems: 'center', justifyContent: 'center',
                        }}></View>
                      );
                    }
                  })()}
                  <View style={{
                    height: '100%', width: 240,
                    justifyContent: 'flex-end', alignItems: 'center'
                  }}>
                    {(() => {
                      switch (this.state.currentTutorialStep) {
                        case 0:
                          return (<SvgXml xml={passo0} width={200} height={200}></SvgXml>);
                        case 1:
                          return (<SvgXml xml={passo1} width={200} height={200}></SvgXml>);
                        case 2:
                          return (<SvgXml xml={passo2} width={200} height={200}></SvgXml>);
                        case 3:
                          return (<SvgXml xml={passo3} width={200} height={200}></SvgXml>);
                        default:
                          return (null);
                      }
                    })()}
                    <View style={{ height: 40 }}></View>
                    {(() => {
                      switch (this.state.currentTutorialStep) {
                        case 0:
                          return (
                            <Text style={{
                              fontSize: 20, fontWeight: 'bold',
                              textAlign: 'center'
                            }}>Nunca foi tão <Text style={{ color: colors.verdeFinddo }}>fácil</Text> realizar uma manutenção em sua residência.</Text>);
                        case 1:
                          return (
                            <Text style={{
                              fontSize: 20, fontWeight: 'bold',
                              textAlign: 'center'
                            }}>e agende uma visita de nossos profissionais parceiros.</Text>);
                        case 2:
                          return (
                            <Text style={{
                              fontSize: 20, fontWeight: 'bold',
                              textAlign: 'center'
                            }}>O pagamento será feito no <Text style={{ color: colors.verdeFinddo }}>cartão</Text>.</Text>);
                        case 3:
                          return (
                            <TouchableOpacity
                              style={{
                                alignItems: 'center', justifyContent: 'center',
                                backgroundColor: colors.verdeFinddo, borderRadius: 20,
                                width: 240, height: 45
                              }}
                              onPress={() => this.marcarTutorialRealizado()}>
                              <Text style={{ fontSize: 20, color: colors.branco }}>CONCLUIR</Text>
                            </TouchableOpacity>
                          );
                        default:
                          return (null);
                      }
                    })()}
                  </View>
                  {(() => {
                    if (this.state.currentTutorialStep < 3) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ currentTutorialStep: this.state.currentTutorialStep + 1 });
                          }}
                          style={{
                            height: '100%', width: 40,
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                          <Icon
                            style={{ width: 35 }}
                            name={'keyboard-arrow-right'}
                            size={35} color='gray' />
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <View style={{
                          height: '100%', width: 40,
                          alignItems: 'center', justifyContent: 'center',
                        }}></View>
                      );
                    }
                  })()}
                </View>
                <View style={{
                  height: 80, width: 320,
                  justifyContent: 'center', alignItems: 'center',
                  flexDirection: 'row'
                }}>
                  <SvgXml xml={this.state.currentTutorialStep === 0 ? bolaCheia : bolaApagada} style={{ marginHorizontal: 10 }} width={15} height={15}></SvgXml>
                  <SvgXml xml={this.state.currentTutorialStep === 1 ? bolaCheia : bolaApagada} style={{ marginHorizontal: 10 }} width={15} height={15}></SvgXml>
                  <SvgXml xml={this.state.currentTutorialStep === 2 ? bolaCheia : bolaApagada} style={{ marginHorizontal: 10 }} width={15} height={15}></SvgXml>
                  <SvgXml xml={this.state.currentTutorialStep === 3 ? bolaCheia : bolaApagada} style={{ marginHorizontal: 10 }} width={15} height={15}></SvgXml>
                </View>
              </View>
            </View>
          </Modal>
          <FlatList
            data={this.state.docs}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) => this.exibirItem(item)}
          />
        </View>
      </ImageBackground>
    );
  }
}
