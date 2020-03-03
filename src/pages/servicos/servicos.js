import React, { Component } from 'react';
import { Modal, Image, ImageBackground, Text, FlatList, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import moipAPI, { headers } from '../../services/moip-api';
import { colors } from '../../colors';
import TokenService from '../../services/token-service';
import { SvgXml } from 'react-native-svg';
import { bolaCheia } from '../../img/svg/bola-cheia';
import { bolaApagada } from '../../img/svg/bola-apagada';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { passo0 } from '../../img/svg/passo-0';
import { passo1 } from '../../img/svg/passo-1';
import { passo2 } from '../../img/svg/passo-2';
import { passo3 } from '../../img/svg/passo-3';
import { fechar } from '../../img/svg/fechar';

export default class Servicos extends Component {
  static navigationOptions = {
    title: 'Onde quer atendimento?'
  };

  state = {
    docs: [
      { id: '1', name: 'Hidráulica', image_url: require('../../img/jacek-dylag-unsplash.png') },
      { id: '2', name: 'Elétrica', image_url: require('../../img/eletrica.png') },
      { id: '3', name: 'Pintura', image_url: require('../../img/pintura.png') },
      { id: '4', name: 'Ar condicionado', image_url: require('../../img/ar-condicionado.png') },
      { id: '5', name: 'Instalações', image_url: require('../../img/instalacao.png') },
      { id: '6', name: 'Pequenas reformas', image_url: require('../../img/peq-reforma.png') },
      { id: '7', name: 'Consertos em geral', image_url: require('../../img/consertos.png') },
      { id: '8', name: null }
    ],
    page: 1,
    isLoading: false,
    isShowingTutorial: true,
    currentTutorialStep: 0
  };

  creditCardFilter = (data) => {
    return data.method === "CREDIT_CARD";
  };

  exibirAlertSemCartoes = () => {
    Alert.alert(
      'Forma de pagamento ainda não cadastrada',
      'Para adicionar uma forma de pagamento vá para a aba Perfil',
      [{ text: 'OK', onPress: () => { } }]
    );
  };

  verificarCartoes = (item) => {
    this.setState({ isLoading: true }, () => {
      const tokenService = TokenService.getInstance();

      moipAPI.get('/customers/' + tokenService.getUser().customer_wirecard_id, { headers: headers })
        .then((data) => {
          const clientData = data.data;
          if (clientData.fundingInstruments) {
            const cardData = clientData.fundingInstruments.filter(data => this.creditCardFilter(data));

            if (cardData.length > 0) {
              this.props.navigation.navigate('NovoPedido', { item })
            } else {
              this.exibirAlertSemCartoes();
            }
          } else {
            this.exibirAlertSemCartoes();
          }
        })
        .catch(error => {
          console.log(error);
          this.exibirAlertSemCartoes();
        })
        .finally(_ => {
          this.setState({ isLoading: false });
        });
    })
  };

  exibirItem = (item) => {
    if (item.name === null) {
      return (<View style={{ height: 20 }}></View>);
    }
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => this.verificarCartoes(item)}>
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

  render() {
    return (
      <ImageBackground
        style={this.servicosStyles.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={this.servicosStyles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.servicosStyles.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
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
                  onPress={() => this.setState({ isShowingTutorial: false })}
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
                              onPress={() => this.setState({ isShowingTutorial: false })}>
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

  servicosStyles = StyleSheet.create({
    container: {
      marginTop: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    backgroundImageContent: {
      width: '100%', height: '100%'
    },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}
