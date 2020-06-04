import React, {Component} from "react";
import {
	View, ActivityIndicator,
	TouchableOpacity, ImageBackground,
	Text,
} from "react-native";
import {colors} from "../../../colors";
import TokenService from "../../../services/token-service";
import {StackActions, NavigationActions} from "react-navigation";

export default class RedirecionadorPedidos extends Component {

	public state: any;

	public props: any;

	public setState: any;

	static navigationOptions = {
		title: "Pedidos",
		headerLeft: () => null,
		headerBackTitle: "Voltar",
	};

	constructor(props) {

		super(props);

		this.state = {
			isLoading: true,
		};

	}

	componentDidMount() {

		const user = TokenService.getInstance().getUser();

		if (user) {

			if (user.user_type === "user") {

				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({routeName: "MeusPedidos"})],
				});

				this.props.navigation.dispatch(resetAction);

			} else {

				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({routeName: "MeusPedidosProfissional"})],
				});

				this.props.navigation.dispatch(resetAction);

			}

		} else
			this.setState({isLoading: false});

	}

	render() {

		if (this.state.isLoading) {

			return (
				<View style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(255,255,255,0.5)",
				}}>
					<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
				</View>
			);

		}

		return (
			<ImageBackground
				style={{width: "100%", height: "100%"}}
				source={require("../../../img/Ellipse.png")}>
				<View style={{height: "90%"}}>
					<View style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}>
						<Text style={{
							paddingHorizontal: 20,
							fontSize: 18,
							paddingTop: 20,
						}}>Acesse sua conta para ter acesso à essa página.</Text>
						<TouchableOpacity
							style={{
								marginTop: 10,
								width: 340,
								height: 45,
								borderRadius: 20,
								backgroundColor: colors.verdeFinddo,
								alignItems: "center",
								justifyContent: "center",
							}} onPress={() => this.props.navigation.navigate("Auth")}
						>
							<Text style={{
								fontSize: 18,
								color: colors.branco,
								textAlign: "center",
							}}>LOGIN</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		);

	}

}
