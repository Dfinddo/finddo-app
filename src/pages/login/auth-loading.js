import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TokenService from '../../services/token-service';
import backendRails from '../../services/backend-rails-api';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // AsyncStorage.clear();
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      const tokenObj = JSON.parse(userToken);

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
            console.log(tokenObj);
            tokenValid = true;
          }
        ).catch(
          (error) => {
            AsyncStorage.removeItem('userToken');
            console.log('catch');
          }
        ).finally(
          () => {
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            this.props.navigation.navigate(tokenValid ? 'App' : 'Auth');
          }
        );
    } else {
      console.log('else');
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}
