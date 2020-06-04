import React, {Component} from "react";
import {
	View, ImageBackground,
	ScrollView, StyleSheet,
	Linking, Alert,
} from "react-native";
import HeaderTransparenteSemHistorico from "../../../components/header-transparente-sem-historico";
import {termos} from "../../cadastros/termos";
import {sobre} from "../sobre-o-app";
import {politica} from "../../cadastros/politica";
import AccordianInfoApp from "../../../components/accordian-info-app";
import AccordianInfoContato from "../../../components/accordian-info-contato";

export default class AjudaScreen extends Component {

	public setState: any;

	static navigationOptions = {
		headerTransparent: true,
		headerTitle: () => <HeaderTransparenteSemHistorico />,
	};

	constructor(props) {

		super(props);

	}

	state = {
		faleConoscoIsOpened: false,
		termosIsOpened: false,
		sobreIsOpened: false,
		politicaPrivacidadeIsOpened: false,
	};

	changeTermosIsOpenedState = () => {

		const value = this.state.termosIsOpened;

		this.setState({termosIsOpened: !value});

	};

	changePoliticaIsOpenedState = () => {

		const value = this.state.politicaPrivacidadeIsOpened;

		this.setState({politicaPrivacidadeIsOpened: !value});

	}

	changeSobreIsOpenedState = () => {

		const value = this.state.sobreIsOpened;

		this.setState({sobreIsOpened: !value});

	};

	changeFaleConoscoIsOpenedState = () => {

		const value = this.state.faleConoscoIsOpened;

		this.setState({faleConoscoIsOpened: !value});

	};

	openChat = () => {

		// TODO: remover esse telefone e colocar nos environments
		const url = "whatsapp://send?text=" + "" + "&phone=55" + "21980503130";

		Linking.openURL(url).catch(_ => {

			Alert.alert(
				"Erro",
				"Whatsapp não instalado no seu dispositivo",
				[{text: "OK", onPress: () => { }}],
				{cancelable: false},
			);

		});

	};

	render() {

		return (
			<ImageBackground
				style={this.ajudaScreenStyle.backgroundImageContent}
				source={require("../../../img/Ellipse.png")}>
				<View style={{height: 50}}></View>
				<View style={{flex: 1}}>
					<ScrollView>
						<View style={{
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							height: 500,
						}}>
							<AccordianInfoApp
								titulo={"Sobre o App"}
								opened={this.state.sobreIsOpened}
								onPress={() => this.changeSobreIsOpenedState()}
								content={sobre}></AccordianInfoApp>
							<View style={{height: 5}} />
							<AccordianInfoApp
								titulo={"Termos de uso"}
								opened={this.state.termosIsOpened}
								onPress={() => this.changeTermosIsOpenedState()}
								content={termos}></AccordianInfoApp>
							<View style={{height: 5}} />
							<AccordianInfoApp
								titulo={"Politica de privacidade"}
								opened={this.state.politicaPrivacidadeIsOpened}
								onPress={() => this.changePoliticaIsOpenedState()}
								content={politica}></AccordianInfoApp>
							<View style={{height: 5}} />
							<AccordianInfoContato
								opened={this.state.faleConoscoIsOpened}
								onPress={() => this.changeFaleConoscoIsOpenedState()}
								onPressAction={() => this.openChat()}>
							</AccordianInfoContato>
						</View>
					</ScrollView>
				</View>
			</ImageBackground>
		);

	}

	ajudaScreenStyle = StyleSheet.create({
		backgroundImageContent: {width: "100%", height: "100%"},
	});

}
