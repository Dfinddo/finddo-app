/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useCallback} from "react";
import {Alert, StyleSheet, ImageBackground} from "react-native";
import {Button, Text} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";

import {useServiceList, useUser} from "hooks";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import {ServiceStatusEnum} from "finddo-api";

import {ScrollView} from "react-native-gesture-handler";
import TimeLineStatus from "components/TimeLineStatus";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";

type ServiceStatusScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceStatus"
>;

const ServiceStatus = observer<ServiceStatusScreenProps>(
	({route, navigation}) => {
		const [serviceStore, setServiceStore] = useState<
			ServiceStore | undefined
		>();
		const [isLoading, setIsLoading] = useState(false);

		const serviceListStore = useServiceList();
		const userStore = useUser();

		useEffect(() => {
			if (route.params?.id)
				setServiceStore(
					serviceListStore.list.find(({id}) => route.params.id === id),
				);
		}, [route.params?.id, serviceListStore.list]);

		const handleDisassociateProfessional = useCallback(async () => {
			setIsLoading(true);
			const message =
				userStore.userType === "user"
					? "Deseja buscar outro profissional para o atendimento?"
					: "Deseja realmente abandonar o serviço?";

			try {
				Alert.alert("Finddo", message, [
					{text: "Sim"},
					{
						text: "Não",
						onPress: () =>
							serviceStore?.disassociateProfessionalOrder().then(() => {
								if (userStore.userType === "professional") {
									navigation.goBack();
								}
							}),
					},
				]);

				await serviceStore?.refreshServiceData();
			} catch (error) {
				if (error.response) {
					Alert.alert("Erro", "Verifique sua conexão e tente novamente");
				} else if (error.request) {
					Alert.alert(
						"Falha ao se conectar",
						"Verifique sua conexão e tente novamente",
					);
				} else throw error;
			} finally {
				setIsLoading(false);
			}
		}, [serviceStore, userStore, navigation]);

		const handleCancelOrder = useCallback(async () => {
			setIsLoading(true);

			try {
				Alert.alert("Finddo", "Deseja cancelar o pedido?", [
					{text: "Sim"},
					{
						text: "Não",
						onPress: () =>
							serviceStore?.cancelOrder().then(() => {
								navigation.goBack();
							}),
					},
				]);

				await serviceStore?.refreshServiceData();
			} catch (error) {
				if (error.response) {
					Alert.alert("Erro", "Verifique sua conexão e tente novamente");
				} else if (error.request) {
					Alert.alert(
						"Falha ao se conectar",
						"Verifique sua conexão e tente novamente",
					);
				} else throw error;
			} finally {
				setIsLoading(false);
			}
		}, [serviceStore, navigation]);

		const handleServiceClosure = useCallback(() => {
			if (serviceStore)
				navigation.navigate("ServiceClosure", {
					id: serviceStore.id as number,
				});
		}, [serviceStore, navigation]);

		if (serviceStore === void 0) return null;

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
				<ScrollView style={styles.scrollViewContent}>
					<TaskAwaitIndicator isAwaiting={isLoading} />
					<TimeLineStatus
						userStore={userStore}
						serviceStore={serviceStore}
						navigation={navigation}
					/>
					{userStore.userType === "user" && (
						<>
							<Button
								style={styles.timeLineButton}
								onPress={handleServiceClosure}
							>
								O profissional já realizou o serviço
							</Button>
							<Text
								status="danger"
								style={styles.textOptionsService}
								onPress={handleCancelOrder}
							>
								O profissional não compareceu ainda na residência
							</Text>
							<Text
								status="danger"
								style={styles.textOptionsService}
								onPress={handleCancelOrder}
							>
								CANCELAR PEDIDO
							</Text>
						</>
					)}
					{ServiceStatusEnum[serviceStore?.status || "analise"] > 0 && (
						<Text
							status="danger"
							style={styles.textOptionsService}
							onPress={handleDisassociateProfessional}
						>
							{userStore.userType === "professional"
								? "SAIR DO SERVIÇO"
								: "BUSCAR OUTRO PROFISSIONAL"}
						</Text>
					)}
				</ScrollView>
			</ImageBackground>
		);
	},
);

export default ServiceStatus;

const styles = StyleSheet.create({
	backgroundImageContent: {
		width: "100%",
		height: "100%",
	},
	scrollViewContent: {
		width: "100%",
		height: "100%",
	},
	timeLineContainer: {
		flex: 1,
		width: "100%",
		padding: "5%",
	},
	timeLineView: {width: "80%", marginTop: "-4%"},
	timeLineTitle: {fontSize: 18, color: "grey"},
	timeLineLayout: {
		minHeight: 48,
		borderRadius: 8,
		padding: "2%",
		borderColor: "grey",
		borderWidth: 1,
	},
	timeLineButton: {
		width: "90%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
	},
	textOptionsService: {
		width: "80%",
		textAlign: "center",
		alignSelf: "center",
		textDecorationLine: "underline",
		fontSize: 14,
		marginBottom: 24,
	},
});
