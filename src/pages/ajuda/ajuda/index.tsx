import React, {useState} from "react";
import {ImageBackground, ScrollView, Linking, Alert} from "react-native";
import {termos} from "../../cadastros/termos";
import {sobre} from "../sobre-o-app";
import {politica} from "../../cadastros/politica";
import {Layout, TabView, Tab, Text} from "@ui-kitten/components";

const openChat = (): void => {

	// TODO: remover esse telefone e colocar nos environments
	const PHONE = 5521980503130;
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

// TODO: Add contact button
export default function(): JSX.Element {

	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<ImageBackground
			style={backgroundImageStyle}
			source={require("../../../img/Ellipse.png")}>
			<TabView
				selectedIndex={selectedIndex}
				onSelect={index => setSelectedIndex(index)}>
				<Tab title="Sobre o App">
					<Layout>
						<ScrollView style={textContainerStyle}>
							<Text>{sobre}</Text>
						</ScrollView>
					</Layout>
				</Tab>
				<Tab title="Termos de uso">
					<Layout>
						<ScrollView style={textContainerStyle}>
							<Text>{termos}</Text>
						</ScrollView>
					</Layout>
				</Tab>
				<Tab title="Politica de privacidade">
					<Layout>
						<ScrollView style={textContainerStyle}>
							<Text>{politica}</Text>
						</ScrollView>
					</Layout>
				</Tab>
			</TabView>
		</ImageBackground>
	);

}

const backgroundImageStyle = {width: "100%", height: "100%"};
const textContainerStyle = {padding: 20, paddingTop: 0};
