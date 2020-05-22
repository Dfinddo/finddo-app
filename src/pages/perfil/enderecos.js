import React, { Component } from 'react';
import {
  TouchableOpacity, View,
  ImageBackground, ScrollView,
  Text, StyleSheet, FlatList, Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../../colors';
import HeaderFundoTransparente from '../../components/header-fundo-transparente';
import { NavigationEvents } from 'react-navigation';
import backendRails from '../../services/backend-rails-api';
import TokenService from '../../services/token-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class EnderecosScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTitle: <HeaderFundoTransparente />,
    headerBackTitle: 'Voltar'
  };

  constructor(props) {
    super(props);
  }

  state = {
    enderecos: [],
    isLoading: false,
  };

  obterEnderecos = () => {
    this.setState({ isLoading: true }, () => {
      const tokenService = TokenService.getInstance();

      backendRails.get('/addresses/user/' + tokenService.getUser().id, { headers: tokenService.getHeaders() })
        .then((data) => {
          const addresses = data.data;
          addresses.forEach(element => {
            element.id = '' + element.id;
          });

          this.setState({ enderecos: [...addresses] });
        }).catch(_ => {
          Alert.alert(
            'Falha ao obter os endereços',
            'Por favor tente novamente.',
            [
              { text: 'Cancelar', onPress: () => { } },
              { text: 'OK', onPress: () => { this.obterEnderecos() } },
            ],
            { cancelable: false },
          );
        }).finally(_ => {
          this.setState({ isLoading: false });
        });
    });
  };

  render() {
    return (
      <ImageBackground
        style={this.enderecosScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: 70 }}></View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isLoading}
          >
            <View style={this.enderecosScreenStyle.modalStyle}>
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
                onWillFocus={_ => this.obterEnderecos()}
              //onDidFocus={payload => console.log('did focus', payload)}
              //onWillBlur={payload => console.log('will blur', payload)}
              //onDidBlur={payload => console.log('did blur', payload)}
              />
              <View style={{ height: 20 }}></View>
              <ListaDeEnderecos
                navigation={this.props.navigation}
                enderecos={this.state.enderecos}
                comp={this}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{
          alignItems: 'center', justifyContent: 'center',
          height: 60, paddingBottom: 10
        }}>
          <TouchableOpacity
            style={this.enderecosScreenStyle.sairButton}
            onPress={() => { this.props.navigation.navigate('CreateEditAddress') }}>
            <Text style={this.enderecosScreenStyle.sairButtonText}>ADICIONAR ENDEREÇO</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  enderecosScreenStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    sairButton: {
      marginTop: 10, width: 340,
      height: 45, borderRadius: 20,
      backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    sairButtonText: {
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    },
    enderecosFormSizeAndFont:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'left',
      width: '80%',
      paddingLeft: 20
    },
    enderecosEnderecoSelect:
    {
      fontSize: 18,
      height: 45,
      textAlign: 'center',
      width: 300,
      textDecorationLine: 'underline',
      textAlignVertical: 'bottom'
    },
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
}

export function Item(props) {
  const itemStyle = StyleSheet.create({
    itemEnderecoText: {
      color: 'black', fontSize: 16,
      textAlign: 'left', width: 240
    },
    enderecoNome: {
      fontWeight: 'bold'
    }
  });

  let IconComponent = Ionicons;

  return (
    <View style={{
      width: 300, height: 110,
      flexDirection: 'row', borderRadius: 20,
      borderColor: colors.amareloIconeEditar,
      borderWidth: 1, marginBottom: 10
    }}>
      <View style={{
        width: 240, paddingLeft: 20,
        alignItems: 'center', justifyContent: 'center'
      }}>
        <Text style={[itemStyle.itemEnderecoText, itemStyle.enderecoNome]}>{props.dados.item.name}</Text>
        <Text style={itemStyle.itemEnderecoText}>{props.dados.item.street}, {props.dados.item.number}</Text>
        <Text style={itemStyle.itemEnderecoText}>{props.dados.item.district}, Rio de Janeiro - RJ</Text>
        <Text style={itemStyle.itemEnderecoText}>{props.dados.item.complement}</Text>
      </View>
      {
        (() => {
          if (!props.readOnly) {
            return (
              <View style={{
                width: 60, backgroundColor: 'transparent',
                alignItems: 'center', justifyContent: 'space-evenly',
                flexDirection: 'column'
              }}>
                <TouchableOpacity onPress={() => { props.navigation.navigate('CreateEditAddress', { endereco: props.dados.item, editar: true }) }}>
                  <IconComponent name={"ios-create"} size={25} color={colors.amareloIconeEditar} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { excluirItemConfirm(props.dados.item, props.comp, props.size) }}>
                  <IconComponent name={"ios-trash"} size={25} color={colors.vermelhoExcluir} />
                </TouchableOpacity>
              </View>);
          } else {
            return (null);
          }
        })()
      }
    </View>
  );
}

export function ListaDeEnderecos(props) {
  return (
    <FlatList
      data={props.enderecos}
      renderItem={(item) => {
        if (!props.readOnly) {
          return (<Item readOnly={props.readOnly} dados={item} size={props.enderecos.length} navigation={props.navigation} comp={props.comp} />)
        } else {
          return (
            <TouchableOpacity onPress={() => props.selecionarItem(item)}>
              <Item readOnly={props.readOnly} dados={item} size={props.enderecos.length} navigation={props.navigation} comp={props.comp} />
            </TouchableOpacity>)
        }
      }}
      keyExtractor={item => item.id}
    />
  );
}

export const excluirItemConfirm = (item, comp, size) => {
  if (size > 1) {
    Alert.alert(
      item.name,
      'Deseja excluir?',
      [
        { text: 'Não', onPress: () => { } },
        { text: 'Sim', onPress: () => { excluirItem(item, comp) } },
      ],
      { cancelable: false },
    );
  } else {
    Alert.alert(
      'Não é possível excluir',
      'É necessário ao menos um endereço',
      [
        { text: 'OK', onPress: () => { } },
      ],
      { cancelable: false },
    );
  }
}

export const excluirItem = (item, comp) => {
  // TODO: mensagem ao excluir endereços que tem pedidos ativos associados
  // aviso: passa por validação no backend
  comp.setState({ isLoading: true })

  const tokenService = TokenService.getInstance();

  backendRails.delete(`/addresses/${item.id}`, { headers: tokenService.getHeaders() }).then(
    _ => {
      comp.obterEnderecos();
      comp.setState({ isLoading: false });
    }
  ).catch(_ => {
    Alert.alert(
      'Falha ao excluir',
      'Por favor tente novamente.',
      [
        { text: 'OK', onPress: () => { } },
      ],
      { cancelable: false },
    );
  });
}