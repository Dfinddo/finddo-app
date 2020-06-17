import React, {Component} from "react";
import {
	ImageBackground, View,
	ScrollView, StyleSheet,
	Text, Image,
	Modal, ActivityIndicator,
	Alert, TouchableOpacity,
	FlatList, TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import {colors} from "../../../colors";
import backendRails, {backendUrl} from "../../../services/backend-rails-api";
import {enumEstadoPedidoMap} from "../../profissional_servicos/index-profissional";
import TokenService from "../../../services/token-service";
import {NavigationActions, StackActions, NavigationEvents} from "react-navigation";
import {star} from "../../../img/svg/star";
import {SvgXml} from "react-native-svg";
import {starSolid} from "../../../img/svg/star-solid";
import moipAPI, {headersOauth2} from "../../../services/moip-api";
import CartaoFormService from "../../../services/cartao-form-service";
import {styles} from "./styles";

export default class TelaFinalPedidoScreen extends Component {

	public setState: any;

	public props: any;

	public navigation: any;

	static navigationOptions = {
		title: "Dados do Pedido",
	};

	state = {
		pedido: null,
		isLoading: false,
		classificacao: 0,
		isSelectingCard: false,
		cartoes: [],
		cartaoSelecionado: null,
		secureCode: "",
		isWritingSecureCode: false,
	};

	constructor(props) {

		super(props);

	}

	creditCardFilter = data => data.method === "CREDIT_CARD";

	obterCartoes = () => {

		const tokenService = TokenService.getInstance();

		if (tokenService.getUser().user_type !== "professional") {

			this.setState({isLoading: true}, () => {

				moipAPI.get(`/customers/${tokenService.getUser().customer_wirecard_id}`, {headers: headersOauth2})
					.then(data => {

						const clientData = data.data;

						if (clientData.fundingInstruments) {

							const cardData = clientData.fundingInstruments.filter(data => this.creditCardFilter(data));

							if (cardData.length > 0) {

								const cardWithId = cardData.map(data => data.creditCard);

								this.setState({cartoes: [...cardWithId]}, () => {

									const cartaoService = CartaoFormService.getInstance();

									if (cartaoService.isAdicionarNovoCard()) {

										cartaoService.setAdicionarNovoCard(false);
										this.setState({isSelectingCard: true});

									}

								});

							}

						}

					})
					.catch(error => {

						if (error.response) {


							/*
               * The request was made and the server responded with a
               * status code that falls out of the range of 2xx
               */
							Alert.alert(
								"Falha ao obter os dados",
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

					})
					.finally(_ => {

						this.setState({isLoading: false});

					});

			});

		}

	};

	obterPedido = () => {

		this.setState({isLoading: true}, () => {

			const {navigation} = this.props;
			const pedido = navigation.getParam("pedido", null);

			if (pedido)
				this.setState({pedido, classificacao: Number(pedido.rate), isLoading: false}, () => this.obterCartoes());
			else {

				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({routeName: "AcompanhamentoPedido", params: {pedido: null}})],
				});

				this.props.navigation.dispatch(resetAction);

			}

		});

	}

	setClassificacao = (classificacao = 0) => {

		this.setState({classificacao});

	};

	private efetuarPagamento = (): void => {

		const tokenService = TokenService.getInstance();
		const isProfessional = tokenService.getUser().user_type === "professional";

		this.setState({isLoading: true}, () => {

			const pedido = {};

			pedido.id = this.state.pedido.id;
			pedido[isProfessional ? "user_rate" : "rate"] = this.state.classificacao;

			const orderWirecard = {};

			orderWirecard.order_id = this.state.pedido.order_wirecard_id;
			orderWirecard.installmentCount = 1;
			orderWirecard.statementDescriptor = "Finddo";
			orderWirecard.fundingInstrument = {};
			orderWirecard.fundingInstrument.method = "CREDIT_CARD";
			orderWirecard.fundingInstrument.creditCard = {};
			orderWirecard.fundingInstrument.creditCard.id = this.state.cartaoSelecionado.id;
			orderWirecard.fundingInstrument.creditCard.cvc = this.state.secureCode;

			moipAPI.post(`orders/${this.state.pedido.order_wirecard_id}/payments`,
				orderWirecard, {headers: headersOauth2}).then(responseWirecard => {

				pedido.payment_wirecard_id = responseWirecard.data.id;
				backendRails.put(`/orders/${pedido.id}`, {order: pedido}, {headers: tokenService.getHeaders()})
					.then(response => {
						// TODO: adicionar mensagem de feedback
						// ex.: seu pagamento foi enviado com sucesso
						// mensagem deve sumir rapidamente, não ser um alert
					}).catch(error => {

						if (error.response) {


							/*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
							Alert.alert(
								"Erro",
								"Seu pedido foi pago mas não conseguimos salvar em nosso sistema, entre em contato conosco pela aba ajuda.",
								[
									{text: "OK",
										onPress: () => {

											this.setState({isLoading: false});

										}},
								],
								{cancelable: false},
							);

						} else if (error.request) {


							/*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
							Alert.alert(
								"Erro",
								"Seu pedido foi pago mas não conseguimos salvar em nosso sistema, entre em contato conosco pela aba ajuda.",
								[
									{text: "OK",
										onPress: () => {

											this.setState({isLoading: false});

										}},
								],
								{cancelable: false},
							);

						} else {

							/* Something happened in setting up the request and triggered an Error */
						}

					})
					.finally(_ => {

						this.setState({isLoading: false});

					});

			}).catch(error => {

				if (error.response) {


					/*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
					Alert.alert(
						"Falha ao executar o pagamento",
						"Verifique sua conexão e tente novamente",
						[
							{text: "OK",
								onPress: () => {

									this.setState({isLoading: false});

								}},
						],
						{cancelable: false},
					);

				} else if (error.request) {


					/*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
					Alert.alert(
						"Falha ao executar o pagamento",
						"Verifique sua conexão e tente novamente",
						[
							{text: "OK",
								onPress: () => {

									this.setState({isLoading: false});

								}},
						],
						{cancelable: false},
					);

				} else {

					/* Something happened in setting up the request and triggered an Error */
				}

			});

		});

	}

	public render() {

		const isProfessional = TokenService.getInstance().getUser().user_type === "professional";

		if (!this.state.pedido) {

			return (
				<ImageBackground
					style={{width: "100%", height: "100%"}}
					source={require("../../../img/Ellipse.png")}>
					<ScrollView>
						<NavigationEvents
							onWillFocus={_ => {

								const cartaoService = CartaoFormService.getInstance();

								if (!cartaoService.isAdicionarNovoCard())
									this.obterPedido();
								else
									this.obterCartoes();

							}}
						/>
					</ScrollView>
				</ImageBackground>
			);

		}

		return (
			<ImageBackground
				style={{width: "100%", height: "100%"}}
				source={require("../../../img/Ellipse.png")}>
				<ScrollView>
					<NavigationEvents
						onWillFocus={_ => {

							const cartaoService = CartaoFormService.getInstance();

							if (!cartaoService.isAdicionarNovoCard())
								this.obterPedido();
							else
								this.obterCartoes();

						}}
					/>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isWritingSecureCode}
					>
						<KeyboardAvoidingView
							behavior={Platform.OS === "ios" ? "padding" : "height"}
							style={{flex: 1, backgroundColor: colors.branco, justifyContent: "center", alignItems: "center"}}>
							<View style={{height: 400, justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontSize: 18, fontWeight: "bold", marginTop: 20}}>Digite o código de segurança do cartão:</Text>
								<View style={{height: 20}}></View>
								<TextInput
									style={styles.cadastroFormSizeAndFont}
									onChangeText={text => {

										this.setState({secureCode: text});

									}}
									placeholder="CVV" keyboardType={"number-pad"}
									maxLength={10}
									value={this.state.secureCode}
								/>
							</View>
							<TouchableOpacity onPress={() => this.setState({isWritingSecureCode: false}, () => {

								this.efetuarPagamento();

							})}>
								<View style={{width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo, alignItems: "center", justifyContent: "center"}}>
									<Text style={{fontSize: 18, color: colors.branco}}>CONFIRMAR PAGAMENTO</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.setState({isWritingSecureCode: false})}>
								<View style={{width: 340, height: 45, borderRadius: 20, marginTop: 20, backgroundColor: colors.verdeFinddo, alignItems: "center", justifyContent: "center"}}>
									<Text style={{fontSize: 18, color: colors.branco}}>CANCELAR</Text>
								</View>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					</Modal>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isSelectingCard}
					>
						<View style={{flex: 1, backgroundColor: colors.branco, justifyContent: "center", alignItems: "center"}}>
							<View style={{height: 500, justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontSize: 18, fontWeight: "bold", marginTop: 20}}>Por favor escolha uma forma de pagamento:</Text>
								<View style={{height: 20}}></View>
								<FlatList data={this.state.cartoes}
									renderItem={item => <Item dados={item} selecionarCartao={() => {

										this.setState({cartaoSelecionado: item.item}, () => {

											this.setState({isSelectingCard: false, isWritingSecureCode: true});

										});

									}}></Item>}
									keyExtractor={item => item.id}>
								</FlatList>
							</View>
							<TouchableOpacity onPress={() =>
								this.setState({isSelectingCard: false}, () => {

									CartaoFormService.getInstance().setAdicionarNovoCard(true);
									this.props.navigation.navigate("FormAddCartao");

								})}>
								<View style={{width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo, alignItems: "center", justifyContent: "center"}}>
									<Text style={{fontSize: 18, color: colors.branco}}>ADICIONAR CARTÃO</Text>
								</View>
							</TouchableOpacity>
							<View style={{height: 10}}></View>
							<TouchableOpacity onPress={() => this.setState({isSelectingCard: false})}>
								<View style={{width: 340, height: 45, borderRadius: 20, backgroundColor: colors.verdeFinddo, alignItems: "center", justifyContent: "center"}}>
									<Text style={{fontSize: 18, color: colors.branco}}>FECHAR</Text>
								</View>
							</TouchableOpacity>
						</View>
					</Modal>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isLoading}
					>
						<View style={styles.modalStyle}>
							<View>
								<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
							</View>
						</View>
					</Modal>
					<View style={styles.containerBase}>
						<View style={styles.linha}>
							<Text style={{fontSize: 25, fontWeight: "bold"}}>{this.state.pedido.category.name}</Text>
							<Text style={{fontSize: 25, fontWeight: "bold", color: colors.verdeFinddo}}>R$ {(this.state.pedido.price / 100).toFixed(2)}</Text>
						</View>
						<View style={[styles.linha, styles.avaliacaoFuncionario]}>
							<View>
								<Image
									style={{width: 80, height: 80, borderRadius: 100}}
									source={{uri: `${backendUrl}/${this.state.pedido.professional_photo}`}}></Image>
							</View>
							<View>
								<Text style={{fontSize: 18}}>Avalie o {isProfessional ? "Cliente" : "Profissional"}</Text>
								<View style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginTop: 10,
								}}>
									{
										(() => {

											if (this.state.classificacao === 0) {

												return (
													<TouchableOpacity onPress={() => this.setClassificacao(1)}>
														<SvgXml xml={star} width={18} height={18}></SvgXml>
													</TouchableOpacity>
												);

											}

											return (
												<TouchableOpacity onPress={() => this.setClassificacao(0)}>
													<SvgXml xml={starSolid} width={18} height={18}></SvgXml>
												</TouchableOpacity>
											);

										})()
									}
									{
										(() => {

											if (this.state.classificacao <= 1) {

												return (
													<TouchableOpacity onPress={() => this.setClassificacao(2)}>
														<SvgXml xml={star} width={18} height={18}></SvgXml>
													</TouchableOpacity>
												);

											}

											return (
												<TouchableOpacity onPress={() => this.setClassificacao(1)}>
													<SvgXml xml={starSolid} width={18} height={18}></SvgXml>
												</TouchableOpacity>
											);

										})()
									}
									{
										(() => {

											if (this.state.classificacao <= 2) {

												return (
													<TouchableOpacity onPress={() => this.setClassificacao(3)}>
														<SvgXml xml={star} width={18} height={18}></SvgXml>
													</TouchableOpacity>
												);

											}

											return (
												<TouchableOpacity onPress={() => this.setClassificacao(2)}>
													<SvgXml xml={starSolid} width={18} height={18}></SvgXml>
												</TouchableOpacity>
											);

										})()
									}
									{
										(() => {

											if (this.state.classificacao <= 3) {

												return (
													<TouchableOpacity onPress={() => this.setClassificacao(4)}>
														<SvgXml xml={star} width={18} height={18}></SvgXml>
													</TouchableOpacity>
												);

											}

											return (
												<TouchableOpacity onPress={() => this.setClassificacao(3)}>
													<SvgXml xml={starSolid} width={18} height={18}></SvgXml>
												</TouchableOpacity>
											);

										})()
									}
									{
										(() => {

											if (this.state.classificacao <= 4) {

												return (
													<TouchableOpacity onPress={() => this.setClassificacao(5)}>
														<SvgXml xml={star} width={18} height={18}></SvgXml>
													</TouchableOpacity>
												);

											}

											return (
												<TouchableOpacity onPress={() => this.setClassificacao(4)}>
													<SvgXml xml={starSolid} width={18} height={18}></SvgXml>
												</TouchableOpacity>
											);

										})()
									}
								</View>
							</View>
						</View>
						<View style={{
							height: 100,
							width: 300,
							marginTop: 20,
							alignItems: "flex-start",
							justifyContent: "space-around",
							flexDirection: "row",
						}}>
							<View style={styles.horaAgendamento}>
								<Text style={{fontSize: 18, textAlign: "center"}}>Data agendada:</Text>
								<View style={{flexDirection: "row", alignItems: "center"}}>

									<Text style={{fontSize: 18, textAlign: "center"}}>
										{
											(() => {

												if (this.state.pedido.urgency === "not_urgent") {

													const dataInicio = new Date(this.state.pedido.start_order.split(".")[0]);
													const dataFim = new Date(this.state.pedido.end_order.split(".")[0]);

													const dataFormatadaInicio = `${dataInicio.getDate()}/${dataInicio.getMonth() + 1}/${dataInicio.getFullYear()}`;
													const dataFormatadaFim = `${dataFim.getDate()}/${dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;

													return dataFormatadaInicio;

												}
												const dataInicio = new Date(this.state.pedido.start_order.split(".")[0]);

												const dataFormatadaInicio = `${dataInicio.getDate()}/${dataInicio.getMonth() + 1}/${dataInicio.getFullYear()}`;

												return `${dataFormatadaInicio}\n(Pedido urgente)`;

											})()
										}
									</Text>
								</View>
							</View>
							<View style={{width: 40}}></View>
							<View style={styles.profissionalACaminho}>
								<Text style={{fontSize: 18, textAlign: "center"}}>{enumEstadoPedidoMap[this.state.pedido.order_status]}</Text>
							</View>
						</View>

					</View>
					<View style={{
						alignItems: "center",
						justifyContent: "center",
						marginTop: 20,
					}}>
						{
							(() => {

								const tokenService = TokenService.getInstance();

								if (tokenService.getUser().user_type === "professional") {

									return (
										<TouchableOpacity
											style={{
												backgroundColor: colors.verdeFinddo,
												width: 340,
												height: 45,
												alignItems: "center",
												justifyContent: "center",
												borderRadius: 20,
											}} onPress={() => {

												this.setState({isLoading: false}, () => {

													backendRails.get(`/orders/${this.state.pedido.id}`, {headers: tokenService.getHeaders()})
														.then(response => {

															const pedido = response.data;

															if (pedido.paid === true) {

																Alert.alert(
																	"Sucesso",
																	"Obrigado por usar o Finddo",
																	[
																		{
																			text: "Ok",
																			onPress: () => {

																				const resetAction = StackActions.reset({
																					index: 0,
																					actions: [NavigationActions.navigate({routeName: "AcompanhamentoPedido"})],
																				});

																				this.props.navigation.dispatch(resetAction);

																			},
																		},
																	],
																);

															}
															this.setState({pedido: response.data});

														}).catch(error => {

															if (error.response) {


																/*
                                 * The request was made and the server responded with a
                                 * status code that falls out of the range of 2xx
                                 */
																Alert.alert(
																	"Falha ao obter os dados",
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

														})
														.finally(_ => {

															this.setState({isLoading: false});

														});

												});

											}}>
											<Text style={{fontSize: 18, color: colors.branco}}>CONCLUIR PEDIDO</Text>
										</TouchableOpacity>
									);

								}

								return (
									<View>
										<TouchableOpacity
											style={{
												backgroundColor: colors.verdeFinddo,
												width: 340,
												height: 45,
												alignItems: "center",
												justifyContent: "center",
												borderRadius: 20,
												marginBottom: 20,
											}} onPress={() => {

												this.setState({isLoading: false}, () => {

													backendRails.get(`/orders/${this.state.pedido.id}`, {headers: tokenService.getHeaders()})
														.then(response => {

															const pedido = response.data;

															if (pedido.paid === true) {

																Alert.alert(
																	"Sucesso",
																	"Obrigado por usar o Finddo",
																	[
																		{
																			text: "Ok",
																			onPress: () => {

																				const resetAction = StackActions.reset({
																					index: 0,
																					actions: [NavigationActions.navigate({routeName: "AcompanhamentoPedido"})],
																				});

																				this.props.navigation.dispatch(resetAction);

																			},
																		},
																	],
																);

															}
															this.setState({pedido: response.data});

														}).catch(error => {

															if (error.response) {


																/*
                                   * The request was made and the server responded with a
                                   * status code that falls out of the range of 2xx
                                   */
																Alert.alert(
																	"Falha ao obter os dados",
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

														})
														.finally(_ => {

															this.setState({isLoading: false});

														});

												});

											}}>
											<Text style={{fontSize: 18, color: colors.branco}}>CONCLUIR PEDIDO</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={{
												backgroundColor: colors.verdeFinddo,
												width: 340,
												height: 45,
												alignItems: "center",
												justifyContent: "center",
												borderRadius: 20,
											}} onPress={() => {

												Alert.alert(
													"Confirma valor e classificação?",
													`Valor: R$${String((this.state.pedido.price / 100).toFixed(2))
													}\nClassificação: ${this.state.classificacao} estrelas` +
                            "\nATENÇÃO: Só pague se o profissional tiver realizado o serviço",
													[
														{text: "Cancelar", onPress: () => { }},
														{
															text: "OK", onPress: () => this.setState({isSelectingCard: true}),
														},
													],
													{cancelable: false},
												);

											}}>
											<Text style={{fontSize: 18, color: colors.branco}}>CONFIRMAR PAGAMENTO</Text>
										</TouchableOpacity>
									</View>
								);

							})()
						}
					</View>
				</ScrollView>
			</ImageBackground>
		);

	}

}

function Item(props) {

	const itemStyle = StyleSheet.create({
		itemCartaoText: {
			color: "black",
			fontSize: 16,
			textAlign: "left",
			width: 240,
		},
		cartaoNome: {
			fontWeight: "bold",
		},
	});

	return (
		<TouchableOpacity style={{
			width: 300,
			height: 90,
			flexDirection: "row",
			borderRadius: 20,
			borderColor: colors.amareloIconeEditar,
			borderWidth: 1,
			marginBottom: 10,
		}} onPress={props.selecionarCartao}>
			<View style={{
				width: 240,
				paddingLeft: 20,
				alignItems: "center",
				justifyContent: "center",
			}}>
				<Text style={[itemStyle.itemCartaoText, itemStyle.cartaoNome]}>{props.dados.item.brand}</Text>
				<Text style={itemStyle.itemCartaoText}>{props.dados.item.first6}XXXXXX{props.dados.item.last4}</Text>
			</View>
			<View style={{
				width: 60,
				backgroundColor: "transparent",
				alignItems: "center",
				justifyContent: "space-evenly",
				flexDirection: "column",
			}}>
			</View>
		</TouchableOpacity>
	);

}
