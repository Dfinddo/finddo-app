import React, { Component } from 'react';
import {
  Text, TextInput,
  View, StyleSheet,
  Image, TouchableOpacity,
  Picker
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../colors';

const urgenciaValues = [
  { text: 'Para quando precisa do serviço?', value: '' },
  { text: 'Urgente', value: 'urgente' },
  { text: 'Durante a semana', value: 'semana' },
  { text: 'Definir data', value: 'definir-data' }
];

export default class NovoPedido extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.item.name}`,
  });

  state = {
    necessidade: '',
    categoriaPedido: null,
    urgencia: urgenciaValues[0].value
  };

  componentDidMount() {
    this.obterCategoria();
  };

  obterCategoria = () => {
    const { navigation } = this.props;
    const categoriaPedido = navigation.getParam('item', 'no item');
    this.setState({ categoriaPedido });
  };

  render() {
    return (
      <ScrollView>
        <View style={this.novoPedidoStyle.pedidoForm}>
          <Image
            style={{ borderRadius: 16, width: '100%' }}
            source={require('../../img/jacek-dylag-unsplash.png')} />
          <TextInput
            style={this.novoPedidoStyle.pedidoFormSizeAndFont}
            multiline={true}
            placeholder="Nos conte o que precisa"
            onChangeText={(necessidade) => this.setState({ necessidade: necessidade })}
            value={this.state.necessidade}
          />
          <View
            style={this.novoPedidoStyle.selectStyle}>
            <Picker
              selectedValue={this.state.urgencia}
              style={{
                height: 50, width: '100%'
              }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ urgencia: itemValue })
              }>
              <Picker.Item label={urgenciaValues[0].text} value={urgenciaValues[0].value} />
              <Picker.Item label={urgenciaValues[1].text} value={urgenciaValues[1].value} />
              <Picker.Item label={urgenciaValues[2].text} value={urgenciaValues[2].value} />
              <Picker.Item label={urgenciaValues[3].text} value={urgenciaValues[3].value} />
            </Picker>
          </View>
          <TouchableOpacity
            style={this.novoPedidoStyle.continuarButton}
            onPress={() => {
              this.props
                .navigation.navigate('FotosPedido',
                  { necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido });
            }}>
            <Text style={this.novoPedidoStyle.continuarButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  novoPedidoStyle = StyleSheet.create({
    pedidoForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 },
    pedidoFormSizeAndFont:
    {
      fontSize: 25, height: 200,
      textAlignVertical: 'top', paddingLeft: 16,
      paddingRight: 16, marginTop: 16,
      borderStyle: 'solid', borderWidth: 2,
      borderColor: colors.verdeFinddo, width: '100%'
    },
    continuarButton:
    {
      marginTop: 40,
      width: 360, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo
    },
    continuarButtonText:
    {
      textAlignVertical: 'center', height: 45,
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    },
    fontTitle: {
      fontSize: 30
    },
    selectStyle: {
      borderStyle: 'solid', width: '100%',
      borderWidth: 2, borderColor: colors.verdeFinddo,
      marginTop: 16
    }
  });
}
