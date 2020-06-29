import React, {Component, useState} from "react";
import {
	View, Text,
	ScrollView, ImageBackground,
	TouchableOpacity,
	ActivityIndicator, Modal, Alert, Linking, Platform, KeyboardAvoidingView, TextInput,
} from "react-native";
import {colors} from "../../../colors";
import StatusPedidoStep from "../../../components/status-pedido-step";
import StatusPedidoDescricao from "../../../components/status-pedido-descricao";
import Accordian from "../../../components/accordion-pedido";
import {StackActions, NavigationActions, NavigationEvents} from "react-navigation";
import TokenService from "../../../services/token-service";
import backendRails from "../../../services/backend-rails-api";
import {styles} from "./styles";

export default class AcompanhamentoPedido extends Component {

	public pedidoEmAnalise: any;

	public aCaminho: any;

	public emServico: any;

	public pedidoEmAnaliseD: any;

	public aCaminhoD: any;

	public emServicoD: any;

	public setState: any;

	public props: any;

	public navigation: any;

	static navigationOptions = {
		title: "Acompanhe seu pedido",
		headerLeft: () => null,
		headerBackTitle: "Voltar",
	};

	public constructor(props) {

		super(props);

		/* marcadores */
		this.pedidoEmAnalise = React.createRef();
		this.aCaminho = React.createRef();
		this.emServico = React.createRef();

		/* descricao */
		this.pedidoEmAnaliseD = React.createRef();
		this.aCaminhoD = React.createRef();
		this.emServicoD = React.createRef();

	}

	public state = {
		estadoAtual: "analise",
		acaoBotao: "PRÓXIMO",
		pedido: null,
		loadingData: false,
		isMakingBudget: false,
	};

