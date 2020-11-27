import React, {useState, FC, useMemo} from "react";
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
import {
	Layout,
	TabView,
	Tab,
	Text,
	Card,
	List,
	ListItem,
} from "@ui-kitten/components";
import {PHONE} from "@env";
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

	const licensesList = useMemo(() => {
		const list = Object.entries(licenses);

		return list;
	}, []);

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
						<List
							data={licensesList}
							renderItem={({item}) => {
								const [packageName, license] = item;

								return (
									<ListItem>
										<Card
											style={styles.licenseContainer}
											header={props => (
												<View {...props}>
													<Text category="h6">{packageName}</Text>
												</View>
											)}
										>
											<Text category="p1">{license}</Text>
										</Card>
									</ListItem>
								);
							}}
						/>
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
