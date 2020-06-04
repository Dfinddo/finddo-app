import React, {Component} from "react";
import {
	TouchableOpacity, Text,
	View, ImageBackground, Modal,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {colors} from "../../../colors";
import {ScrollView} from "react-native-gesture-handler";
import CustomPicker from "../../../components/custom-picker";
import PedidoCorrenteService from "../../../services/pedido-corrente-service";
import {styles} from "./styles";

export default class DataServico extends Component {

	public state: any;

	public props: any;

	public setState: any;

	public scrollView: any;

	public navigation: any;

	public dataPedido: any;

	public hora: any;

	public horaFim: any;

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.categoriaPedido.name}`,
		headerBackTitle: "Voltar",
	});

	constructor(props) {

		super(props);
		this.state = {
			selectedStartDate: "",
			selectedDate: null,
			hora: "--:--",
			horarios: horariosParaAtendimento.slice(0, horariosParaAtendimento.length - 1),
			horaDefinida: false,
			horaFim: "10:00",
			horariosFim: horariosParaAtendimento.slice(1),
			necessidade: null,
			categoriaPedido: null,
			urgencia: "",
			formInvalid: false,
		};
		this.onDateChange = this.onDateChange.bind(this);

	}

	componentDidMount() {

		const {navigation} = this.props;
		const necessidade = navigation.getParam("necessidade", "no necessidade");
		const categoriaPedido = navigation.getParam("categoriaPedido", "no categoria");
		const urgencia = navigation.getParam("urgencia", "no urgencia");

		const pedidoService = PedidoCorrenteService.getInstance();
		const {dataPedido, hora, horaFim} = pedidoService.getPedidoCorrente();

		if (dataPedido && hora && horaFim) {

			const dateJoin = `${dataPedido.getDate()}/${dataPedido.getMonth() + 1}/${dataPedido.getFullYear()}`;

			this.setState({
				necessidade,
				categoriaPedido,
				urgencia,
				hora,
				horaFim,
				selectedStartDate: dateJoin,
				horaDefinida: true,
				selectedDate: dataPedido,
			}, () => {

				setTimeout(() => this.scrollView.scrollToEnd({animated: true}), 500);

			});

		} else
			this.setState({necessidade, categoriaPedido, urgencia});

	}

	onDateChange(date) {

		this.scrollView.scrollToEnd({animated: true});
		this.setState({
			selectedStartDate: `${date._i.day}/${Number(date._i.month) + 1}/${date._i.year}`,
		});

	}

	setHora = hora => {

		this.setState({hora: hora.value, horaDefinida: false}, () => {

			if (hora.value !== "--:--") {

				const horaIndex = horariosParaAtendimento.indexOf(hora);
				const horariosFim = horariosParaAtendimento.slice(horaIndex + 1);

				this.setState({horaFim: horariosFim[0].value, horariosFim, horaDefinida: true});

			}

		});

	}

	validarDataPedido = () => {

		if (Boolean(this.state.selectedStartDate) === false || this.state.hora === "--:--")
			this.setState({formInvalid: true});
		else {

			const dateSplit = this.state.selectedStartDate.split("/");

			this.setDataHorarioPedido();
			this.props
				.navigation.navigate("FotosPedido",
					{
						necessidade: this.state.necessidade,
						categoriaPedido: this.state.categoriaPedido,
						dataPedido: new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`),
						urgencia: this.state.urgencia,
						hora: this.state.hora,
						horaFim: this.state.horaFim,
					});

		}

	}

	setDataHorarioPedido = () => {

		const dateSplit = this.state.selectedStartDate.split("/");
		const pedidoService = PedidoCorrenteService.getInstance();
		const pedido = pedidoService.getPedidoCorrente();

		pedido.dataPedido = new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`);
		pedido.hora = this.state.hora;
		pedido.horaFim = this.state.horaFim;

	}

	render() {

		const initialDate = new Date();
		const finalDate = new Date();

		finalDate.setDate(initialDate.getDate() + 6);

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("../../../img/Ellipse.png")}>
				<ScrollView ref={view => {

					this.scrollView = view;

				}}>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.formInvalid}
					><View
							style={styles.modalDialogContainer}>
							<View style={styles.modalDialogContent}>
								<Text style={styles.modalErrosTitulo}>Erros:</Text>
								<Text style={styles.modalErrosContent}>
									{"Por favor defina uma data e uma faixa horário de preferência."}
								</Text>
								<TouchableOpacity
									style={styles.modalErrosVoltarButton}
									onPress={() => this.setState({formInvalid: false})}>
									<Text style={{fontSize: 18, color: colors.branco}}>VOLTAR</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
					<View style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
						<View style={styles.container}>
							<CalendarPicker
								onDateChange={this.onDateChange}
								weekdays={["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]}
								months={[
									"Janeiro",
									"Fevereiro",
									"Março",
									"Abril",
									"Maio",
									"Junho",
									"Julho",
									"Agosto",
									"Setembro",
									"Outubro",
									"Novembro",
									"Dezembro",
								]}
								previousTitle="Anterior" nextTitle="Próximo"
								todayBackgroundColor={colors.cinza} selectedDayColor={colors.verdeFinddo}
								minDate={initialDate} maxDate={finalDate} selectedStartDate={this.state.selectedDate}
							/>
						</View>
						<View style={{alignItems: "center", marginTop: 30}}>
							<Text style={{fontSize: 18, marginHorizontal: 10, width: 280}}>
								{"Escolha a melhor data e faixa de horário para seu atendimento:"}
							</Text>
							<Text style={{fontSize: 18, marginHorizontal: 10, marginTop: 10}}>
								{this.state.selectedStartDate}
							</Text>
						</View>
						<View style={styles.definirDataHoraContainer}>
							<View style={{alignItems: "center", justifyContent: "center"}}>
								<Text style={{fontSize: 18}}>Entre:</Text>
							</View>
							<CustomPicker
								style={styles.selectStyle}
								items={this.state.horarios}
								defaultItem={this.state.horarios
									.find(hor => hor.value === this.state.hora)}
								onSelect={this.setHora}
							/>
							{(() => {

								if (this.state.horaDefinida) {

									return (
										<View style={{alignItems: "center", justifyContent: "center"}}>
											<Text style={{fontSize: 18}}>E:</Text>
										</View>);

								}

								return null;

							})()}
							{(() => {

								if (this.state.horaDefinida) {

									return (
										<CustomPicker
											style={styles.selectStyle}
											items={this.state.horariosFim}
											defaultItem={this.state.horarios
												.find(hor => hor.value === this.state.horaFim)}
											onSelect={({value}) => this.setState({horaFim: value})}
										/>);

								}

								return null;

							})()}
						</View>
					</View>
				</ScrollView>
				<View style={{marginVertical: 10, alignItems: "center"}}>
					<TouchableOpacity
						style={styles.continuarButton}
						onPress={() => this.validarDataPedido()}>
						<Text style={styles.continuarButtonText}>CONTINUAR</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);

	}

}

const horariosParaAtendimento = [
	{content: "--:--", value: "--:--", id: "0"},
	{content: "09:00", value: "09:00", id: "1"},
	{content: "09:30", value: "09:30", id: "2"},
	{content: "10:00", value: "10:00", id: "3"},
	{content: "10:30", value: "10:30", id: "4"},
	{content: "11:00", value: "11:00", id: "5"},
	{content: "11:30", value: "11:30", id: "6"},
	{content: "12:00", value: "12:00", id: "7"},
	{content: "12:30", value: "12:30", id: "8"},
	{content: "13:00", value: "13:00", id: "9"},
	{content: "13:30", value: "13:30", id: "10"},
	{content: "14:00", value: "14:00", id: "11"},
	{content: "14:30", value: "14:30", id: "12"},
	{content: "15:00", value: "15:00", id: "13"},
	{content: "15:30", value: "15:30", id: "14"},
	{content: "16:00", value: "16:00", id: "15"},
	{content: "16:30", value: "16:30", id: "16"},
	{content: "17:00", value: "17:00", id: "17"},
	{content: "17:30", value: "17:30", id: "18"},
	{content: "18:00", value: "18:00", id: "19"},
	{content: "18:30", value: "18:30", id: "20"},
	{content: "19:00", value: "19:00", id: "21"},
	{content: "19:30", value: "19:30", id: "22"},
	{content: "20:00", value: "20:00", id: "23"},
	{content: "20:30", value: "20:30", id: "24"},
	{content: "21:00", value: "21:00", id: "25"},
	{content: "21:30", value: "21:30", id: "26"},
];
