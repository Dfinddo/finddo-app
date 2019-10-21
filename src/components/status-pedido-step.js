import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class StatusPedidoStep extends Component {
  state = {
    verticalBarColor: 'gray',
    circleColor: 'gray',
    circleBorderColor: '#595959'
  };

  setEtapaAtiva = () => {
    this.setState({ circleColor: 'green', circleBorderColor: 'black' });
  };

  setStepConcluido = () => {
    this.setState({ verticalBarColor: 'green' });
  };

  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            borderWidth: 1, marginTop: this.props.hasMarginTop ? 20 : 0,
            borderColor: this.state.circleBorderColor,
            height: 20, backgroundColor: this.state.circleColor,
            width: 20, borderRadius: 10
          }}>
        </View>
        <View
          style={{
            height: 90, backgroundColor: this.state.verticalBarColor,
            width: 3, display: this.props.verticalBarVisibility
          }}>
        </View>
      </View>
    );
  }
}
