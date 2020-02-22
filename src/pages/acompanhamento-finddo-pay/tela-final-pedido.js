import React, { Component } from 'react';
import {
  ImageBackground, View,
  ScrollView, StyleSheet,
  Text, Image,
  Modal, ActivityIndicator, Alert
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../colors';
import backendRails, { backendUrl } from '../../services/backend-rails-api';
import { enumEstadoPedidoMap } from '../profissional_servicos/index-profissional';
import TokenService from '../../services/token-service';
import { NavigationActions, StackActions, NavigationEvents } from 'react-navigation';
import { star } from '../../img/svg/star';
import { SvgXml } from 'react-native-svg';
import { starSolid } from '../../img/svg/star-solid';

export default class TelaFinalPedidoScreen extends Component {
  static navigationOptions = {
    title: 'Dados do Pedido'
  };

  state = {
    pedido: null,
    isLoading: false,
    classificacaoProfissional: 0
  };

  constructor(props) {
    super(props);
  }

  obterPedido = () => {
    this.setState({ isLoading: true }, () => {
      const { navigation } = this.props;
      const pedido = navigation.getParam('pedido', null);

      if (pedido) {
        this.setState({ pedido: pedido, classificacaoProfissional: Number(pedido.rate) });
        console.log(pedido);
      }

      this.setState({ isLoading: false });
    });
  }

  setClassificacao = (classificacaoProfissional = 0) => {
    this.setState({ classificacaoProfissional });
  };

  render() {
    if (!this.state.pedido) {
      console.log('erro');

      return (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../../img/Ellipse.png')}>
          <ScrollView>
            <NavigationEvents
              onWillFocus={_ => this.obterPedido()}
            //onDidFocus={payload => console.log('did focus', payload)}
            //onWillBlur={payload => console.log('will blur', payload)}
            //onDidBlur={payload => console.log('did blur', payload)}
            />
          </ScrollView>
        </ImageBackground>
      );
    } else return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.telaFinalStyles.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={this.telaFinalStyles.containerBase}>
            <View style={this.telaFinalStyles.linha}>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{this.state.pedido.category.name}</Text>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.verdeFinddo }}>{(this.state.pedido.price / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
            <View style={[this.telaFinalStyles.linha, this.telaFinalStyles.avaliacaoFuncionario]}>
              <View>
                <Image
                  style={{ width: 80, height: 80, borderRadius: 100 }}
                  source={{ uri: `${backendUrl}/${this.state.pedido.professional_photo}` }}></Image>
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>Avalie o Profissional</Text>
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  marginTop: 10
                }}>
                  {
                    (() => {
                      if (this.state.classificacaoProfissional === 0) {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(1)}>
                            <SvgXml xml={star} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(0)}>
                            <SvgXml xml={starSolid} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      }
                    })()
                  }
                  {
                    (() => {
                      if (this.state.classificacaoProfissional <= 1) {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(2)}>
                            <SvgXml xml={star} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(1)}>
                            <SvgXml xml={starSolid} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      }
                    })()
                  }
                  {
                    (() => {
                      if (this.state.classificacaoProfissional <= 2) {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(3)}>
                            <SvgXml xml={star} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(2)}>
                            <SvgXml xml={starSolid} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      }
                    })()
                  }
                  {
                    (() => {
                      if (this.state.classificacaoProfissional <= 3) {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(4)}>
                            <SvgXml xml={star} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(3)}>
                            <SvgXml xml={starSolid} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      }
                    })()
                  }
                  {
                    (() => {
                      if (this.state.classificacaoProfissional <= 4) {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(5)}>
                            <SvgXml xml={star} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.setClassificacao(4)}>
                            <SvgXml xml={starSolid} width={18} height={18}></SvgXml>
                          </TouchableOpacity>
                        );
                      }
                    })()
                  }
                </View>
              </View>
            </View>
            <View style={{
              height: 100, width: 300,
              marginTop: 20,
              alignItems: 'flex-start', justifyContent: 'space-around',
              flexDirection: 'row'
            }}>
              <View style={this.telaFinalStyles.horaAgendamento}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>Data agendada:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <Text style={{ fontSize: 18, textAlign: 'center' }}>
                    {
                      (() => {
                        if (this.state.pedido.urgency === 'not_urgent') {
                          const dataInicio = new Date(this.state.pedido.start_order.split('.')[0]);
                          const dataFim = new Date(this.state.pedido.end_order.split('.')[0]);

                          const dataFormatadaInicio = `${dataInicio.getDate()}/${dataInicio.getMonth() + 1}/${dataInicio.getFullYear()}`;
                          const dataFormatadaFim = `${dataFim.getDate()}/${dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;

                          return `Entre\n${dataFormatadaInicio}\ne\n${dataFormatadaFim}`;
                        } else {
                          const dataInicio = new Date(this.state.pedido.start_order.split('.')[0]);

                          const dataFormatadaInicio = `${dataInicio.getDate()}/${dataInicio.getMonth() + 1}/${dataInicio.getFullYear()}`;

                          return `${dataFormatadaInicio}\n(Pedido urgente)`;
                        }
                      })()
                    }
                  </Text>
                </View>
              </View>
              <View style={{ width: 40 }}></View>
              <View style={this.telaFinalStyles.profissionalACaminho}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>{enumEstadoPedidoMap[this.state.pedido.order_status]}</Text>
              </View>
            </View>
            <View style={this.telaFinalStyles.pagamentoRow}></View>
          </View>
          <View style={{
            alignItems: 'center', justifyContent: 'center',
            marginTop: 20
          }}>
            {
              (() => {
                const tokenService = TokenService.getInstance();
                if (tokenService.getUser().user_type === 'professional') {
                  return (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.verdeFinddo, width: 340,
                        height: 45, alignItems: 'center',
                        justifyContent: 'center', borderRadius: 20
                      }} onPress={() => {
                        this.setState({ isLoading: true }, () => {
                          backendRails.get(`/orders/${this.state.pedido.id}`, { headers: tokenService.getHeaders() })
                            .then((response) => {
                              const pedido = response.data;
                              if (pedido.paid === true) {
                                Alert.alert(
                                  'Sucesso',
                                  'Obrigado por usar o Finddo',
                                  [{
                                    text: 'Ok', onPress: () => {
                                      const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'AcompanhamentoPedido' })],
                                      });
                                      this.props.navigation.dispatch(resetAction);
                                    }
                                  }]
                                );
                              }
                              this.setState({ pedido: response.data });
                            }).catch((error) => {
                              console.log(error);
                            }).finally((_) => {
                              this.setState({ isLoading: false });
                            });
                        });
                      }}>
                      <Text style={{ fontSize: 18, color: colors.branco }}>ATUALIZAR STATUS</Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.verdeFinddo, width: 340,
                        height: 45, alignItems: 'center',
                        justifyContent: 'center', borderRadius: 20
                      }} onPress={() => {
                        Alert.alert(
                          'Confirma valor e classificação?',
                          'Valor: ' + (this.state.pedido.price / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                          + '\nClassificação: ' + this.state.classificacaoProfissional + ' estrelas',
                          [
                            { text: 'Cancelar', onPress: () => { } },
                            {
                              text: 'OK', onPress: () => this.efetuarPagamento()
                            },
                          ],
                          { cancelable: false },
                        );
                      }}>
                      <Text style={{ fontSize: 18, color: colors.branco }}>CONFIRMAR PAGAMENTO</Text>
                    </TouchableOpacity>
                  );
                }
              })()
            }
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  efetuarPagamento = () => {
    const tokenService = TokenService.getInstance();

    this.setState({ isLoading: true }, () => {
      const pedido = this.state.pedido;
      pedido.paid = true;
      pedido.order_status = 'finalizado';
      pedido.rate = this.state.classificacaoProfissional;

      backendRails.put(`/orders/${pedido.id}`, { order: pedido }, { headers: tokenService.getHeaders() })
        .then((response) => {
          Alert.alert(
            'Sucesso',
            'Obrigado por usar o Finddo',
            [{
              text: 'Ok', onPress: () => {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'AcompanhamentoPedido' })],
                });
                this.props.navigation.dispatch(resetAction);
              }
            }]
          );
        }).catch((error) => {
          console.log(error);
        }).finally(_ => {
          this.setState({ isLoading: false });
        });
    });
  }

  telaFinalStyles = StyleSheet.create({
    containerBase: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    linha: {
      backgroundColor: 'white', width: 300,
      height: 120, marginTop: 20,
      borderRadius: 20,
      alignItems: 'center', justifyContent: 'space-evenly'
    },
    avaliacaoFuncionario: {
      flexDirection: 'row'
    },
    estrela: { width: 25, height: 25 },
    horaAgendamento: {
      backgroundColor: 'white', borderRadius: 20,
      width: 130, height: 100,
      justifyContent: 'center', alignItems: 'center'
    },
    profissionalACaminho: {
      backgroundColor: 'white', borderRadius: 20,
      width: 130, height: 100,
      alignItems: 'center', justifyContent: 'center'
    },
    pagamentoRow: {
      height: 50, width: 300,
      marginTop: 20,
      alignItems: 'flex-start', justifyContent: 'space-around',
      flexDirection: 'row'
    },
    pagamentoValor: {
      backgroundColor: 'white', borderRadius: 20,
      width: 150, height: 50,
      justifyContent: 'center', alignItems: 'center'
    },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}
