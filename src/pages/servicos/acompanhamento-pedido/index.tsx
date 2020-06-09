import React, {Component} from "react";
import {
	View, Text,
	ScrollView, ImageBackground,
	TouchableOpacity,
	ActivityIndicator, Modal, Alert,
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

				console.log(response)
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

		if (this.state.pedido) {

			return (
				<ImageBackground
					style={{width: "100%", height: "100%"}}
					source={require("../../../img/Ellipse.png")}>
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
										<View style={{height: 80, width: 3}} />
										<View
											style={{height: 120, zIndex: 10}}>
											<Accordian
												pedido={this.state.pedido}
												conteudo="A caminho"
												estadoInicial="a_caminho"
												ref={this.aCaminhoD} />
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

						const tokenService = TokenService.getInstance();

						if (tokenService.getUser().user_type === "professional") {

							return (
								<View style={styles.acompanhamentoBotaoContainer}>
									<TouchableOpacity style={styles.acompanhamentoBotao} onPress={() => this.atualizarStatus(this.state.pedido)}>
										<Text style={styles.corBotao}>{this.state.estadoAtual === "a_caminho" ? "Estou na casa do cliente" : this.state.acaoBotao}</Text>
									</TouchableOpacity>
								</View>);

						}

						if (["analise", "a_caminho"].includes(this.state.estadoAtual)) {

							return (
								<View style={styles.acompanhamentoBotaoContainer}>
									<TouchableOpacity style={styles.acompanhamentoBotao} onPress={() => this.atualizarStatus({...this.state.pedido, order_status: "cancelado"})}>
										<Text style={styles.corBotao}>Cancelar</Text>
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