import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity,
  Text,
  View, ImageBackground, Modal
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { colors } from '../../colors';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomPicker } from '../../components/custom-picker';

const horariosParaAtendimento = [
  { content: '--:--', value: '--:--', id: '0' },
  { content: '09:00', value: '09:00', id: '1' },
  { content: '09:30', value: '09:30', id: '2' },
  { content: '10:00', value: '10:00', id: '3' },
  { content: '10:30', value: '10:30', id: '4' },
  { content: '11:00', value: '11:00', id: '5' },
  { content: '11:30', value: '11:30', id: '6' },
  { content: '12:00', value: '12:00', id: '7' },
  { content: '12:30', value: '12:30', id: '8' },
  { content: '13:00', value: '13:00', id: '9' },
  { content: '13:30', value: '13:30', id: '10' },
  { content: '14:00', value: '14:00', id: '11' },
  { content: '14:30', value: '14:30', id: '12' },
  { content: '15:00', value: '15:00', id: '13' },
  { content: '15:30', value: '15:30', id: '14' },
  { content: '16:00', value: '16:00', id: '15' },
  { content: '16:30', value: '16:30', id: '16' },
  { content: '17:00', value: '17:00', id: '17' },
  { content: '17:30', value: '17:30', id: '18' },
];

export default class DataServico extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.categoriaPedido.name}`,
  });

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: '',
      hora: "--:--",
      horarios: horariosParaAtendimento.slice(0, horariosParaAtendimento.length - 1),
      horaDefinida: false,
      horaFim: "10:00",
      horariosFim: horariosParaAtendimento.slice(1),
      necessidade: null,
      categoriaPedido: null,
      urgencia: '',
      formInvalid: false,
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
    this.scrollView.scrollToEnd({ animated: true });
    this.setState({
      selectedStartDate: `${date._i.day}/${+date._i.month + 1}/${date._i.year}`,
    });
  }

  setHora = (hora) => {
    this.setState({ hora: hora.value, horaDefinida: false }, () => {
      if (hora.value !== '--:--') {
        const horaIndex = horariosParaAtendimento.indexOf(hora);
        const horariosFim = horariosParaAtendimento.slice(horaIndex + 1);

        this.setState({ horariosFim, horaDefinida: true });
      }
    });
  }

  validarDataPedido = () => {
    if (!!this.state.selectedStartDate === false || this.state.hora === '--:--') {
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
        <ScrollView ref={(view) => {
          this.scrollView = view;
        }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.formInvalid}
          ><View
            style={this.dataStyles.modalDialogContainer}>
              <View style={this.dataStyles.modalDialogContent}>
                <Text style={this.dataStyles.modalErrosTitulo}>Erros:</Text>
                <Text style={this.dataStyles.modalErrosContent}>
                  {'Por favor defina uma data e uma faixa horário de preferência.'}
                </Text>
                <TouchableOpacity
                  style={this.dataStyles.modalErrosVoltarButton}
                  onPress={() => this.setState({ formInvalid: false })}>
                  <Text style={{ fontSize: 18, color: colors.branco }}>VOLTAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={{
            flex: 1, alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <View style={this.dataStyles.container}>
              <CalendarPicker
                onDateChange={this.onDateChange}
                weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
                months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
                  'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                previousTitle="Anterior" nextTitle="Próximo"
                todayBackgroundColor={colors.cinza} selectedDayColor={colors.verdeFinddo}
                minDate={initialDate} maxDate={finalDate}
              />
            </View>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ fontSize: 18, marginHorizontal: 10, width: 280 }}>
                {'Escolha a melhor data e faixa de horário para seu atendimento:'}
              </Text>
              <Text style={{ fontSize: 18, marginHorizontal: 10, marginTop: 10 }}>
                {this.state.selectedStartDate}
              </Text>
            </View>
            <View style={this.dataStyles.definirDataHoraContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>Entre:</Text>
              </View>
              <CustomPicker
                style={this.dataStyles.selectStyle}
                items={this.state.horarios}
                onSelect={this.setHora}
              />
              {(() => {
                if (this.state.horaDefinida) {
                  return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 18 }}>E:</Text>
                    </View>);
                } else { return (null); }
              })()}
              {(() => {
                if (this.state.horaDefinida) {
                  return (
                    <CustomPicker
                      style={this.dataStyles.selectStyle}
                      items={this.state.horariosFim}
                      onSelect={({ value }) => this.setState({ horaFim: value })}
                    />);
                } else {
                  return (null);
                }
              })()}
            </View>
          </View>
        </ScrollView>
        <View style={{ marginVertical: 10, alignItems: 'center' }}>
          <TouchableOpacity
            style={this.dataStyles.continuarButton}
            onPress={() => this.validarDataPedido()}>
            <Text style={this.dataStyles.continuarButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
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
      borderRadius: 20, backgroundColor: colors.verdeFinddo,
      alignItems: 'center', justifyContent: 'center'
    },
    continuarButtonText:
    {
      fontSize: 18, color: colors.branco,
      textAlign: 'center'
    },
    modalDialogContainer: {
      flex: 1, alignItems: 'center',
      justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
    },
    modalDialogContent: {
      backgroundColor: colors.branco, width: 340,
      borderRadius: 18, opacity: 1,
      alignItems: 'center'
    },
    modalErrosTitulo: { fontWeight: 'bold', textAlign: 'center', fontSize: 24 },
    modalErrosContent: {
      fontSize: 18, marginVertical: 10
    },
    modalErrosVoltarButton: {
      width: 320, height: 45,
      backgroundColor: colors.verdeFinddo, alignItems: 'center',
      justifyContent: 'center', borderRadius: 20,
      marginBottom: 10
    },
    definirDataHoraContainer: {
      marginTop: 30, width: 340,
      height: 55, flexDirection: 'row',
      alignContent: 'center', justifyContent: 'space-around'
    }
  });
}