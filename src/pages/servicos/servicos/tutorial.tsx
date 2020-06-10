import {SvgXml} from "react-native-svg";
import {bolaCheia} from "../../../img/svg/bola-cheia";
import {bolaApagada} from "../../../img/svg/bola-apagada";
import tutorialImages from "../../../img/svg/tutorial-steps";
import {fechar} from "../../../img/svg/fechar";
import React, {useState, useEffect} from "react";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Button, Modal} from "@ui-kitten/components";
import {colors} from "../../../colors";
import AsyncStorage from "@react-native-community/async-storage";


const useInitialDisplay = (): [boolean, () => void] => {

	const [wasDisplayed, setWasDisplayed] = useState(true);

	useEffect(() => {

		AsyncStorage.getItem("tutorial-realizado")
			.then(query => setWasDisplayed(Boolean(query)));

	});

	const markAsDisplayed = () => void AsyncStorage
		.setItem("tutorial-realizado", "true")
		.then(() => setWasDisplayed(true));

	return [wasDisplayed, markAsDisplayed];

};


export default (): JSX.Element => {

	const [wasDisplayed, markAsDisplayed] = useInitialDisplay();
	const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

	const incrementTutorialStep =
		() => void setCurrentTutorialStep(currentTutorialStep + 1);
	const decrementTutorialStep =
		() => void setCurrentTutorialStep(currentTutorialStep - 1);

	return (
		<Modal visible={true || !wasDisplayed}>
			<View style={styles.modalStyle}>
				<TouchableOpacity
					onPress={markAsDisplayed}
					style={styles.closeIcon}>
					<SvgXml
						xml={fechar}
						width={20} height={20}
					/>
				</TouchableOpacity>
				<View style={styles.topWrapper}>
					{[
						<Text style={styles.tutorialPagesTitles}>
							Bem-vindo(a) à
							Fin<Text style={{color: colors.verdeFinddo}}>dd</Text>o!
						</Text>,

						<Text style={styles.tutorialPagesTitles}>
							Informe o problema
						</Text>,

						<Text style={styles.tutorialPagesTitles}>
							O profissional irá informar o valor do serviço e
							só o realizará em caso de aprovação.
						</Text>,

						<Text style={styles.tutorialPagesTitles}>
							Todos os nossos profissionais parceiros
							são <Text style={{color: colors.verdeFinddo}}
							>qualificados</Text> e verificados.
						</Text>,
					][currentTutorialStep]}
				</View>
				<View style={styles.middleWrapper}>
					{currentTutorialStep > 0 ?

						<TouchableOpacity
							onPress={decrementTutorialStep}
							style={styles.arrowIcon}>
							<Icon name="keyboard-arrow-left" size={35} color="gray" />
						</TouchableOpacity> :

						<View style={styles.arrowIcon}></View>

					}
					<View style={styles.middleContent}>
						<SvgXml xml={
							tutorialImages[currentTutorialStep]
						} width={200} height={200}></SvgXml>
						{[
							<Text style={styles.tutorialPagesContent}>
									Nunca foi tão <Text
									style={{color: colors.verdeFinddo}}>fácil </Text>
									realizar uma manutenção em sua residência.
							</Text>,

							<Text style={styles.tutorialPagesContent}>
									e agende uma visita de nossos
									profissionais parceiros.
							</Text>,

							<Text style={styles.tutorialPagesContent}>
									O pagamento será feito no <Text
									style={{color: colors.verdeFinddo}}>cartão</Text>.
							</Text>,

							<Button onPress={markAsDisplayed}>CONCLUIR</Button>,
						][currentTutorialStep]}
					</View>
					{currentTutorialStep < 3 ?

						<TouchableOpacity
							onPress={incrementTutorialStep}
							style={styles.arrowIcon}>
							<Icon name="keyboard-arrow-right" size={35} color="gray" />
						</TouchableOpacity> :

						<View style={styles.arrowIcon}></View>
					}
				</View>
				<View style={styles.bottomWrapper}>
					{Array(4).fill(0).map((_, i) => <SvgXml
						key={i}
						xml={currentTutorialStep === i ? bolaCheia : bolaApagada}
						style={{marginHorizontal: 10}} width={15} height={15}
					/>)}
				</View>
			</View>
		</Modal>
	);

};

const styles = StyleSheet.create({
	modalStyle: {
		width: 320,
		height: 520,
		backgroundColor: colors.branco,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	topWrapper: {
		height: 140,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	middleWrapper: {
		height: 310,
		flexDirection: "row",
	},
	bottomWrapper: {
		height: 30,
		alignItems: "center",
		flexDirection: "row",
	},
	middleContent: {
		width: 240,
		justifyContent: "space-between",
		marginTop: 10,
		alignItems: "center",
		marginBottom: 10,
	},
	tutorialPagesTitles: {
		fontSize: 26,
		marginHorizontal: 5,
		fontWeight: "bold",
		textAlign: "center",
	},
	tutorialPagesContent: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	arrowIcon: {
		height: "100%",
		width: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	closeIcon: {
		marginHorizontal: 10,
		top: 10,
		left: 280,
		position: "absolute",
	},
});
