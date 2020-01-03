import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class HeaderTransparenteSemHistorico extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../img/finddo-logo.png')}
          style={{ width: 130, height: 30 }}
        />
      </View>
    );
  }
}
