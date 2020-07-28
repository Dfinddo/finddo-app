import React, {useState, FC} from "react";
import {
	ImageBackground,
	ScrollView,
	Linking,
	Alert,
	StyleSheet,
	View,
} from "react-native";
import {termos} from "../auth/termos";
import {sobre} from "./sobre-o-app";
import {politica} from "../auth/politica";
import {Layout, TabView, Tab, Text, Card} from "@ui-kitten/components";
import {PHONE} from "config";
import licenses from "assets/licenses.json";

const openChat = (): void => {
	const url = `whatsapp://send?text=&phone=${PHONE}`;

	Linking.openURL(url).catch(() => {
		Alert.alert(
			"Erro",
			"Whatsapp não instalado no seu dispositivo",
			[{text: "OK"}],
			{cancelable: false},
		);
	});
};

// TODO: Add contact button
const Help: FC = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<Layout level="2" style={styles.container}>
			<TabView
				selectedIndex={selectedIndex}
				onSelect={index => setSelectedIndex(index)}
			>
				<Tab title="Sobre o App">
					<Layout>
						<ScrollView style={styles.textContainerStyle}>
							<Text>{sobre}</Text>
						</ScrollView>
					</Layout>
				</Tab>
				<Tab title="Termos de Uso">
					<Layout>
						<ScrollView style={styles.textContainerStyle}>
							<Text>{termos}</Text>
						</ScrollView>
					</Layout>
				</Tab>
				<Tab title="Politica de Privacidade">
					<Layout>
						<ScrollView style={styles.textContainerStyle}>
							<Text>{politica}</Text>
						</ScrollView>
					</Layout>
				</Tab>
				<Tab title="Software de Terceiros">
					<Layout>
						<ScrollView>
							{Object.entries(licenses).map(
								([packageName, license], i) => (
									<Card
										key={i}
										style={styles.licenseContainer}
										header={props => (
											<View {...props}>
												<Text category="h6">{packageName}</Text>
											</View>
										)}
									>
										<Text category="p1">{license}</Text>
									</Card>
								),
							)}
						</ScrollView>
					</Layout>
				</Tab>
			</TabView>
		</Layout>
	);
};

export default Help;

const styles = StyleSheet.create({
	container: {flex: 1},
	textContainerStyle: {padding: 15, paddingTop: 0},
	licenseContainer: {margin: 10},
});
