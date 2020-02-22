import React, { Component } from 'react';
import {
  ImageBackground, View,
  Text, TextInput,
  StyleSheet, Image,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
  Modal
} from 'react-native';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import { colors } from '../../colors';
import { StackActions, NavigationActions } from 'react-navigation';

export default class ValorServicoScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = { valorServico: '', valorComTaxa: 0, isLoading: false, pedido: null };

  constructor(props) {
    super(props);
  }

  calcularValorServico = (valor) => {
    const valorServico = Number(valor);

    if (valorServico < 80) {
      return valorServico * 1.25;
    } else if (valorServico < 500) {
      return valorServico * 1.2;
    } else if (valorServico >= 500) {
      return valorServico * 1.15;
    }
  };

  formatarValorServico = (valor) => {
    try {
      return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    } catch {
      return '0'.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    const pedido = navigation.getParam('pedido', null);

    if (pedido) {
      this.setState({ pedido });
    }
  }

  render() {
    return (
      <ImageBackground
        style={this.loginScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.loginScreenStyle.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={this.loginScreenStyle.loginForm}>
            <Image
              source={require('../../img/finddo-logo.png')}
              style={this.loginScreenStyle.finddoLogoStyle} />
            <View style={this.loginScreenStyle.loginMainForm}>
              <Text style={this.loginScreenStyle.fontTitle}>Cobrança</Text>
              <TextInput
                style={this.loginScreenStyle.loginFormSizeAndFont}
                placeholder="Valor do serviço"
                keyboardType="number-pad"
                onChangeText={
                  (valor) => {
                    try {
                      this.setState({ valorServico: valor }, () => {
                        this.setState({ valorComTaxa: this.calcularValorServico(this.state.valorServico) })
                      });
                    }
                    catch { }
                  }}
                value={this.state.valorServico}
              />
              <TextInput
                style={this.loginScreenStyle.loginFormSizeAndFont}
                placeholder="Total a ser cobrado"
                value={this.formatarValorServico(this.state.valorComTaxa)}
                editable={false}
              />
            </View>
            <TouchableOpacity
              style={this.loginScreenStyle.loginButton}
              onPress={() => {
                if (!this.state.valorServico || this.state.valorComTaxa < 0) {
                  Alert.alert(
                    'Finddo',
                    'Por favor defina um valor para o pedido',
                    [
                      { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: false },
                  );
                } else {
                  const order = this.state.pedido;

                  Alert.alert(
                    'Finddo',
                    `Confirma o valor ${this.formatarValorServico(this.state.valorComTaxa)}?`,
                    [
                      {
                        text: 'OK', onPress: () => {
                          order.price = this.state.valorComTaxa * 100;

                          backendRails.patch(`/orders/${this.state.pedido.id}`,
                            { order },
                            { headers: TokenService.getInstance().getHeaders() })
                            .then(response => {
                              this.setState(
                                { pedido: response.data, isLoading: false },
                                () => {
                                  const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Acompanhamento', params: { pedido: this.state.pedido } })],
                                  });
                                  this.props.navigation.dispatch(resetAction);
                                }
                              );
                            })
                            .catch(error => {
                              console.log(error);
                              this.setState({ isLoading: false });
                            });
                        }
                      },
                    ],
                    { cancelable: false },
                  );
                }
              }}>
              <Text style={this.loginScreenStyle.loginButtonText}>COBRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  loginScreenStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
    loginForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 340, height: 250, backgroundColor: colors.branco },
    loginButton: { marginTop: 40, marginBottom: 10, width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    loginButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
    loginFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      borderBottomColor: colors.verdeFinddo,
      borderBottomWidth: 2,
      textAlign: 'left',
      width: 300,
    },
    loginEsqueciSenha:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'center',
      width: 300,
      textDecorationLine: 'underline',
      textAlignVertical: 'bottom'
    },
    fontTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    cadastreSe: { fontWeight: 'bold', textDecorationLine: 'underline' }
  });
}
