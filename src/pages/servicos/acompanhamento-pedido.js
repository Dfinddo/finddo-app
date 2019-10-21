import React, { Component } from 'react';
import {
  Modal, View,
  Text, StyleSheet,
  ScrollView, ImageBackground,
  TouchableOpacity, Image,
  ActivityIndicator, Alert
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import { StackActions, NavigationActions } from 'react-navigation';
import { colors } from '../../colors';

export default class AcompanhamentoPedido extends Component {
  static navigationOptions = {
    title: 'Acompanhe seu pedido'
  };

  state = {
    necessidade: '',
    categoriaPedido: null,
    isLoading: false
  };

  componentDidMount() {

  };

  salvarPedido = async (orderData) => {
  }

  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: '90%' }}>
          <ScrollView style={{
            flex: 1
          }}>
            <View style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center', flexDirection: 'row',
              height: 1000, backgroundColor: 'purple'
            }}>
              <View
                style={{
                  height: 1000,
                  backgroundColor: 'red', width: '20%'
                }}></View>
              <View
                style={{
                  height: 1000,
                  backgroundColor: 'blue', width: '80%'
                }}></View>
            </View>
          </ScrollView>
        </View>
        <View style={{
          flex: 1, alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <TouchableOpacity style={{
            width: 340, height: 45,
            borderRadius: 20, backgroundColor: colors.verdeFinddo,
            marginBottom: 6
          }} onPress={() => { }}>
            <Text style={{
              textAlignVertical: 'center', height: 45,
              fontSize: 18, color: colors.branco,
              textAlign: 'center'
            }}>CANCELAR SERVIÇO</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
