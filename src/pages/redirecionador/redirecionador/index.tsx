import React, {Component} from "react";
import {View, ActivityIndicator} from "react-native";
import {colors} from "../../../colors";
import TokenService from "../../../services/token-service";
import {StackActions, NavigationActions} from "react-navigation";

export default class RedirecionadorIndex extends Component {

	public props: any;

	componentDidMount() {

		const user = TokenService.getInstance().getUser();

		if (user) {

			if (user.user_type === "user") {

				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({routeName: "Services"})],
				});

				this.props.navigation.dispatch(resetAction);

			} else {

				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({routeName: "IndexProfissional"})],
				});

				this.props.navigation.dispatch(resetAction);

			}

		} else {

			// redirect para a pagina de escolha de ser cliente ou profissional
			// caso nao haja pedido salvo em pedido service
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({routeName: "Services"})],
			});

			this.props.navigation.dispatch(resetAction);

		}

	}

	render() {

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

}
