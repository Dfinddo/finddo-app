import React, { Component } from 'react';
import {
  Button, View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';

export default class PerfilScreen extends Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    backendRails
      .delete('/auth/sign_out', { headers: TokenService.getInstance().getHeaders() })
      .then(() => {
        AsyncStorage.removeItem('userToken');
        TokenService.getInstance().setToken(null);
        this.props.navigation.navigate('Auth');
      })
      .catch(() => {
        throw new Error('Falha ao realizar logout');
      });
  }

  render() {
    return (
      <View>
        <Button
          title="Sair"
          onPress={() => this.logout()}
        />
      </View>
    );
  }
}
