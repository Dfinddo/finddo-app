import React, { Component } from 'react';
import {
  View,
  ImageBackground, ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import HeaderTransparenteSemHistorico from '../../components/header-transparente-sem-historico';

export default class AjudaScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderTransparenteSemHistorico />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground
        style={this.ajudaScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: 50 }}></View>
        <ScrollView>
          <Text>Página de Ajuda</Text>
        </ScrollView>
      </ImageBackground>
    );
  }

  ajudaScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
  });
}
