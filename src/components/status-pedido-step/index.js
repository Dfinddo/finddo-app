import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../colors';

export default class StatusPedidoStep extends Component {
  state = {
    verticalBarColor: colors.cinza,
    circleColor: colors.cinza,
    circleBorderColor: colors.bordaIconeStatus
  };

  setEtapaAtiva = () => {
    this.setState({ circleColor: colors.verdeFinddo, circleBorderColor: colors.preto });
  };

  setStepConcluido = () => {
    this.setState({ verticalBarColor: colors.verdeFinddo });
  };

  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <View
          style={[
            {
              borderColor: this.state.circleBorderColor,
              backgroundColor: this.state.circleColor
            },
            this.statusPedidoStyles.circuloStatus
          ]}>
        </View>
        <View
          style={[
            {
              backgroundColor: this.state.verticalBarColor
            },
            this.statusPedidoStyles.barraHorizontalStatus
          ]}>
        </View>
      </View>
    );
  }

  // os estilos desse componente usam o state, não dá pra colocar em style separado
  statusPedidoStyles = StyleSheet.create({
    circuloStatus: {
      borderWidth: 1, marginTop: this.props.hasMarginTop ? 20 : 0,
      height: 20, width: 20, borderRadius: 10
    },
    barraHorizontalStatus: {
      height: 90, width: 3,
      display: this.props.verticalBarVisibility
    }
  });
}
