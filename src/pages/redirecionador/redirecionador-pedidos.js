import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../colors';
import TokenService from '../../services/token-service';
import { StackActions, NavigationActions } from 'react-navigation';

export default class RedirecionadorPedidos extends Component {

  componentDidMount() {
    const user = TokenService.getInstance().getUser();
    if (user.user_type === 'user') {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'MeusPedidos' })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'MeusPedidosProfissional' })],
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  render() {
    return (
      <View style={{
        flex: 1, alignItems: 'center',
        justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
      }}>
        <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
      </View>
    );
  }
}