	private obterPedido = () => {

		this.setState({loadingData: false}, () => {

			try {

				const {navigation} = this.props;
				const pedido = navigation.getParam("pedido", null);

				if (pedido) {

					if (pedido.price > 0) {

						setTimeout(() => {

							this.setState({loadingData: false}, () => {

								const resetAction = StackActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({routeName: "Acompanhamento", params: {pedido}})],
								});

								this.props.navigation.dispatch(resetAction);

							});

						}, 1000);

					} else {

						setTimeout(() => {

							this.setState({pedido, estadoAtual: pedido.order_status, loadingData: false}, () => this.atualizaStatus());

						}, 1000);

					}

				} else
					setTimeout(() => this.setState({loadingData: false}), 1000);

			} catch {

				setTimeout(() => this.setState({loadingData: false}), 1000);

			}

		});

	};

	private atualizaStatus = () => {

		if (this.state.estadoAtual === "analise") {

			this.setState({estadoAtual: "analise"}, () => {

				this.setStatusAtual("analise", this.pedidoEmAnalise);

			});

		} else if (this.state.estadoAtual === "a_caminho") {

			this.setState({estadoAtual: "a_caminho"}, () => {

				this.setStatusAtual("a_caminho", this.pedidoEmAnalise);
				this.setStatusAtual("a_caminho", this.aCaminho);

			});

		} else if (this.state.estadoAtual === "em_servico") {

			this.setState({estadoAtual: "em_servico"}, () => {

				this.setStatusAtual("em_servico", this.pedidoEmAnalise);
				this.setStatusAtual("em_servico", this.aCaminho);
				this.setStatusAtual("em_servico", this.emServico);

			});

		} else if (this.state.estadoAtual !== "cancelado") {

			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({routeName: "Cobranca", params: {pedido: this.state.pedido}})],
			});

			this.props.navigation.dispatch(resetAction);

		}

	}

	setStatusAtual = (status, statusComponentRef) => {

		this.pedidoEmAnaliseD.current.setEstadoAtual(status);
		this.aCaminhoD.current.setEstadoAtual(status);
		this.emServicoD.current.setEstadoAtual(status);

		statusComponentRef.current.setEtapaAtiva();
		statusComponentRef.current.setStepConcluido();

	}

	private closeModal = () => this.setState({isMakingBudget: false});

	private atualizarStatus = async pedido => {

		let novoStatus = "";

		switch (pedido.order_status) {

			case "cancelado":
				novoStatus = "cancelado";
				break;
			case "analise":
				novoStatus = "a_caminho";
				break;
			case "a_caminho":
				novoStatus = "em_servico";
				break;
			case "em_servico":
				this.props.navigation.navigate("Cobranca", {pedido: this.state.pedido});

				return;
			default:
				break;

		}

		try {

			const tokenService = TokenService.getInstance();
			let response = {};

			const novoPedido = this.state.pedido;

			if (novoStatus) {

				novoPedido.order_status = novoStatus;

				response = await backendRails
					.put(`/orders/${novoPedido.id}`, {order: novoPedido},
						{headers: tokenService.getHeaders()});

				console.log(response);
				this.setState({pedido: response.data, estadoAtual: response.data.order_status}, () => {

					this.atualizaStatus();

				});

			} else
				this.atualizaStatus();

		} catch (error) {

			if (error.response) {


				/*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
				Alert.alert(
					"Erro",
					"Verifique sua conexão e tente novamente",
					[{text: "OK", onPress: () => { }}],
					{cancelable: false},
				);

			} else if (error.request) {


				/*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
					[{text: "OK", onPress: () => { }}],
					{cancelable: false},
				);

			} else {

				/* Something happened in setting up the request and triggered an Error */
			}

		}

	}

	public render() {

		const isProfessional = TokenService.getInstance().getUser().user_type === "professional";

		if (this.state.pedido) {

			return (
				<ImageBackground
					style={{width: "100%", height: "100%", justifyContent: "center"}}
					source={require("../../../img/Ellipse.png")}>
					<ProporValorModal
						isMakingBudget={this.state.isMakingBudget}
						pedido={this.state.pedido}
						closeModal={this.closeModal}
					/>
					<View style={{height: "90%"}}>
						<NavigationEvents
							onWillFocus={_ => this.obterPedido()}
							// onDidFocus={payload => console.log('did focus', payload)}
							// onWillBlur={payload => console.log('will blur', payload)}
							// onDidBlur={payload => console.log('did blur', payload)}
						/>
						<ScrollView style={{
							flex: 1,
						}}>
							<Modal
								animationType="slide"
								transparent={true}
								visible={this.state.loadingData}
							>
								<View style={{
									flex: 1,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "rgba(255,255,255,0.5)",
								}}>
									<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
								</View>
							</Modal>{ this.state.pedido.order_status === "cancelado" ?
								<Text style={{
									paddingHorizontal: 20,
									fontSize: 18,
									paddingTop: 20,
								}}>Pedido Cancelado</Text> :
								<View style={styles.acompanhamentoContainer}>
									<View
										style={styles.acompanhamentoPontosContainer}>
										<StatusPedidoStep
											ref={this.pedidoEmAnalise}
											hasMarginTop={true}
											verticalBarVisibility="flex">
										</StatusPedidoStep>
										<StatusPedidoStep
											ref={this.aCaminho}
											verticalBarVisibility="flex">
										</StatusPedidoStep>
										<StatusPedidoStep
											ref={this.emServico}
											verticalBarVisibility="none">
										</StatusPedidoStep>
									</View>
									<View
										style={styles.acompanhamentoConteudoContainer}>
										<StatusPedidoDescricao
											ref={this.pedidoEmAnaliseD}
											hasMarginTop={true}
											conteudo="Pedido em análise"
											estadoInicial="analise" />
										<View style={{height: isProfessional ? 68 : 80, width: 3}} />
										<View style={{height: isProfessional ? 130 : 115, zIndex: 10}}>
											{isProfessional ?

												<StatusPedidoDescricao
													ref={this.aCaminhoD}
													hasMarginTop={true}
													conteudo="A caminho"
													estadoInicial="a_caminho" /> :

												<Accordian
													pedido={this.state.pedido}
													conteudo="A caminho"
													estadoInicial="a_caminho"
													ref={this.aCaminhoD} />
											}
										</View>
										<StatusPedidoDescricao
											ref={this.emServicoD}
											conteudo="Serviço em Execução"
											estadoInicial="em_servico" />
									</View>
								</View>}
						</ScrollView>
					</View>
					{(() => {

						if (isProfessional) {

							return (
								<View style={styles.acompanhamentoBotaoContainer}>
									{
										this.state.estadoAtual === "a_caminho" &&
										<TouchableOpacity style={styles.acompanhamentoBotao} onPress={() => this.setState({isMakingBudget: true})}>
											<Text style={styles.corBotao}>Orçar previamente</Text>
										</TouchableOpacity>
									}
									<TouchableOpacity style={styles.acompanhamentoBotao} onPress={() => this.atualizarStatus(this.state.pedido)}>
										<Text style={styles.corBotao}>{
											this.state.estadoAtual === "a_caminho" ?
												"Estou na casa do cliente" :
												this.state.estadoAtual === "em_servico" ?
													"Fazer orçamento" :
													this.state.acaoBotao}</Text>
									</TouchableOpacity>
								</View>);

						}

						if (this.state.estadoAtual === "analise") {

							return (
								<View style={styles.acompanhamentoBotaoContainer}>
									<TouchableOpacity style={styles.acompanhamentoBotao} onPress={() => this.atualizarStatus({...this.state.pedido, order_status: "cancelado"})}>
										<Text style={styles.corBotao}>Cancelar</Text>
									</TouchableOpacity>
								</View>);

						}

						if (this.state.estadoAtual === "a_caminho") {

							return (
								<View style={styles.acompanhamentoBotaoContainer}>
									<TouchableOpacity style={styles.acompanhamentoBotao} onPress={openChat}>
										<Text style={styles.corBotao}>Solicitar Cancelamento</Text>
									</TouchableOpacity>
								</View>);

						}

						return null;

					})()}
				</ImageBackground>
			);

		}

		return (
			<ImageBackground
				style={{width: "100%", height: "100%"}}
				source={require("../../../img/Ellipse.png")}>
				<View style={{height: "90%"}}>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.loadingData}
					>
						<View style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "rgba(255,255,255,1)",
						}}>
							<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
						</View>
					</Modal>
					<NavigationEvents
						onWillFocus={_ => this.obterPedido()}
						// onDidFocus={payload => console.log('did focus', payload)}
						// onWillBlur={payload => console.log('will blur', payload)}
						// onDidBlur={payload => console.log('did blur', payload)}
					/>
					<View>
						<Text style={{
							paddingHorizontal: 20,
							fontSize: 18,
							paddingTop: 20,
						}}>Não há pedido ativo, selecione um pedido em andamento na aba Pedidos para acompanhar seu estado.</Text>
					</View>
				</View>
			</ImageBackground>
		);

	}

}

