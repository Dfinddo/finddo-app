import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity,
  Text, Picker,
  View, ImageBackground, Modal
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { colors } from '../../colors';
import { ScrollView } from 'react-native-gesture-handler';

export default class DataServico extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.categoriaPedido.name}`,
  });

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: '',
      hora: "09:00",
      horaFim: "10:00",
      necessidade: null,
      categoriaPedido: null,
      urgencia: '',
      formInvalid: false
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const necessidade = navigation.getParam('necessidade', 'no necessidade');
    const categoriaPedido = navigation.getParam('categoriaPedido', 'no categoria');
    const urgencia = navigation.getParam('urgencia', 'no urgencia');

    this.setState({ necessidade, categoriaPedido, urgencia });
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: `${date._i.day}/${+date._i.month + 1}/${date._i.year}`,
    });
  }

  validarDataPedido = () => {
    if (!!this.state.selectedStartDate === false) {
      this.setState({ formInvalid: true });
    } else {
      const dateSplit = this.state.selectedStartDate.split('/');
      this.props
        .navigation.navigate('FotosPedido',
          {
            necessidade: this.state.necessidade, categoriaPedido: this.state.categoriaPedido,
            dataPedido: new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`),
            urgencia: this.state.urgencia, hora: this.state.hora,
            horaFim: this.state.horaFim
          });
    }
  }

  render() {
    const initialDate = new Date();
    const finalDate = new Date();
    finalDate.setDate(initialDate.getDate() + 6);
    return (
      <ImageBackground
        style={this.dataStyles.backgroundImageContent}
        source={require('../../img/Ellipse.png')}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.formInvalid}
          ><View
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <View style={this.dataStyles.modalDialogContent}>
                <Text style={this.dataStyles.modalErrosTitulo}>Erros:</Text>
                <Text style={{ fontSize: 18, marginVertical: 10 }}>{'Por favor defina uma data'}</Text>
                <TouchableOpacity style={{
                  width: 320, height: 45,
                  backgroundColor: colors.verdeFinddo, alignItems: 'center',
                  justifyContent: 'center', borderRadius: 20,
                  marginBottom: 10
                }} onPress={() => this.setState({ formInvalid: false })}>
                  <Text style={{ fontSize: 18, color: colors.branco }}>VOLTAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={{
            flex: 1, alignItems: 'center',
            justifyContent: 'flex-start', height: 500,
          }}>
            <View style={this.dataStyles.container}>
              <CalendarPicker
                onDateChange={this.onDateChange}
                weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
                months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                previousTitle="Anterior" nextTitle="Próximo"
                todayBackgroundColor={colors.cinza} selectedDayColor={colors.verdeFinddo}
                minDate={initialDate} maxDate={finalDate}
              />
            </View>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ fontSize: 18 }}>Data Selecionada: {this.state.selectedStartDate}</Text>
            </View>
            <View style={{
              marginTop: 30, width: 340,
              height: 55, flexDirection: 'row',
              alignContent: 'center', justifyContent: 'space-around'
            }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>Início:</Text>
              </View>
              <View
                style={this.dataStyles.selectStyle}>
                <Picker
                  selectedValue={this.state.hora}
                  style={{
                    height: 50, width: '100%'
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ hora: itemValue })
                  }>
                  <Picker.Item label="09:00" value="09:00" />
                  <Picker.Item label="09:30" value="09:30" />
                  <Picker.Item label="10:00" value="10:00" />
                  <Picker.Item label="10:30" value="10:30" />
                  <Picker.Item label="11:00" value="11:00" />
                  <Picker.Item label="11:30" value="11:30" />
                  <Picker.Item label="12:00" value="12:00" />
                  <Picker.Item label="12:30" value="12:30" />
                  <Picker.Item label="13:00" value="13:00" />
                  <Picker.Item label="13:30" value="13:30" />
                  <Picker.Item label="14:00" value="14:00" />
                  <Picker.Item label="14:30" value="14:30" />
                  <Picker.Item label="15:00" value="15:00" />
                  <Picker.Item label="15:30" value="15:30" />
                  <Picker.Item label="16:00" value="16:00" />
                  <Picker.Item label="16:30" value="16:30" />
                  <Picker.Item label="17:00" value="17:00" />
                  <Picker.Item label="17:30" value="17:30" />
                </Picker>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>Fim:</Text>
              </View>
              <View
                style={this.dataStyles.selectStyle}>
                <Picker
                  selectedValue={this.state.horaFim}
                  style={{
                    height: 50, width: '100%'
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ horaFim: itemValue })
                  }>
                  <Picker.Item label="09:00" value="09:00" />
                  <Picker.Item label="09:30" value="09:30" />
                  <Picker.Item label="10:00" value="10:00" />
                  <Picker.Item label="10:30" value="10:30" />
                  <Picker.Item label="11:00" value="11:00" />
                  <Picker.Item label="11:30" value="11:30" />
                  <Picker.Item label="12:00" value="12:00" />
                  <Picker.Item label="12:30" value="12:30" />
                  <Picker.Item label="13:00" value="13:00" />
                  <Picker.Item label="13:30" value="13:30" />
                  <Picker.Item label="14:00" value="14:00" />
                  <Picker.Item label="14:30" value="14:30" />
                  <Picker.Item label="15:00" value="15:00" />
                  <Picker.Item label="15:30" value="15:30" />
                  <Picker.Item label="16:00" value="16:00" />
                  <Picker.Item label="16:30" value="16:30" />
                  <Picker.Item label="17:00" value="17:00" />
                  <Picker.Item label="17:30" value="17:30" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={this.dataStyles.continuarButton}
              onPress={() => this.validarDataPedido()}>
              <Text style={this.dataStyles.continuarButtonText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  dataStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.branco,
      marginTop: 15
    },
    backgroundImageContent: { width: '100%', height: '100%' },
    selectStyle: {
      borderStyle: 'solid', width: 120,
      borderWidth: 2, borderColor: colors.verdeFinddo,
    },
    continuarButton:
    {
      width: 340, height: 45,
      borderRadius: 20, backgroundColor: colors.verdeFinddo
    },
    continuarButtonText:
    {
      textAlignVertical: 'center', height: 45,
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    },
    modalDialogContent: {
      backgroundColor: colors.branco, width: 340,
      borderRadius: 18, opacity: 1,
      alignItems: 'center'
    },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
  });
}