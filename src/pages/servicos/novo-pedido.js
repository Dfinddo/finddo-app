import React, { Component } from 'react';
import {
  Text, TextInput,
  View, StyleSheet,
  Image, TouchableOpacity,
  Picker, Modal,
  ScrollView, SectionList,
  ImageBackground
} from 'react-native';
import { colors } from '../../colors';

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}

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
    necessidade: '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
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
    imageServicoUrl: require('../../img/jacek-dylag-unsplash.png'),
    formInvalid: false,
    formErrors: []
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

  validaNecessiade = () => {
    const errosArr = [];

    const necessidadeErrors = [];
    const urgenciaErrors = [];

    if (this.state.necessidade.length === 0) {
      necessidadeErrors.push('É obrigatório.');
    } else if (this.state.necessidade.length < 50) {
      necessidadeErrors.push('Precisa ter pelo menos 50 caracteres.');
    } else if (this.state.necessidade.length > 10000) {
      necessidadeErrors.push('Tamanho máximo 10000 caracteres.');
    }

    if (this.state.urgencia === '') {
      urgenciaErrors.push('Por favor informe o prazo para a realização do serviço.');
    }

    if (necessidadeErrors.length > 0) {
      errosArr.push({ title: 'Descrição', data: necessidadeErrors });
    }
    if (urgenciaErrors.length > 0) {
      errosArr.push({ title: 'Urgência', data: urgenciaErrors });
    }

    if (errosArr.length > 0) {
      this.setState({ formErrors: [...errosArr] });
      this.setState({ formInvalid: true });
    } else if (this.state.urgencia === 'definir-data') {
      this.props
        .navigation.navigate('DefinirData',
          { necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido });
    } else if (this.state.urgencia === 'semana') {
      this.props
        .navigation.navigate('FotosPedido',
          {
            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
            dataPedido: new Date()
          });
    } else {
      this.props
        .navigation.navigate('FotosPedido',
          { necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido });
    }
  }

  render() {
    return (
      <ImageBackground
        style={this.novoPedidoStyle.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.formInvalid}
          >
            <View style={this.novoPedidoStyle.modalBase}>
              <View style={this.novoPedidoStyle.modalDialog}>
                <View style={this.novoPedidoStyle.modalDialogContent}>
                  <Text style={this.novoPedidoStyle.modalErrosTitulo}>Erros:</Text>
                  <SectionList
                    style={this.novoPedidoStyle.modalErrosSectionList}
                    sections={this.state.formErrors}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={this.novoPedidoStyle.modalErrosTituloErro}>{title}</Text>
                    )}
                  />
                  <TouchableOpacity
                    style={this.novoPedidoStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ formInvalid: false })}>
                    <Text style={this.novoPedidoStyle.continuarButtonText}>VOLTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
                this.validaNecessiade();
              }}>
              <Text style={this.novoPedidoStyle.continuarButtonText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  novoPedidoStyle = StyleSheet.create({
    backgroundImageContent: { width: '100%', height: '100%' },
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
    },
    modalBase: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    modalDialog: {
      padding: 16, borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%',
      height: '80%', flex: 1,
      alignItems: 'center', justifyContent: 'center'
    },
    modalDialogContent: { backgroundColor: colors.branco, width: 340, borderRadius: 18, opacity: 1, alignItems: 'center' },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
    modalErrosSectionList: { maxHeight: '60%', width: '100%' },
    modalErrosTituloErro: { fontSize: 24, fontWeight: 'bold' },
    modalErrosBotaoContinuar: { marginTop: 40, marginBottom: 10, width: 320, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo }
  });
}
