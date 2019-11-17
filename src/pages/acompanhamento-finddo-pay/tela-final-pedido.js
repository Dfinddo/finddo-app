import React, { Component } from 'react';
import {
  ImageBackground, View,
  ScrollView, StyleSheet,
  Text, Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

export default class TelaFinalPedidoScreen extends Component {
  static navigationOptions = {
    title: 'Dados do Pedido'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: '100%' }}>
          <ScrollView style={{
            flex: 1
          }}>
            <View style={this.telaFinalStyles.containerBase}>
              <View style={{
                backgroundColor: 'white', width: 300,
                height: 120, marginTop: 20,
                borderRadius: 20, flex: 1,
                alignItems: 'center', justifyContent: 'space-evenly'
              }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Nome do Serviço</Text>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>R$ 000,00</Text>
              </View>
              <View style={{
                backgroundColor: 'white', width: 300,
                height: 120, marginTop: 20,
                borderRadius: 20, flex: 1,
                alignItems: 'center', justifyContent: 'space-evenly',
                flexDirection: 'row'
              }}>
                <View>
                  <Image
                    style={{ width: 80, height: 80 }}
                    source={require('../../img/func-status.png')}></Image>
                </View>
                <View>
                  <Text style={{ fontSize: 18 }}>Avalie o Profissional</Text>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    marginTop: 10
                  }}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../img/estrela.png')}></Image>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../img/estrela.png')}></Image>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../img/estrela.png')}></Image>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../img/estrela.png')}></Image>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../img/estrela.png')}></Image>
                  </View>
                </View>
              </View>
              <View style={{
                height: 100, width: 300,
                flex: 1, marginTop: 20,
                alignItems: 'flex-start', justifyContent: 'space-around',
                flexDirection: 'row'
              }}>
                <View style={{
                  backgroundColor: 'white', borderRadius: 20,
                  width: 130, height: 100,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 18 }}>Hora agendada</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 4 }}
                      source={require('../../img/clock.png')}></Image>
                    <Text>(13h - 15h)</Text>
                  </View>
                </View>
                <View style={{ width: 40 }}></View>
                <View style={{
                  backgroundColor: 'white', borderRadius: 20,
                  width: 130, height: 100,
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 18, textAlign: 'center' }}>Profissional à caminho</Text>
                </View>
              </View>
              <View style={{
                height: 50, width: 300,
                flex: 1, marginTop: 20,
                alignItems: 'flex-start', justifyContent: 'space-around',
                flexDirection: 'row'
              }}>
                <View style={{
                  width: 150, height: 50,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Valor à ser pago:</Text>
                </View>
                <View style={{
                  backgroundColor: 'white', borderRadius: 20,
                  width: 150, height: 50,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'green' }}>R$ 000,00</Text>
                </View>
              </View>
            </View>
            <View style={{
              alignItems: 'center', justifyContent: 'center',
              marginTop: 20
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'green', width: 340,
                  height: 45, alignItems: 'center',
                  justifyContent: 'center', borderRadius: 20
                }} onPress={() => {
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'MeusPedidos' })],
                  });
                  this.props.navigation.dispatch(resetAction);
                }}>
                <Text style={{ fontSize: 18, color: 'white' }}>CONFIRMAR PAGAMENTO</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  telaFinalStyles = StyleSheet.create({
    containerBase: {
      flex: 1, alignItems: 'center',
      justifyContent: 'center',
    }
  });
}