const openChat = (): void => {

	// TODO: remover esse telefone e colocar nos environments
	const PHONE = 5521968649388;
	const url = `whatsapp://send?text=&phone=${PHONE}`;

	Linking.openURL(url).catch(() => {

		Alert.alert(
			"Erro",
			"Whatsapp não instalado no seu dispositivo",
			[{text: "OK", onPress: () => void 0}],
			{cancelable: false},
		);

	});

};


const formatarValorServico = valor => `R$ ${String((Math.round((valor + Number.EPSILON) * 100) / 100).toFixed(2))}`;
const ProporValorModal = props => {

	const [valor, setValor] = useState("0");
	const [valorComTaxa, setValorComTaxa] = useState("0");
	const [valorTaxa, setValorTaxa] = useState("0");

	const calcularValorServico = valor => {

		const valorServico = Number(valor);
		const valorComTaxa = valorServico * (valorServico < 80 ? 1.25 : valorServico < 500 ? 1.2 : 1.15);

		setValor(valor);
		setValorComTaxa(valorComTaxa);
		setValorTaxa(valorComTaxa - valorServico);

		return valorComTaxa;

	};


	return (
		<Modal visible={props.isMakingBudget} style={{width: "100%"}}>
			<View
				style={{alignItems: "center", justifyContent: "center", paddingTop: 120}}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}>
					<Text style={styles.fontTitle}>Orçar</Text>
					<TextInput
						style={styles.loginFormSizeAndFont}
						placeholder="Valor do serviço"
						keyboardType="number-pad"
						onChangeText={calcularValorServico}
						value={valor}
					/>
					<TextInput
						style={styles.loginFormSizeAndFont}
						placeholder="Total a ser cobrado"
						value={formatarValorServico(valorComTaxa)}
						editable={false}
					/>
				</KeyboardAvoidingView>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={() => {

						if (!valor || valorComTaxa < 0) {

							Alert.alert(
								"Finddo",
								"Por favor defina um valor para o pedido",
								[{text: "OK", onPress: () => void 0}],
								{cancelable: false},
							);

						} else {

							const order = props.pedido;

							Alert.alert(
								"Finddo",
								`Confirma o valor ${formatarValorServico(valorComTaxa)}?`,
								[
									{text: "Cancelar", onPress: () => void 0},
									{text: "OK",
										onPress: async() => {

											props.closeModal();

											try {

												await backendRails
													.post("/orders/propose_budget",
														{id: props.pedido.id, budget: valorComTaxa},
														{headers: TokenService.getInstance().getHeaders()});

												Alert.alert("Proposta enviada");

											} catch (error) {

												console.log({error, payload: {id: props.pedido.id, budget: valorComTaxa}, headers: TokenService.getInstance().getHeaders()})
												Alert.alert("Erro ao enviar proposta");

											}


										}},
								],
								{cancelable: false},
							);

						}

					}}>
					<Text style={styles.loginButtonText}>Propor Orçamento</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={props.closeModal}>
					<Text style={styles.loginButtonText}>Voltar</Text>
				</TouchableOpacity>
			</View>
		</Modal>);

};

Object.assign(styles, {
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	backgroundImageContent: {width: "100%", height: "100%"},
	finddoLogoStyle: {marginTop: 60, marginBottom: 120},
	loginForm: {flex: 1, alignItems: "center", justifyContent: "center"},
	loginMainForm: {flex: 1, alignItems: "center", justifyContent: "center", width: 340, height: 250, backgroundColor: colors.branco},
	loginButton: {
		marginTop: 10,
		width: 340,
		height: 45,
		borderRadius: 20,
		backgroundColor: colors.verdeFinddo,
		alignItems: "center",
		justifyContent: "center",
	},
	loginButtonText: {
		fontSize: 18, color: colors.branco, textAlign: "center",
	},
	loginFormSizeAndFont:
	{
		fontSize: 18,
		height: 45,
		borderBottomColor: colors.verdeFinddo,
		borderBottomWidth: 2,
		textAlign: "left",
		width: 300,
	},
	loginEsqueciSenha:
	{
		fontSize: 18,
		height: 45,
		textAlign: "center",
		width: 300,
		textDecorationLine: "underline",
		textAlignVertical: "bottom",
	},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	cadastreSe: {fontWeight: "bold", textDecorationLine: "underline"},
});
