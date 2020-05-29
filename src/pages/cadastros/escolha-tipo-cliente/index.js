import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TouchableOpacity,
} from 'react-native';
import { colors } from '../../../colors';
import HeaderFundoTransparente from '../../../components/header-fundo-transparente';
import { styles } from './styles';

export default class EscolhaClienteScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: () => <HeaderFundoTransparente />,
    headerBackTitle: 'Voltar'
  };

  _redirectCadastro = (tipoCliente) => this.props.navigation.navigate('ParteUm', { tipoCliente });

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
        <View style={styles.escolhaForm}>
          <View style={{
            width: 340,
            backgroundColor: colors.branco, alignItems: 'center'
          }}>
            <Text style={styles.fontTitle}>Quero ser:</Text>
            <TouchableOpacity
              style={styles.escolhaButton}
              onPress={() => this._redirectCadastro('user')}>
              <Text style={styles.escolhaButtonText}>CLIENTE FINDDO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.escolhaButton}
              onPress={() => this._redirectCadastro('professional')}>
              <Text style={styles.escolhaButtonText}>PROFISSIONAL FINDDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground >
    );
  }
}
