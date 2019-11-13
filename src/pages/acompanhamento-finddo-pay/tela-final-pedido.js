import React, { Component } from 'react';
import {
  Button, View
} from 'react-native';

export default class TelaFinalPedidoScreen extends Component {
  static navigationOptions = {
    title: 'Acompanhe seu pedido'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Button
          title="FinddoPay"
          onPress={() => { }}
        />
      </View>
    );
  }
}
