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
    necessidade: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque condimentum maximus scelerisque. Nullam odio ante, tincidunt non nulla ut, suscipit posuere odio. Integer rutrum lacus sit amet vehicula faucibus. Praesent sit amet urna fringilla, rutrum justo id, pharetra turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus ut varius velit.

Sed gravida fermentum consectetur. Proin iaculis dapibus ultricies. Ut quis dolor eget sem commodo molestie sed eget purus. Quisque mattis tellus eget gravida fermentum. Duis suscipit nec ligula at aliquet. Vestibulum id lectus feugiat, rutrum lorem sit amet, eleifend ante. Pellentesque a tristique velit. Proin dignissim suscipit nulla ut finibus. Etiam ut arcu ullamcorper, feugiat metus ac, facilisis sapien. Aenean nec fringilla leo. Nullam varius dui sit amet urna laoreet molestie. Duis quis ante vitae ex varius viverra et quis ligula. Duis leo quam, feugiat in interdum at, aliquam a elit. Suspendisse mattis laoreet mauris in faucibus. Vestibulum velit erat, ullamcorper nec accumsan in, iaculis eget erat. Praesent orci mi, vestibulum eu purus vitae, accumsan aliquam magna.

In hac habitasse platea dictumst. In hac habitasse platea dictumst. Mauris rhoncus aliquet porttitor. Suspendisse nulla nulla, mollis sed eros gravida, vestibulum tempus tellus. Cras vulputate justo mauris, consequat porttitor est pulvinar non. Nulla dapibus neque quis lectus accumsan pellentesque. Nunc lobortis mi nisi, ut commodo erat malesuada vel. Aliquam id nisi quis risus sagittis blandit. Maecenas lectus diam, consequat a turpis eu, efficitur sagittis enim.

Curabitur sagittis auctor nibh et mollis. Donec ac posuere ipsum. Quisque lacinia in magna non aliquet. In quam turpis, hendrerit nec urna quis, lacinia rhoncus dolor. Duis nec orci ante. Nulla ex orci, feugiat tristique aliquam in, pellentesque id magna. Curabitur fermentum vestibulum eleifend. Quisque sodales fringilla ante eget iaculis. Pellentesque eget mauris sollicitudin, sollicitudin mi in, varius odio. Maecenas vulputate congue est, ac pretium odio vulputate quis. Morbi tempor felis dolor, et mollis nisi eleifend nec.

Suspendisse dignissim a turpis vitae laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed consectetur turpis non egestas semper. Aenean sed pretium sem, eget tincidunt nunc. Ut fermentum sed nibh sed tempor. Nam aliquam justo nec convallis porttitor. Suspendisse felis neque, interdum non purus non, gravida finibus nunc. Morbi eu mi faucibus, ultrices dui nec, consectetur orci. Cras enim ligula, commodo id varius eu, varius et magna. Duis sit amet nulla eget sem placerat vulputate vitae in arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi in libero id eros blandit aliquet. In sed nisl in velit condimentum vestibulum. Praesent vel sollicitudin turpis. Etiam vestibulum consequat turpis vel sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    `,
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
          {
            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
            urgencia: this.state.urgencia
          });
    } else if (this.state.urgencia === 'semana') {
      this.props
        .navigation.navigate('FotosPedido',
          {
            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
            dataPedido: new Date(), urgencia: this.state.urgencia
          });
    } else {
      this.props
        .navigation.navigate('FotosPedido',
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
      marginTop: 20,
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
