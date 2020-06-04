import React, {Component} from "react";
import {
	Text, FlatList,
	TouchableOpacity,
	View, ImageBackground,
	ActivityIndicator,
	Modal, Alert,
	RefreshControl,
} from "react-native";
import backendRails from "../../../services/backend-rails-api";
import TokenService from "../../../services/token-service";
import Icon from "react-native-vector-icons/MaterialIcons";
import {colors} from "../../../colors";
import {NavigationEvents} from "react-navigation";
import VisualizarPedidoProfissional from "../../../components/modal-visualizar-pedido-profissional";
import CustomPicker from "../../../components/custom-picker";
import {styles} from "./styles";

export default class MeusPedidosProfissional extends Component {

	public setState: any;

	public props: any;

	static navigationOptions = {
		title: "Pedidos Profissional",
	};

	state = {
		pedidos: [],
		page: 1,
		pedidosAnalise: [],
		pedidosCaminho: [],
		pedidosServico: [],
		pedidosFinalizado: [],
		pedidosCancelado: [],
		tipoPedidoSelecionado: estadoPedidoValues[0].value,
		loadingData: false,
		pedidoCorrente: null,
		enderecoSelecionado: null,
		isShowingPedido: false,
	};

	obterPedidos = async(page = 1) => {

		this.setState({loadingData: true});

		try {

			const tokenService = TokenService.getInstance();
			let response = {};

			response = await
			backendRails
				.get(`/orders/active_orders_professional/${tokenService.getUser().id}`,
					{headers: tokenService.getHeaders()});

			const orders = response.data;

			orders.forEach(element => {

				element.id = `${element.id}`;

			});

			const pedidosAnalise = orders.filter(order => order.order_status === "analise");

			const pedidosCaminho = orders.filter(order => order.order_status === "a_caminho");

			const pedidosServico = orders.filter(order => order.order_status === "em_servico");

			const pedidosFinalizado = orders.filter(order => order.order_status === "finalizado");

			const pedidosCancelado = orders.filter(order => order.order_status === "cancelado");

			this.setState({
				pedidos: null,
				pedidosAnalise: null,
				pedidosCaminho: null,
				pedidosServico: null,
				pedidosFinalizado: null,
				pedidosCancelado: null,
			}, () => {

				this.setState({
					pedidos: [...orders],
					pedidosAnalise: [...pedidosAnalise],
					pedidosCaminho: [...pedidosCaminho],
					pedidosServico: [...pedidosServico],
					pedidosFinalizado: [...pedidosFinalizado],
					pedidosCancelado: [...pedidosCancelado],
				});

			});

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

		} finally {

			this.setState({loadingData: false});

		}

	};

	acaoPedido = pedido => {

		const buttons = [
			{
				text: "Visualizar pedido",
				onPress: () => {

					this.setState({pedidoCorrente: pedido, enderecoSelecionado: pedido.address, isShowingPedido: true});

				},
			},
			{
				text: "Verificar status",
				onPress: () => this.props.navigation.navigate("AcompanhamentoPedido", {pedido}),
			},
		];

		Alert.alert(
			"Finddo",
			"O que deseja fazer?",
			pedido.order_status === "finalizado" ? [buttons[0]] : buttons,
			{cancelable: false},
		);

	};

