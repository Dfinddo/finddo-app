import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class HeaderFundoTransparente extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
        <Image
          source={require('../img/finddo-logo.png')}
          style={{ width: 130, height: 30, marginLeft: 62 }}
        />
      </View>
    );
  }
}
