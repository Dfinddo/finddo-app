/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useCallback, useEffect} from "react";
import {Alert, StyleSheet, ImageBackground, View} from "react-native";
import {Button, Text} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";

import {ServicesStackParams} from "src/routes/app";
// import {ServiceStatusEnum} from "finddo-api";

import {ScrollView} from "react-native-gesture-handler";
import TimeLineStatus from "components/TimeLineStatus";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import finddoApi, {ConversationApiResponse, ServiceStatusEnum} from "finddo-api";
import { sendAutomaticMessage, sendAutomaticMessageAdm } from "src/utils/automaticMessage";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { Service, ServiceList } from "stores/modules/services/types";
import { updateService } from "stores/modules/services/actions";

type ServiceStatusScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceStatus"
>;

const ServiceStatus = ({route, navigation}: ServiceStatusScreenProps): JSX.Element => {
		const [serviceStore, setServiceStore] = useState<Service | undefined>();
		const [isLoading, setIsLoading] = useState(false);
		const {id} = route.params;

		const dispatch = useDispatch();
		const servicesListStore = useSelector<State, ServiceList>(state => state.services.list);
		const userStore = useSelector<State, UserState>(state => state.user);

		useEffect(() => {
			if(id) {
				const selected = servicesListStore.items.find(item => item.id === id);

				if(selected?.order_status === "em_servico") navigation.navigate("ServiceClosure",{
					id,
				})

				setServiceStore(servicesListStore.items.find(item => item.id === id))
			}
		}, [id, servicesListStore, navigation]);

		// const handleDisassociateProfessional = useCallback(async () => {
		// 	setIsLoading(true);
		// 	const message =
		// 		userStore.userType === "user"
		// 			? "Deseja buscar outro profissional para o atendimento?"
		// 			: "Deseja realmente abandonar o serviço?";

		// 	try {
		// 		Alert.alert("Finddo", message, [
		// 			{text: "Sim"},
		// 			{
		// 				text: "Não",
		// 				onPress: () =>
		// 					serviceStore?.disassociateProfessionalOrder().then(() => {
		// 						if (userStore.userType === "professional") {
		// 							navigation.goBack();
		// 						}
		// 					}),
		// 			},
		// 		]);

		// 		await serviceStore?.refreshServiceData();
		// 	} catch (error) {
		// 		if (error.response) {
		// 			Alert.alert("Erro", "Verifique sua conexão e tente novamente");
		// 		} else if (error.request) {
		// 			Alert.alert(
		// 				"Falha ao se conectar",
		// 				"Verifique sua conexão e tente novamente",
		// 			);
		// 		} else throw error;
		// 	} finally {
		// 		setIsLoading(false);
		// 	}
		// }, [serviceStore, userStore, navigation]);

		const handleProfessionalDontAttend = useCallback(async () => {
			if(!serviceStore) return;
			
			setIsLoading(true);

			try {
				if(!serviceStore || !serviceStore.id) throw new Error("É preciso existir um serviço");

				await sendAutomaticMessage({
					user: userStore,
					order: serviceStore,
					reason: "not_attend",
				}, true);

				navigation.navigate("Chat", {
					order_id: serviceStore.id,
					receiver_id: 1,
					isAdminChat: true,
					title: `${serviceStore.category.name  } - Suporte`,
				});
			} catch (error) {
				throw new Error("Houve um erro ao tentar cancelar o pedido");
			} finally {
				setIsLoading(false);
			}	
		}, [navigation, serviceStore, userStore]);

		const handleCancelOrder = useCallback(async () => {
			if(!serviceStore) return;
			
			setIsLoading(true);

			try {
				Alert.alert("Finddo", "Deseja cancelar o pedido?", [
					{
						text: "Sim",
						onPress: async () => {
							setIsLoading(true);
							
							try {			
								if(!serviceStore || !serviceStore.id) throw new Error("É preciso existir um serviço");

								await sendAutomaticMessage({
									user: userStore,
									order: serviceStore,
									reason: "cancel",
								}, true);
								// serviceStore?.cancelOrder().then(() => {
								// 	navigation.goBack();
								// })
								navigation.navigate("Chat", {
									order_id: serviceStore.id,
									receiver_id: 1,
									isAdminChat: true,
									title: `${serviceStore.category.name  } - Suporte`,
								});
							} catch (error) {
								throw new Error("Houve um erro ao tentar cancelar o pedido");
							} finally {
								setIsLoading(false);
							}
						},
					},
					{text: "Não"},
				]);

				const response = await finddoApi.get(`/orders/${serviceStore.id}`);

				dispatch(updateService(response.data));
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
		}, [serviceStore, userStore, dispatch, navigation]);

		const handleServiceClosure = useCallback(() => {
			if (serviceStore)
				navigation.navigate("ServiceClosure", {
					id: serviceStore.id as number,
				});
		}, [serviceStore, navigation]);

		if (serviceStore === void 0) return <View></View>;

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
					{userStore.user_type === "user" &&
						// (serviceStore.order_status === "a_caminho" ||
						// 	serviceStore.order_status === "em_servico") && 
						(
							<>
								<Button
									style={styles.timeLineButton}
									onPress={handleServiceClosure}
								>
									Profissional chegou a residência
								</Button>
								<Text
									status="danger"
									style={styles.textOptionsService}
									onPress={handleProfessionalDontAttend}
								>
									O profissional ainda não compareceu na residência
								</Text>
							</>
						)}
					{userStore.user_type === "user" &&
						ServiceStatusEnum[serviceStore?.order_status] < 5 && (
							<Text
								status="danger"
								style={styles.textOptionsService}
								onPress={handleCancelOrder}
							>
								CANCELAR PEDIDO
							</Text>
						)}
					{userStore.user_type === "professional" &&
					ServiceStatusEnum[serviceStore?.order_status] === 4 ? (
						<Text style={styles.textOptionsService}>
							Aguardando cliente confirmar realização do serviço
						</Text>
					) : ServiceStatusEnum[serviceStore?.order_status] === 5 ? (
						<Text style={styles.textOptionsService}>
							Aguardando cliente confirmar realização do serviço
						</Text>
					) : null}

					{/* {ServiceStatusEnum[serviceStore?.status || "analise"] > 0 && (
						<Text
							status="danger"
							style={styles.textOptionsService}
							onPress={handleDisassociateProfessional}
						>
							{userStore.userType === "professional"
								? "SAIR DO SERVIÇO"
								: "BUSCAR OUTRO PROFISSIONAL"}
						</Text>
					)} */}
				</ScrollView>
			</ImageBackground>
		);
	};

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
		fontSize: 12,
		marginBottom: 24,
	},
});
