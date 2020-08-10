import {SvgXml} from "react-native-svg";
import {bolaCheia} from "assets/svg/bola-cheia";
import {bolaApagada} from "assets/svg/bola-apagada";
import tutorialImages from "assets/svg/tutorial-steps";
import {fechar} from "assets/svg/fechar";
import React, {useState, useEffect, useCallback, FC} from "react";
import {View, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Button, Modal, Text} from "@ui-kitten/components";
import AsyncStorage from "@react-native-community/async-storage";

const useInitialDisplay = (): [boolean, () => void] => {
	const [wasDisplayed, setWasDisplayed] = useState(true);

	useEffect(() => {
		AsyncStorage.getItem("tutorial-realizado").then(query =>
			setWasDisplayed(Boolean(query)),
		);
	}, []);

	const markAsDisplayed = useCallback(
		() =>
			void AsyncStorage.setItem("tutorial-realizado", "true").then(() =>
				setWasDisplayed(true),
			),
		[],
	);

	return [wasDisplayed, markAsDisplayed];
};

const Tutorial: FC = () => {
	const [wasDisplayed, markAsDisplayed] = useInitialDisplay();
	const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

	const incrementTutorialStep = () =>
		void setCurrentTutorialStep(currentTutorialStep + 1);
	const decrementTutorialStep = () =>
		void setCurrentTutorialStep(currentTutorialStep - 1);

	return (
		<Modal visible={!wasDisplayed}>
			<View style={styles.modalStyle}>
				<TouchableOpacity
					onPress={markAsDisplayed}
					style={styles.closeIcon}
				>
					<SvgXml xml={fechar} width={20} height={20} />
				</TouchableOpacity>
				<View style={styles.topWrapper}>
					{
						[
							// First Page
							<Text key={0} style={styles.tutorialPagesTitles}>
								Bem-vindo(a) à Fin<Text status="primary">dd</Text>o!
							</Text>,

							// Second Page
							<Text key={1} style={styles.tutorialPagesTitles}>
								Informe o problema
							</Text>,

							// Third Page
							<Text key={2} style={styles.tutorialPagesTitles}>
								O profissional irá informar o valor do serviço e só o
								realizará em caso de aprovação.
							</Text>,

							// Fourth Page
							<Text key={3} style={styles.tutorialPagesTitles}>
								Todos os nossos profissionais parceiros são{" "}
								<Text status="primary">qualificados</Text> e
								verificados.
							</Text>,
						][currentTutorialStep]
					}
				</View>
				<View style={styles.middleWrapper}>
					{currentTutorialStep > 0 ? (
						<TouchableOpacity
							onPress={decrementTutorialStep}
							style={styles.arrowIcon}
						>
							<Icon name="keyboard-arrow-left" size={35} color="gray" />
						</TouchableOpacity>
					) : (
						<View style={styles.arrowIcon}></View>
					)}
					<View style={styles.middleContent}>
						<SvgXml
							xml={tutorialImages[currentTutorialStep]}
							width={200}
							height={200}
						></SvgXml>
						{
							[
								// First Page
								<Text key={0} style={styles.tutorialPagesContent}>
									Nunca foi tão <Text status="primary">fácil </Text>
									realizar uma manutenção em sua residência.
								</Text>,

								// Second Page
								<Text key={1} style={styles.tutorialPagesContent}>
									e agende uma visita de nossos profissionais
									parceiros.
								</Text>,

								// Third Page
								<Text key={2} style={styles.tutorialPagesContent}>
									O pagamento será feito no{" "}
									<Text status="primary">cartão</Text>.
								</Text>,

								// Fourth Page
								<Button key={3} onPress={markAsDisplayed}>
									CONCLUIR
								</Button>,
							][currentTutorialStep]
						}
					</View>
					{currentTutorialStep < 3 ? (
						<TouchableOpacity
							onPress={incrementTutorialStep}
							style={styles.arrowIcon}
						>
							<Icon name="keyboard-arrow-right" size={35} color="gray" />
						</TouchableOpacity>
					) : (
						<View style={styles.arrowIcon}></View>
					)}
				</View>
				<View style={styles.bottomWrapper}>
					{Array(4)
						.fill(0)
						.map((_, i) => (
							<SvgXml
								key={i}
								xml={
									currentTutorialStep === i ? bolaCheia : bolaApagada
								}
								style={styles.pageIndicator}
								width={15}
								height={15}
							/>
						))}
				</View>
			</View>
		</Modal>
	);
};

export default Tutorial;

const styles = StyleSheet.create({
	modalStyle: {
		width: 320,
		height: 520,
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
	pageIndicator: {marginHorizontal: 10},
});
