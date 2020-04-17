import React, { Component } from 'react';
import {
  Text, TextInput,
  View, StyleSheet,
  Image, TouchableOpacity,
  Modal,
  ScrollView, SectionList,
  ImageBackground
} from 'react-native';
import { colors } from '../../colors';
import { CustomPicker } from '../../components/custom-picker';

function Item({ title }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>{'\t'}{title}</Text>
    </View>
  );
}

const urgenciaValues = [
  { content: 'Necessidade do serviço', value: '', id: '0' },
  { content: 'Com urgência', value: 'definir-data', id: '1' },
  { content: 'Sem urgência', value: 'semana', id: '2' },
];

export default class NovoPedido extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.item.name}`,
    headerBackTitle: 'Voltar'
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
    imageServicoUrl: require('../../img/jacek-dylag-unsplash.png'),
    formInvalid: false,
    formErrors: [],
    confirmarEmergencia: false
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

  setUrgencia = ({ value }) => {
    this.setState({ urgencia: value });
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
    } else if (this.state.necessidade.length < 5) {
      necessidadeErrors.push('Precisa ter pelo menos 5 caracteres.');
    } else if (this.state.necessidade.length > 10000) {
      necessidadeErrors.push('Tamanho máximo 10000 caracteres.');
    }

    if (this.state.urgencia === '') {
      urgenciaErrors.push('Por favor informe o grau de urgência para a realização do serviço.');
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
      this.setState({ confirmarEmergencia: true });
    } else if (this.state.urgencia === 'semana') {
      this.props
        .navigation.navigate('DefinirData',
          {
            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
            urgencia: this.state.urgencia
          });
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.confirmarEmergencia}
          >
            <View style={this.novoPedidoStyle.modalBase}>
              <View style={this.novoPedidoStyle.modalDialog}>
                <View style={this.novoPedidoStyle.modalDialogContent}>
                  <Text> </Text>
                  <Text style={{ paddingHorizontal: 10, fontSize: 18 }}>Faremos o máximo possível para lhe atender o quanto antes.</Text>
                  <Text style={{ paddingHorizontal: 10, fontSize: 18 }}>Por favor nos informe uma data e uma faixa de horário ideais para o atendimento.</Text>
                  <TouchableOpacity
                    style={this.novoPedidoStyle.modalErrosBotaoContinuar}
                    onPress={() => this.setState({ confirmarEmergencia: false }, () => {
                      this.props
                        .navigation.navigate('DefinirData',
                          {
                            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
                            urgencia: this.state.urgencia
                          });
                    })}>
                    <Text style={this.novoPedidoStyle.continuarButtonText}>CONTINUAR</Text>
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
                placeholder="Nos conte o que precisa, ex.: Minha pia entupiu..."
                onChangeText={(necessidade) => this.setState({ necessidade: necessidade })}
                value={this.state.necessidade}
              />

              <CustomPicker
                style={this.novoPedidoStyle.selectUrgenciaContainer}
                items={urgenciaValues}
                onSelect={this.setUrgencia}
              />

            </View>
          </View>
        </ScrollView>
        <View style={this.novoPedidoStyle.continuarButtonContainer}>
          <TouchableOpacity
            style={this.novoPedidoStyle.continuarButton}
            onPress={() => {
              this.validaNecessiade();
            }}>
            <Text style={this.novoPedidoStyle.continuarButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
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
    continuarButtonContainer: {
      marginVertical: 10,
      width: '100%', height: 45,
      alignItems: 'center', justifyContent: 'center'
    },
    continuarButton:
    {
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    continuarButtonText:
    {
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
    modalErrosBotaoContinuar: {
      marginTop: 40, marginBottom: 10,
      width: 320, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    selectUrgenciaContainer: {
      height: 60, borderWidth: 2,
      borderColor: colors.verdeFinddo,
      marginTop: 10
    }
  });
}