	public render() {

		const user = TokenService.getInstance().getUser();


		return (
			<ImageBackground
				style={{width: "100%", height: "100%"}}
				source={require("../../../img/Ellipse.png")}>
				<View style={styles.container}>
					<NavigationEvents
						onWillFocus={_ => this.obterPedidos()}
						// onDidFocus={payload => console.log('did focus', payload)}
						// onWillBlur={payload => console.log('will blur', payload)}
						// onDidBlur={payload => console.log('did blur', payload)}
					/>
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
					</Modal>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isShowingPedido}
					>
						<VisualizarPedidoProfissional
							pedido={this.state}
							onConfirm={() => this.setState({isShowingPedido: false})}
							onCancel={() => this.setState({isShowingPedido: false})}></VisualizarPedidoProfissional>
					</Modal>
					<View style={{
						height: 60,
						backgroundColor: colors.branco,
						width: 340,
						borderRadius: 12,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 10,
					}}>
						<CustomPicker
							style={styles.selecionaStatus}
							items={estadoPedidoValues}
							onSelect={({value}) => this.setState({tipoPedidoSelecionado: value})}
						/>
					</View>
					<View style={{height: 425}}>
						{(() => {

							switch (this.state.tipoPedidoSelecionado) {

								case "analise":
									return (
										<ListaPedidos
											pedidos={this.state.pedidosAnalise}
											refreshing={this.state.loadingData}
											onRefresh={() => this.obterPedidos()}
											onPressItem={item => this.acaoPedido(item)} />
									);
								case "a_caminho":
									return (
										<ListaPedidos
											pedidos={this.state.pedidosCaminho}
											refreshing={this.state.loadingData}
											onRefresh={() => this.obterPedidos()}
											onPressItem={item => this.acaoPedido(item)} />
									);
								case "em_servico":
									return (
										<ListaPedidos
											pedidos={this.state.pedidosServico}
											refreshing={this.state.loadingData}
											onRefresh={() => this.obterPedidos()}
											onPressItem={item => this.acaoPedido(item)} />
									);
								case "finalizado":
									return (
										<ListaPedidos
											pedidos={this.state.pedidosFinalizado}
											refreshing={this.state.loadingData}
											onRefresh={() => this.obterPedidos()}
											onPressItem={item => this.acaoPedido(item)} />
									);
								case "cancelado":
									return (
										<ListaPedidos
											pedidos={this.state.pedidosCancelado}
											refreshing={this.state.loadingData}
											onRefresh={() => this.obterPedidos()}
											onPressItem={item => this.acaoPedido(item)} />
									);
								default: return (
									<ListaPedidos
										pedidos={this.state.pedidos}
										refreshing={this.state.loadingData}
										onRefresh={() => this.obterPedidos()}
										onPressItem={item => this.acaoPedido(item)} />
								);

							}

						})()
						}
					</View>
					<NovoPedido botaoStyle={styles.novoPedidoButton}
						onPress={() => {

							this.props.navigation.navigate("Services");

						}} user={user}
					></NovoPedido>
				</View>
			</ImageBackground>
		);

	}

}

function NovoPedido(props) {

	user = props.user;
	if (user.user_type === "user") {

		return (
			<TouchableOpacity
				style={props.botaoStyle}
				onPress={props.onPress}>
				<Text style={{fontSize: 20, color: colors.branco}}>NOVO PEDIDO</Text>
			</TouchableOpacity>
		);

	}

	return null;

}

function ListaPedidos(props?) {

	return (
		<View>
			<FlatList
				data={props.pedidos}
				keyExtractor={item => item.id}
				refreshControl={
					<RefreshControl
						colors={[colors.verdeFinddo]}
						refreshing={props.refreshing}
						onRefresh={props.onRefresh}
					/>
				}
				renderItem={
					({item}) =>
						<TouchableOpacity
							onPress={() => props.onPressItem(item)}
							style={[styles.item, styles.pedidoLabel]}>
							<View style={{width: 260}}>
								<Text style={{fontSize: 20, marginBottom: 5}}>{item.category.name}</Text>
								<View style={{flexDirection: "row"}}>
									<View style={styles.pedidoIndicador}></View>
									<Text style={{fontSize: 18, color: colors.cinza}}>    {enumEstadoPedidoMap[item.order_status]}</Text>
								</View>
							</View>
							<View style={styles.pedidoSetaDireita}>
								<Icon
									style={{width: 40}}
									name={"keyboard-arrow-right"}
									size={20} color={colors.cinza} />
							</View>
						</TouchableOpacity>}
			/>
		</View>
	);

}

const estadoPedidoValues = [
	{content: "Selecione um status", value: "none", id: "0"},
	{content: "Pedido em Análise", value: "analise", id: "1"},
	{content: "Agendando Visita", value: "agendando_visita", id: "2"},
	{content: "Profissional à Caminho", value: "a_caminho", id: "3"},
	{content: "Serviço em Execução", value: "em_servico", id: "4"},
	{content: "Concluído", value: "finalizado", id: "5"},
	{content: "Cancelado", value: "cancelado", id: "6"},
];

const enumEstadoPedidoMap = {
	analise: "Pedido em Análise",
	agendando_visita: "Agendando Visita",
	a_caminho: "Profissional à Caminho",
	em_servico: "Serviço em Execução",
	finalizado: "Concluído",
	cancelado: "Cancelado",
	none: "Selecione um status",
};
