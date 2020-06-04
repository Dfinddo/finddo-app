import React, {Component} from "react";
import {
	Text, TextInput,
	View,
	Image, TouchableOpacity,
	Modal,
	ScrollView, SectionList,
	ImageBackground,
} from "react-native";
import CustomPicker from "../../../components/custom-picker";
import PedidoCorrenteService from "../../../services/pedido-corrente-service";
import {styles} from "./styles";

export default class NovoPedido extends Component {

	public props: any;

	public setState: any;

	public navigation: any;

	public necessidade: any;

	public urgencia: any;

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.item.name}`,
		headerBackTitle: "Voltar",
	});

	state = {
		necessidade: "",
		categoriaPedido: null,
		urgencia: urgenciaValues[0].value,
		categoriasImages: [
			{id: "1", name: "Hidráulica", image_url: require("../../../img/jacek-dylag-unsplash.png")},
			{id: "2", name: "Elétrica", image_url: require("../../../img/eletrica.png")},
			{id: "3", name: "Pintura", image_url: require("../../../img/pintura.png")},
			{id: "4", name: "Ar condicionado", image_url: require("../../../img/ar-condicionado.png")},
			{id: "5", name: "Instalações", image_url: require("../../../img/instalacao.png")},
			{id: "6", name: "Pequenas reformas", image_url: require("../../../img/peq-reforma.png")},
			{id: "7", name: "Consertos em geral", image_url: require("../../../img/consertos.png")},
		],
		imageServicoUrl: require("../../../img/jacek-dylag-unsplash.png"),
		formInvalid: false,
		formErrors: [],
		confirmarEmergencia: false,
	};

	public componentDidMount() {

		const {navigation} = this.props;
		const categoria = navigation.getParam("item", "NO-ID");
		const categoriaSelecionada = this.state.categoriasImages.find(cat => cat.id === categoria.id);

		this.setState({imageServicoUrl: categoriaSelecionada.image_url, categoriaPedido: categoria});
		this.obtemDadosPedidoCorrente();

	}

	obtemDadosPedidoCorrente = () => {

		const pedidoService = PedidoCorrenteService.getInstance();

		const {necessidade, urgencia} = pedidoService.getPedidoCorrente();

		if (necessidade && urgencia)
			this.setState({necessidade, urgencia});

	}

	setUrgencia = ({value}) => {

		this.setState({urgencia: value});

	};

	validaNecessiade = () => {

		const errosArr = [];

		const necessidadeErrors = [];
		const urgenciaErrors = [];

		if (this.state.necessidade.length === 0)
			necessidadeErrors.push("É obrigatório.");
		else if (this.state.necessidade.length < 5)
			necessidadeErrors.push("Precisa ter pelo menos 5 caracteres.");
		else if (this.state.necessidade.length > 10000)
			necessidadeErrors.push("Tamanho máximo 10000 caracteres.");


		if (this.state.urgencia === "")
			urgenciaErrors.push("Por favor informe o grau de urgência para a realização do serviço.");


		if (necessidadeErrors.length > 0)
			errosArr.push({title: "Descrição", data: necessidadeErrors});

		if (urgenciaErrors.length > 0)
			errosArr.push({title: "Urgência", data: urgenciaErrors});


		if (errosArr.length > 0) {

			this.setState({formErrors: [...errosArr]});
			this.setState({formInvalid: true});

		} else if (this.state.urgencia === "definir-data")
			this.setState({confirmarEmergencia: true});
		else if (this.state.urgencia === "semana") {

			this.adicionarMotivoEUrgenciaAoPedido();
			this.props
				.navigation.navigate("DefinirData",
					{
						necessidade: this.state.necessidade,
						categoriaPedido: this.state.categoriaPedido,
						urgencia: this.state.urgencia,
					});

		}

	}

	adicionarMotivoEUrgenciaAoPedido = () => {

		const pedidoService = PedidoCorrenteService.getInstance();
		const pedido = pedidoService.getPedidoCorrente();

		pedido.necessidade = this.state.necessidade;
		pedido.urgencia = this.state.urgencia;

		pedidoService.setPedidoCorrente(pedido);

	}

	public render() {

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("../../../img/Ellipse.png")}>
				<ScrollView>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.formInvalid}
					>
						<View style={styles.modalBase}>
							<View style={styles.modalDialog}>
								<View style={styles.modalDialogContent}>
									<Text style={styles.modalErrosTitulo}>Erros:</Text>
									<SectionList
										style={styles.modalErrosSectionList}
										sections={this.state.formErrors}
										keyExtractor={(item, index) => item + index}
										renderItem={({item}) => <Item title={item} />}
										renderSectionHeader={({section: {title}}) =>
											<Text style={styles.modalErrosTituloErro}>{title}</Text>
										}
									/>
									<TouchableOpacity
										style={styles.modalErrosBotaoContinuar}
										onPress={() => this.setState({formInvalid: false})}>
										<Text style={styles.continuarButtonText}>VOLTAR</Text>
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
						<View style={styles.modalBase}>
							<View style={styles.modalDialog}>
								<View style={styles.modalDialogContent}>
									<Text> </Text>
									<Text style={{paddingHorizontal: 10, fontSize: 18}}>Faremos o máximo possível para lhe atender o quanto antes.</Text>
									<Text style={{paddingHorizontal: 10, fontSize: 18}}>Por favor nos informe uma data e uma faixa de horário ideais para o atendimento.</Text>
									<TouchableOpacity
										style={styles.modalErrosBotaoContinuar}
										onPress={() => this.setState({confirmarEmergencia: false}, () => {

											this.adicionarMotivoEUrgenciaAoPedido();
											this.props
												.navigation.navigate("DefinirData",
													{
														necessidade: this.state.necessidade,
														categoriaPedido: this.state.categoriaPedido,
														urgencia: this.state.urgencia,
													});

										})}>
										<Text style={styles.continuarButtonText}>CONTINUAR</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<View style={styles.pedidoForm}>
						<Image
							style={{width: "100%"}}
							source={this.state.imageServicoUrl} />
						<View style={[{width: "100%"}, styles.horizontalPadding]}>
							<TextInput
								style={styles.pedidoFormSizeAndFont}
								multiline={true}
								placeholder="Nos conte o que precisa, ex.: Minha pia entupiu..."
								onChangeText={necessidade => this.setState({necessidade})}
								value={this.state.necessidade}
							/>

							<CustomPicker
								style={styles.selectUrgenciaContainer}
								items={urgenciaValues}
								defaultItem={urgenciaValues
									.find(urg => urg.value === this.state.urgencia)}
								onSelect={this.setUrgencia}
							/>

						</View>
					</View>
				</ScrollView>
				<View style={styles.continuarButtonContainer}>
					<TouchableOpacity
						style={styles.continuarButton}
						onPress={() => {

							this.validaNecessiade();

						}}>
						<Text style={styles.continuarButtonText}>CONTINUAR</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);

	}

}

function Item({title}) {

	return (
		<View>
			<Text style={{fontSize: 18}}>{"\t"}{title}</Text>
		</View>
	);

}

const urgenciaValues = [
	{content: "Necessidade do serviço", value: "", id: "0"},
	{content: "Com urgência", value: "definir-data", id: "1"},
	{content: "Sem urgência", value: "semana", id: "2"},
];
