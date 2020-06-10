import React, {useState, useEffect} from "react";
import {
	Image,
	ImageBackground,
	TouchableOpacity, View, StyleSheet,
} from "react-native";
import PedidoCorrenteService from "../../../services/pedido-corrente-service";
import TokenService from "../../../services/token-service";
import {Button, List, Card, Text, Modal} from "@ui-kitten/components";
import Tutorial from "./tutorial";


const setCategoriaPedido = categoria => {

	const pedidoService = PedidoCorrenteService.getInstance();
	let pedido = pedidoService.getPedidoCorrente();

	if (!pedido) pedido = {};

	pedido.categoriaPedido = categoria;
	pedidoService.setPedidoCorrente(pedido);

};


const Services = ({navigation}): JSX.Element => {

	const [continuarPedidoFeito, setContinuarPedidoFeito] = useState(false);

	useEffect(() => {

		const pedidoService = PedidoCorrenteService.getInstance();
		const tokenService = TokenService.getInstance();

		pedidoService.getPedidoLocalStorage().then(pedido => {

			if (pedido)	pedidoService.setPedidoFromLocalStorage(pedido);
			if (pedido && tokenService.getUser()) setContinuarPedidoFeito(true);

		});

	});

	const continueOrder = (): void => {

		setContinuarPedidoFeito(false);
		navigation.navigate("ConfirmarPedido");

	}

	const discardOrder = (): void => {

		setContinuarPedidoFeito(false);
		PedidoCorrenteService
			.getInstance()
			.salvarPedidoLocalStorage(null);

	}

	return (
		<ImageBackground
			style={styles.backgroundImageContent}
			source={require("../../../img/Ellipse.png")}>
			<View>
				<Modal visible={continuarPedidoFeito}>
					<Card>
						<Text category="h5">Deseja retomar o pedido?</Text>
						<Button
							style={styles.button}
							onPress={continueOrder}
						>Sim</Button>
						<Button
							style={styles.button}
							onPress={discardOrder}
						>Criar novo pedido</Button>
					</Card>

				</Modal>
				<Tutorial/>
				<List
					contentContainerStyle={styles.contentContainer}
					data={categories}
					keyExtractor={item => item.id}
					renderItem={({item}) => exibirItem(item, navigation)}
				/>
			</View>
		</ImageBackground>
	);

};

// TODO: Migrate to useOptions in new version of navigation
Services.navigationOptions = {
	title: "Onde quer atendimento?",
	headerBackTitle: "Voltar",
};


const exibirItem = (item, navigation): JSX.Element =>
	<Card
		style={styles.item}
		header={headerProps => <Text {...headerProps} category="h5">{item.name}</Text>}
	>
		<TouchableOpacity onPress={() => {

			setCategoriaPedido(item);
			navigation.navigate("NovoPedido", {item});

		}}>
			<Image
				style={styles.image}
				source={item.imageUrl} />
		</TouchableOpacity>
	</Card>;


export default Services;
export const categories = [
	{id: "1", name: "Hidráulica", imageUrl: require("../../../img/jacek-dylag-unsplash.png")},
	{id: "2", name: "Elétrica", imageUrl: require("../../../img/eletrica.png")},
	{id: "3", name: "Pintura", imageUrl: require("../../../img/pintura.png")},
	{id: "4", name: "Ar condicionado", imageUrl: require("../../../img/ar-condicionado.png")},
	{id: "5", name: "Instalações", imageUrl: require("../../../img/instalacao.png")},
	{id: "6", name: "Pequenas reformas", imageUrl: require("../../../img/peq-reforma.png")},
	{id: "7", name: "Consertos em geral", imageUrl: require("../../../img/consertos.png")},
];


const styles = StyleSheet.create({
	contentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	button: {
		marginTop: 20,
	},
	image: {
		marginTop: 3,
		borderRadius: 10,
		width: "100%",
		height: 180,
	},
	item: {
		marginVertical: 4,
	},
	backgroundImageContent: {
		width: "100%", height: "100%",
	},
});
