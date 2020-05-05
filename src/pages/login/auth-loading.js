import React, { Component } from 'react';
import {
  ActivityIndicator,
  View, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';
import { colors } from '../../colors';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const user = await AsyncStorage.getItem('user');

    if (userToken) {
      const tokenObj = JSON.parse(userToken);
      const userObj = JSON.parse(user);

      let tokenValid = false;

      const authHeaders = {};
      authHeaders['access-token'] = tokenObj['access-token'];
      authHeaders['client'] = tokenObj['client'];
      authHeaders['uid'] = tokenObj['uid'];

      backendRails.get('/auth/validate_token', { headers: authHeaders })
        .then(
          () => {
            const tokenService = TokenService.getInstance();
            tokenService.setToken(tokenObj);
            tokenService.setUser(userObj);
            tokenValid = true;
          }
        ).catch( // token invalido
          async () => {
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('user');
          }
        ).finally(
          () => {
            // a partir de agora sera redirecionado para app sempre
            this.props.navigation.navigate('App');
          }
        );
    } else {
      this.props.navigation.navigate('App');
    }
  };

  render() {
    return (
      <View style={this.authLoadingScreenStyle.spinner}>
        <ActivityIndicator size="large" color={colors.verdeFinddo} />
      </View>
    );
  }

  authLoadingScreenStyle = StyleSheet.create(
    { spinner: { flex: 1, alignItems: 'center', justifyContent: 'center' } }
  );
}
