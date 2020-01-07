import React, { Component } from 'react';
import {
  View, ImageBackground,
  ScrollView, Text,
  StyleSheet, TouchableOpacity,
  Linking, Alert
} from 'react-native';
import HeaderTransparenteSemHistorico from '../../components/header-transparente-sem-historico';
import { colors } from '../../colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { termos } from '../cadastros/termos';

export default class AjudaScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderTransparenteSemHistorico />
  };

  constructor(props) {
    super(props);
  }

  state = {
    faleConoscoIsOpened: false,
    sobreIsOpened: false,
  };

  openChat = () => {
    let url = 'whatsapp://send?text=' + '' + '&phone=55' + '21980503130';
    Linking.openURL(url).catch((_) => {
      Alert.alert(
        'Erro',
        'Whatsapp não instalado no seu dispositivo',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: false },
      );
    });
  };

  render() {
    return (
      <ImageBackground
        style={this.ajudaScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: 50 }}></View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center', width: '100%',
              height: 500
            }}>
              <AccordianInfoApp
                opened={this.state.sobreIsOpened}
                onPress={() => this.changeSobreIsOpenedState()}
                content={termos}></AccordianInfoApp>
              <View style={{ height: 5 }} />
              <AccordianInfoContato
                opened={this.state.faleConoscoIsOpened}
                onPress={() => this.changeFaleConoscoIsOpenedState()}
                onPressAction={() => this.openChat()}>
              </AccordianInfoContato>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  changeSobreIsOpenedState = () => {
    const value = this.state.sobreIsOpened;
    this.setState({ sobreIsOpened: !value });
  };

  changeFaleConoscoIsOpenedState = () => {
    const value = this.state.faleConoscoIsOpened;
    this.setState({ faleConoscoIsOpened: !value });
  };

  ajudaScreenStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
  });
}

function AccordianInfoApp(props) {
  if (props.opened === false) {
    return (
      <View style={{
        width: 320, height: 70,
        backgroundColor: colors.branco, flexDirection: 'row'
      }}>
        <View style={{
          width: 280, alignItems: 'flex-start',
          justifyContent: 'center', paddingLeft: 10
        }}>
          <Text style={{
            color: colors.preto, fontSize: 22,
            fontWeight: 'bold'
          }}>Sobre o App</Text>
        </View>
        <View style={{
          width: 40, alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableOpacity onPress={props.onPress}>
            <Icon
              name={'keyboard-arrow-down'}
              size={35} color={colors.preto} />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ maxHeight: 300, flex: 1 }}>
        <View style={{
          width: 320, height: 70,
          backgroundColor: colors.branco, flexDirection: 'row'
        }}>
          <View style={{
            width: 280, alignItems: 'flex-start',
            justifyContent: 'center', paddingLeft: 10
          }}>
            <Text style={{
              color: colors.preto, fontSize: 22,
              fontWeight: 'bold'
            }}>Sobre o App</Text>
          </View>
          <View style={{
            width: 40, alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={props.onPress}>
              <Icon
                name={'keyboard-arrow-up'}
                size={35} color={colors.preto} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{
            width: 320, backgroundColor: colors.branco
          }}>
            <Text>{props.content}</Text>
          </View>
        </ScrollView>
      </View>);
  }
}

function AccordianInfoContato(props) {
  if (props.opened === false) {
    return (
      <View style={{
        width: 320, height: 70,
        backgroundColor: colors.branco, flexDirection: 'row'
      }}>
        <View style={{
          width: 280, alignItems: 'flex-start',
          justifyContent: 'center', paddingLeft: 10
        }}>
          <Text style={{
            color: colors.preto, fontSize: 22,
            fontWeight: 'bold'
          }}>Contato</Text>
        </View>
        <View style={{
          width: 40, alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableOpacity onPress={props.onPress}>
            <Icon
              name={'keyboard-arrow-down'}
              size={35} color={colors.preto} />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ maxHeight: 140, flex: 1 }}>
        <View style={{
          width: 320, height: 70,
          backgroundColor: colors.branco, flexDirection: 'row'
        }}>
          <View style={{
            width: 280, alignItems: 'flex-start',
            justifyContent: 'center', paddingLeft: 10
          }}>
            <Text style={{
              color: colors.preto, fontSize: 22,
              fontWeight: 'bold'
            }}>Contato</Text>
          </View>
          <View style={{
            width: 40, alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={props.onPress}>
              <Icon
                name={'keyboard-arrow-up'}
                size={35} color={colors.preto} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{
            width: 320, backgroundColor: colors.branco,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <TouchableOpacity
              onPress={props.onPressAction}
              style={{
                width: 300, backgroundColor: colors.verdeFinddo,
                alignItems: 'center', justifyContent: 'center',
                height: 45, borderRadius: 20,
                marginBottom: 10
              }}>
              <Text style={{ color: colors.branco, fontSize: 18 }}>FALE CONOSCO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>);
  }
}