import React, {Component} from "react";
import {
	Modal, View,
	Text,
	ScrollView, ImageBackground,
	TouchableOpacity, Image,
	ActivityIndicator, Alert,
} from "react-native";
import backendRails from "../../../services/backend-rails-api";
import TokenService from "../../../services/token-service";
import {NavigationEvents} from "react-navigation";
import {colors} from "../../../colors";
import VisualizarPedido from "../../../components/modal-visualizar-pedido";
import FotoService from "../../../services/foto-service";
import {ListaDeEnderecos} from "../../../pages/perfil/enderecos";
import EnderecoFormService from "../../../services/endereco-form-service";
import PedidoCorrenteService from "../../../services/pedido-corrente-service";
import {styles} from "./styles";

export default class FotosPedido extends Component {

	public setState: any;

	public props: any;

	public navigation: any;

	public foto1: any;

	public foto2: any;

	public foto3: any;

	public foto4: any;

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.categoriaPedido.name}`,
		headerBackTitle: "Voltar",
	});

	state = {
		necessidade: "",
		imageServicoUrl: require("../../../img/jacek-dylag-unsplash.png"),
		categoriaPedido: null,
		isLoading: false,
		dataPedido: null,
		hora: null,
		horaFim: null,
		urgencia: "",
		isConfirming: false,
		foto1: fotoDefault,
		foto1Setada: false,
		foto2: fotoDefault,
		foto2Setada: false,
		foto3: fotoDefault,
		foto3Setada: false,
		foto4: fotoDefault,
		foto4Setada: false,
		fotosPedido: [],
		isSelectEndereco: false,
		enderecos: [],
		enderecoSelecionado: null,
	};

	componentDidMount() {

		this.obterDadosPrimeiraPartePedido();

	}

	obterFoto = () => {

		const fotoService = FotoService.getInstance();
		const photo = fotoService.getFotoData();
		const numeroFoto = fotoService.getFotoId();

		const images = this.state.fotosPedido;

		if (photo) {

			switch (numeroFoto) {

				case 1:
					images.push({image: photo, file_name: "foto1"});
					this.setState({foto1: photo, foto1Setada: true, isLoading: false, fotosPedido: [...images]});
					break;
				case 2:
					images.push({image: photo, file_name: "foto2"});
					this.setState({foto2: photo, foto2Setada: true, isLoading: false, fotosPedido: [...images]});
					break;
				case 3:
					images.push({image: photo, file_name: "foto3"});
					this.setState({foto3: photo, foto3Setada: true, isLoading: false, fotosPedido: [...images]});
					break;
				case 4:
					images.push({image: photo, file_name: "foto4"});
					this.setState({foto4: photo, foto4Setada: true, isLoading: false, fotosPedido: [...images]});
					break;
				default:
					this.setState({isLoading: false});
					break;

			}

		} else
			this.setState({isLoading: false});

	}

	obterDadosPrimeiraPartePedido = () => {

		const {navigation} = this.props;
		const categoriaPedido = navigation.getParam("categoriaPedido", "no categoria");
		const dataPedido = navigation.getParam("dataPedido", "sem_data");
		const hora = navigation.getParam("hora", "sem_hora");
		const horaFim = navigation.getParam("horaFim", "sem_hora_fim");
		const urgencia = navigation.getParam("urgencia", "sem_urgencia");

		if (dataPedido !== "sem_data")
			this.setState({dataPedido, hora, horaFim});


		if (urgencia !== "sem_urgencia")
			this.setState({urgencia});


		const pedidoService = PedidoCorrenteService.getInstance();
		const {foto1, foto2, foto3, foto4} = pedidoService.getPedidoCorrente();

		this.setState({
			foto1: foto1 ? foto1 : fotoDefault,
			foto1Setada: Boolean(foto1),
			foto2: foto2 ? foto2 : fotoDefault,
			foto2Setada: Boolean(foto2),
			foto3: foto3 ? foto3 : fotoDefault,
			foto3Setada: Boolean(foto3),
			foto4: foto4 ? foto4 : fotoDefault,
			foto4Setada: Boolean(foto4),
			necessidade: categoriaPedido,
			imageServicoUrl: categoriaPedido.image_url,
		});

	};

	selecionarEndereco = () => {

		this.setState({isSelectEndereco: true}, () => {

			const tokenService = TokenService.getInstance();

			backendRails.get(`/addresses/user/${tokenService.getUser().id}`, {headers: tokenService.getHeaders()})
				.then(data => {

					const addresses = data.data;

					addresses.forEach(element => {

						element.id = `${element.id}`;

					});

					this.setState({enderecos: [...addresses], isLoading: false});

				}).catch(error => {

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
					this.setState({isLoading: false});

				})
				.finally(_ => {

					this.setState({isSelectEndereco: true});

				});

		});

	};

	confirmarPedido = () => {

		this.setFotosPedido();
		this.props.navigation.navigate("FormAddEndereco");

	};

	setFotosPedido = () => {

		const pedidoService = PedidoCorrenteService.getInstance();
		const pedido = pedidoService.getPedidoCorrente();

		if (this.state.foto1Setada) {

			pedido.foto1 = {};
			pedido.foto1 = this.state.foto1;

		} else pedido.foto1 = null;
		if (this.state.foto2Setada) {

			pedido.foto2 = {};
			pedido.foto2 = this.state.foto2;

		} else pedido.foto2 = null;
		if (this.state.foto3Setada) {

			pedido.foto3 = {};
			pedido.foto3 = this.state.foto3;

		} else pedido.foto3 = null;
		if (this.state.foto4Setada) {

			pedido.foto4 = {};
			pedido.foto4 = this.state.foto4;

		} else pedido.foto4 = null;

	}

	redefinirFoto = (id = 1) => {

		switch (id) {

			case 1:
				this.setState({foto1: fotoDefault, foto1Setada: false});
				break;
			case 2:
				this.setState({foto2: fotoDefault, foto2Setada: false});
				break;
			case 3:
				this.setState({foto3: fotoDefault, foto3Setada: false});
				break;
			case 4:
				this.setState({foto4: fotoDefault, foto4Setada: false});
				break;
			default:
				break;

		}

	}

	baterFotoOuRemover = (id = 1) => {

		Alert.alert(
			"Foto",
			"O que deseja fazer?",
			[
				{text: "Cancelar", onPress: () => { }},
				{
					text: "Adicionar foto",
					onPress: () => {

						FotoService.getInstance().setFotoId(id);
						this.props.navigation.navigate("CameraPedido");

					},
				},
				{text: "Remover foto",
					onPress: () => {

						this.redefinirFoto(id);

					}},
			],
			{cancelable: false},
		);

	}

	fecharDialogConfirmacaoSemConfirmarPedido = () => {

		this.setState({isConfirming: false});

	};

	salvarAposPedidoConfirmado = () => {

		this.setState({isConfirming: false});
		// this.salvarPedido(this.state);

	};

	selecionarItem = item => {

		this.setState({isSelectEndereco: false, enderecoSelecionado: item.item}, () => {

			this.confirmarPedido();

		});

	}

	render() {

		return (
			<ImageBackground
				style={{width: "100%", height: "100%"}}
				source={require("../../../img/Ellipse.png")}>
				<View style={{flex: 1}}>
					<ScrollView>
						<Modal
							animationType="slide"
							transparent={true}
							visible={this.state.isLoading}
						>
							<View style={styles.loaderContainer}>
								<View>
									<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
								</View>
							</View>
						</Modal>
						<Modal
							animationType="slide"
							transparent={true}
							visible={this.state.isSelectEndereco}>
							<View style={{
								alignItems: "center",
								justifyContent: "center",
								flex: 1,
								backgroundColor: colors.branco,
							}}>
								<Text style={{
									fontSize: 24,
									fontWeight: "bold",
									marginVertical: 18,
									paddingHorizontal: 20,
								}}>Escolha o endereço onde o serviço será realizado:</Text>
								<ListaDeEnderecos
									readOnly={true}
									navigation={this.props.navigation}
									enderecos={this.state.enderecos}
									selecionarItem={this.selecionarItem}
									comp={this}></ListaDeEnderecos>
								<TouchableOpacity
									style={styles.botaoContinuar}
									onPress={() => this.setState({isSelectEndereco: false}, () => {

										EnderecoFormService.getInstance().setAdicionarNovoEndServico(true);
										this.props.navigation.navigate("FormAddEndereco");

									})}>
									<Text style={styles.botaoContinuarTexto}>ADICIONAR ENDEREÇO</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.botaoContinuar}
									onPress={() => this.setState({isSelectEndereco: false})}>
									<Text style={styles.botaoContinuarTexto}>VOLTAR</Text>
								</TouchableOpacity>
							</View>
						</Modal>
						<Modal
							animationType="slide"
							transparent={true}
							visible={this.state.isConfirming}>
							<VisualizarPedido
								pedido={this.state}
								onConfirm={() => this.salvarAposPedidoConfirmado()}
								onCancel={() => this.fecharDialogConfirmacaoSemConfirmarPedido()}></VisualizarPedido>
						</Modal>
						<View style={styles.imagemCategoriaContainer}>
							<NavigationEvents
								onWillFocus={_ => {

									this.setState({isLoading: true}, () => {

										setTimeout(() => {

											this.obterFoto();

										}, 1000);

									});

								}}
								// onDidFocus={_ => this.obterFoto1()}
								// onWillBlur={payload => console.log('will blur', payload)}
								// onDidBlur={payload => console.log('did blur', payload)}
							/>
							<Image source={this.state.imageServicoUrl}
								style={{width: "100%"}} />
							<View style={styles.formPedidoContainer}>
								<View style={styles.maisFotosContainer}>
									<Text style={{fontSize: 18, textAlign: "center", marginTop: 10}}>
                    Nos ajude com fotos do problema (opcional)
									</Text>
									<TouchableOpacity onPress={() => {

										this.baterFotoOuRemover(1);

									}} style={{alignItems: "center", marginTop: 30}}>
										<Image
											style={{width: 120, height: 120}}
											source={this.state.foto1} />
									</TouchableOpacity>
									<View style={styles.fotosProblemaContainer}>
										<TouchableOpacity onPress={() => {

											this.baterFotoOuRemover(2);

										}}>
											<Image
												style={{width: 80, height: 80}}
												source={this.state.foto2} />
										</TouchableOpacity>
										<TouchableOpacity onPress={() => {

											this.baterFotoOuRemover(3);

										}}>
											<Image
												style={{width: 80, height: 80}}
												source={this.state.foto3} />
										</TouchableOpacity>
										<TouchableOpacity onPress={() => {

											this.baterFotoOuRemover(4);

										}}>
											<Image
												style={{width: 80, height: 80}}
												source={this.state.foto4} />
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
				<View style={styles.botaoContainer}>
					<TouchableOpacity
						style={styles.botaoContinuar}
						onPress={() => this.confirmarPedido()}>
						<Text style={styles.botaoContinuarTexto}>CONTINUAR</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);

	}

}

const fotoDefault = require("../../../img/add_foto_problema.png");
