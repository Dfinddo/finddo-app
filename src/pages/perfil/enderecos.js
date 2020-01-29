import React, { Component } from 'react';
import {
  TouchableOpacity, View,
  ImageBackground, ScrollView,
  Text, StyleSheet, FlatList
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
    headerTitle: <HeaderFundoTransparente />
  };

  constructor(props) {
    super(props);
  }

  state = {
    enderecos: []
  };

  obterEnderecos = () => {
    const tokenService = TokenService.getInstance();

    backendRails.get('/addresses/user/' + tokenService.getUser().id, { headers: tokenService.getHeaders() })
      .then((data) => {
        console.log(data.data);

        const addresses = data.data;
        addresses.forEach(element => {
          element.id = '' + element.id;
        });

        this.setState({ enderecos: [...addresses] });
      });
  };

  render() {
    return (
      <ImageBackground
        style={this.enderecosScreenStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <View style={{ height: 50 }}></View>
        <ScrollView>
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
              <ListaDeEnderecos enderecos={this.state.enderecos}></ListaDeEnderecos>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 60 }}>
            <TouchableOpacity
              style={this.enderecosScreenStyle.sairButton}
              onPress={() => { }}>
              <Text style={this.enderecosScreenStyle.sairButtonText}>ADICIONAR ENDEREÇO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  enderecosScreenStyle = StyleSheet.create({
    modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backgroundImageContent: { width: '100%', height: '100%' },
    sairButton: { marginTop: 10, width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo },
    sairButtonText: { textAlignVertical: 'center', height: 45, fontSize: 18, color: colors.branco, textAlign: 'center' },
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
  });
}

function Item(props) {
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
      <View style={{
        width: 60, backgroundColor: 'transparent',
        alignItems: 'center', justifyContent: 'space-evenly',
        flexDirection: 'column'
      }}>
        <TouchableOpacity onPress={() => { }}>
          <IconComponent name={"ios-create"} size={25} color={colors.amareloIconeEditar} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}>
          <IconComponent name={"ios-trash"} size={25} color={colors.vermelhoExcluir} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListaDeEnderecos(props) {
  return (
    <FlatList
      data={props.enderecos}
      renderItem={(item) => <Item dados={item} />}
      keyExtractor={item => item.id}
    />
  );
}