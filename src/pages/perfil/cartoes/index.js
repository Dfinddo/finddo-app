import React, { Component } from 'react';
import {
  TouchableOpacity, View,
  ImageBackground, ScrollView,
  Text, StyleSheet, FlatList, Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../../../colors';
import HeaderFundoTransparente from '../../../components/header-fundo-transparente';
import { NavigationEvents } from 'react-navigation';
import TokenService from '../../../services/token-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moipAPI, { headersOauth2 } from '../../../services/moip-api';
import { styles } from './styles';

export default class CartoesScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: () => <HeaderFundoTransparente />,
    headerBackTitle: 'Voltar'
  };

  constructor(props) {
    super(props);
  }

  state = {
    cartoes: [],
    isLoading: false,
  };

  obterCartoes = () => {
    this.setState({ isLoading: true }, () => {
      const tokenService = TokenService.getInstance();

      moipAPI.get('/customers/' + tokenService.getUser().customer_wirecard_id, { headers: headersOauth2 })
        .then((data) => {
          const clientData = data.data;
          if (clientData.fundingInstruments) {
            const cardData = clientData.fundingInstruments.filter(data => this.creditCardFilter(data));

            if (cardData.length > 0) {
              const cardWithId = cardData.map(data => { return data.creditCard });

              this.setState({ cartoes: [...cardWithId] });
            }
          }
        })
        .catch(error => {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            Alert.alert(
              'Falha ao obter os dados',
              'Verifique sua conexão e tente novamente',
              [
                { text: 'OK', onPress: () => { } },
              ],
              { cancelable: false },
            );
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            Alert.alert(
              'Falha ao se conectar',
              'Verifique sua conexão e tente novamente',
              [
                { text: 'OK', onPress: () => { } },
              ],
              { cancelable: false },
            );
          } else {
            /* Something happened in setting up the request and triggered an Error */
          }
        })
        .finally(_ => {
          this.setState({ isLoading: false });
        });
    });
  };

  creditCardFilter = (data) => {
    return data.method === "CREDIT_CARD";
  };

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImageContent}
        source={require('../../../img/Ellipse.png')}>
        <View style={{ height: 70 }}></View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={styles.modalStyle}>
              <View>
                <ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
              </View>
            </View>
          </Modal>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
              backgroundColor: colors.branco, flexDirection: 'column',
              height: 500, alignItems: 'center',
              justifyContent: 'space-around', width: '90%'
            }}>
              <NavigationEvents
                onWillFocus={_ => this.obterCartoes()}
              //onDidFocus={payload => console.log('did focus', payload)}
              //onWillBlur={payload => console.log('will blur', payload)}
              //onDidBlur={payload => console.log('did blur', payload)}
              />
              <View style={{ height: 20 }}></View>
              <ListaDeEnderecos
                navigation={this.props.navigation}
                enderecos={this.state.cartoes}
                comp={this}></ListaDeEnderecos>
            </View>
          </View>
        </ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 60 }}>
          <TouchableOpacity
            style={styles.sairButton}
            onPress={() => { this.props.navigation.navigate('CreateEditCard') }}>
            <Text style={styles.addButtonText}>ADICIONAR CARTÃO</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

export function Item(props) {
  const itemStyle = StyleSheet.create({
    itemCartaoText: {
      color: 'black', fontSize: 16,
      textAlign: 'left', width: 240
    },
    cartaoNome: {
      fontWeight: 'bold'
    }
  });

  let IconComponent = Ionicons;

  return (
    <View style={{
      width: 300, height: 90,
      flexDirection: 'row', borderRadius: 20,
      borderColor: colors.amareloIconeEditar,
      borderWidth: 1, marginBottom: 10
    }}>
      <View style={{
        width: 240, paddingLeft: 20,
        alignItems: 'center', justifyContent: 'center'
      }}>
        <Text style={[itemStyle.itemCartaoText, itemStyle.cartaoNome]}>{props.dados.item.brand}</Text>
        <Text style={itemStyle.itemCartaoText}>{props.dados.item.first6}XXXXXX{props.dados.item.last4}</Text>
      </View>
      <View style={{
        width: 60, backgroundColor: 'transparent',
        alignItems: 'center', justifyContent: 'space-evenly',
        flexDirection: 'column'
      }}>
        <TouchableOpacity onPress={() => { excluirItemConfirm(props.dados.item, props.comp, props.size) }}>
          <IconComponent name={"ios-trash"} size={25} color={colors.vermelhoExcluir} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ListaDeEnderecos(props) {
  return (
    <FlatList
      data={props.enderecos}
      renderItem={(item) => <Item dados={item} size={props.enderecos.length} navigation={props.navigation} comp={props.comp} />}
      keyExtractor={item => item.id}
    />
  );
}

export const excluirItemConfirm = (item, comp, size) => {
  if (size > 1) {
    Alert.alert(
      `Deseja excluir ${item.brand}?`,
      `O cartão não poderá ser cadastrado novamente.`,
      [
        { text: 'Não', onPress: () => { } },
        { text: 'Sim', onPress: () => { excluirItem(item, comp) } },
      ],
      { cancelable: false },
    );
  } else {
    Alert.alert(
      'Não é possível excluir',
      'É necessário ao menos um cartão para pagamento',
      [
        { text: 'OK', onPress: () => { } },
      ],
      { cancelable: false },
    );
  }
}

export const excluirItem = (item, comp) => {
  comp.setState({ isLoading: true })

  moipAPI.delete(`/fundinginstruments/${item.id}`, { headers: headersOauth2 }).then(
    _ => {
      comp.obterCartoes();
      comp.setState({ isLoading: false });
    }
  ).catch(error => {
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      Alert.alert(
        'Falha ao excluir',
        'Verifique sua conexão e tente novamente',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: false },
      );
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      Alert.alert(
        'Falha ao se conectar',
        'Verifique sua conexão e tente novamente',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: false },
      );
    } else {
      /* Something happened in setting up the request and triggered an Error */
    }
    comp.setState({ isLoading: false });
  });
}