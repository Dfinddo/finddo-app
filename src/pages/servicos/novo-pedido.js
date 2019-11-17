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
    urgencia: urgenciaValues[0].value,
    categoriasImages: [
      { id: '1', name: 'Hidráulica', image_url: require('../../img/jacek-dylag-unsplash.png') },
      { id: '2', name: 'Elétrica', image_url: require('../../img/eletrica.png') },
      { id: '3', name: 'Pintura', image_url: require('../../img/pintura.png') },
      { id: '4', name: 'Ar condicionado', image_url: require('../../img/ar-condicionado.png') },
      { id: '5', name: 'Instalações', image_url: require('../../img/instalacao.png') },
      { id: '6', name: 'Pequenas reformas', image_url: require('../../img/peq-reforma.png') },
      { id: '7', name: 'Consertos em geral', image_url: require('../../img/consertos.png') },
    ],
    imageServicoUrl: require('../../img/jacek-dylag-unsplash.png')
  };

  componentDidMount() {
    const { navigation } = this.props;
    const categoria = navigation.getParam('item', 'NO-ID');
    const categoriaSelecionada = this.state.categoriasImages.find((cat) => {
      return cat.id === categoria.id;
    });

    this.setState({ imageServicoUrl: categoriaSelecionada.image_url });

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
            style={{ width: '100%' }}
            source={this.state.imageServicoUrl} />
          <View style={[{ width: '100%' }, this.novoPedidoStyle.horizontalPadding]}>
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
          </View>
          <TouchableOpacity
            style={this.novoPedidoStyle.continuarButton}
            onPress={() => {
              this.props
                .navigation.navigate('FotosPedido',
                  { necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido });
            }}>
            <Text style={this.novoPedidoStyle.continuarButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  novoPedidoStyle = StyleSheet.create({
    pedidoForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    horizontalPadding: { paddingHorizontal: 10 },
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
      width: 340, height: 45,
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
