/* eslint-disable max-lines */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useMemo, useCallback} from "react";
import {
	View,
	RefreshControl,
	Alert,
	StyleSheet,
	ImageBackground,
} from "react-native";
import {Text, useTheme, Button, Layout, Modal} from "@ui-kitten/components";
import {SvgXml} from "react-native-svg";
import {observer} from "mobx-react-lite";
import TimeLine from "react-native-timeline-flatlist";
import {StackScreenProps} from "@react-navigation/stack";

import {useServiceList, useUser} from "hooks";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import {ServiceStatusEnum} from "finddo-api";
import DataForm from "components/DataForm";

import {bolaCheia} from "../../../assets/svg/bola-cheia";
import {bolaApagada} from "../../../assets/svg/bola-apagada";
import {priceFormatter} from "utils";
import {ScrollView} from "react-native-gesture-handler";

type ServiceStatusScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceStatus"
>;

interface ITimeLineDataRender {
	title: string;
	body?: JSX.Element | undefined;
	icon: JSX.Element;
}

const ServiceStatus = observer<ServiceStatusScreenProps>(
	({route, navigation}) => {
		const [serviceStore, setServiceStore] = useState<
			ServiceStore | undefined
		>();
		const [isLoading, setIsLoading] = useState(false);
		const [isReschedule, setIsReschedule] = useState(false);

		const serviceListStore = useServiceList();
		const userStore = useUser();
		const theme = useTheme();

		useEffect(() => {
			if (route.params?.id)
				setServiceStore(
					serviceListStore.list.find(({id}) => route.params.id === id),
				);
		}, [route.params?.id, serviceListStore.list]);

		const handleBudgetApprove = useCallback(
			async (approve: boolean) => {
				setIsLoading(true);

				try {
					await serviceStore?.budgetApprove(approve);

					if (!approve) {
						Alert.alert(
							"Finddo",
							"Deseja renegociar com o profissional ou buscar por um novo?",
							[
								{text: "Renegociar"},
								{
									text: "Buscar um novo",
									onPress: () =>
										serviceStore?.disassociateProfessionalOrder(),
								},
							],
						);
					}

					await serviceStore?.refreshServiceData();
				} catch (error) {
					if (error.response) {
						Alert.alert(
							"Erro",
							"Verifique sua conexão e tente novamente",
						);
					} else if (error.request) {
						Alert.alert(
							"Falha ao se conectar",
							"Verifique sua conexão e tente novamente",
						);
					} else throw error;
				} finally {
					setIsLoading(false);
				}
			},
			[serviceStore],
		);

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

		const data = useMemo((): ITimeLineDataRender[] => {
			const status: ServiceStatusEnum =
				ServiceStatusEnum[serviceStore?.status || "analise"];

			return [
				{
					title: "Pedido em análise",
					body: (
						<Button
							style={styles.timeLineButton}
							onPress={() => {
								if (serviceStore && serviceStore.id) {
									navigation.navigate("ViewService", {
										id: serviceStore.id,
									});
								}
							}}
						>
							DETALHES
						</Button>
					),
					icon: (
						<SvgXml
							xml={status >= 0 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Orçamento prévio?",
					body: (
						<Layout style={styles.timeLineLayout} level="3">
							{!serviceStore?.previous_budget ? (
								<Text>
									{userStore.userType === "professional"
										? "O cliente"
										: "Você"}{" "}
									solicitou orçamento presencial.
								</Text>
							) : (
								<>
									<Text style={styles.price}>
										{serviceStore.budget ? (
											priceFormatter(
												serviceStore.budget.budget.toString(),
											)
										) : (
											<Text>
												Aguardando orçamento do profissional
											</Text>
										)}
									</Text>
									{userStore.userType === "professional" ? (
										<Button
											style={styles.timeLineButton}
											onPress={() => {
												if (serviceStore && serviceStore.id) {
													navigation.navigate("ServiceBudget", {
														id: serviceStore.id,
													});
												}
											}}
										>
											ORÇAR
										</Button>
									) : (
										serviceStore.budget && (
											<View style={styles.buttonGroup}>
												<Button
													onPress={() => handleBudgetApprove(true)}
													style={styles.button}
												>
													ACEITAR
												</Button>
												<Button
													onPress={() =>
														handleBudgetApprove(false)
													}
													style={styles.button}
													status="danger"
												>
													RECUSAR
												</Button>
											</View>
										)
									)}
								</>
							)}
						</Layout>
					),
					icon: (
						<SvgXml
							xml={status >= 1 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Aguardando data do serviço",
					body: (
						<Button
							style={styles.timeLineButton}
							onPress={() => setIsReschedule(true)}
						>
							REAGENDAR
						</Button>
					),
					icon: (
						<SvgXml
							xml={status >= 2 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Profissional a caminho",
					icon: (
						<SvgXml
							xml={status >= 4 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Serviço em execução",
					icon: (
						<SvgXml
							xml={status >= 5 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Concluído",
					icon: (
						<SvgXml
							xml={status >= 6 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
			];
		}, [serviceStore, navigation, userStore, handleBudgetApprove]);

		const loadingService = async (): Promise<void> => {
			setIsLoading(true);
			try {
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
		};

		const renderDetail = (
			rowData: ITimeLineDataRender,
			_sectionID: number,
			_rowID: number,
		): JSX.Element => {
			const title = (
				<Text style={styles.timeLineTitle}>{rowData.title}</Text>
			);

			return (
				<View style={styles.timeLineView}>
					{title}
					{rowData.body}
				</View>
			);
		};

		const handleUpdateSchedule = async (): Promise<void> => {
			setIsLoading(true);
			setIsReschedule(false);
			try {
				await serviceStore?.updateService(userStore);
				Alert.alert("Serviço alterado com sucesso");
			} catch (error) {
				if (error.message === "Invalid service data")
					Alert.alert("Erro no envio do serviço, tente novamente");
				else if (error.message === "Connection error")
					Alert.alert("Falha ao conectar");
				else throw error;
				setIsLoading(false);
			} finally {
				setIsLoading(false);
			}
		};

		if (serviceStore === void 0) return null;

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
				<ScrollView style={styles.scrollViewContent}>
					<TimeLine
						circleColor={theme["color-primary-default"]}
						lineColor={theme["color-primary-default"]}
						innerCircle="icon"
						data={data}
						style={styles.timeLineContainer}
						renderDetail={renderDetail}
						showTime={false}
						options={{
							refreshControl: (
								<RefreshControl
									colors={[theme["color-primary-active"]]}
									refreshing={isLoading}
									onRefresh={loadingService}
								/>
							),
							removeClippedSubviews: false,
						}}
					/>
					{ServiceStatusEnum[serviceStore?.status || "analise"] > 0 && (
						<Button
							status="danger"
							style={styles.buttonOptionsService}
							onPress={handleDisassociateProfessional}
						>
							{userStore.userType === "professional"
								? "DESASSOCIAR"
								: "BUSCAR OUTRO PROFISSIONAL"}
						</Button>
					)}
					{userStore.userType === "user" && (
						<Button
							status="danger"
							style={styles.buttonOptionsService}
							onPress={handleCancelOrder}
						>
							CANCELAR PEDIDO
						</Button>
					)}
				</ScrollView>

				<Modal
					visible={isReschedule}
					backdropStyle={styles.backdrop}
					style={styles.modalContainer}
					onBackdropPress={() => setIsReschedule(false)}
				>
					<Layout level="2" style={styles.modalContent}>
						<DataForm serviceStore={serviceStore} />
					</Layout>
					<Button onPress={handleUpdateSchedule}>REAGENDAR</Button>
				</Modal>
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
		width: "60%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
	},
	modalContainer: {
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		height: "90%",
		width: "40%",
	},
	modalContent: {
		flex: 1,
		padding: "2%",
		marginBottom: "5%",
		borderRadius: 8,
	},
	buttonGroup: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	button: {
		height: 24,
		alignSelf: "center",
		margin: 16,
	},
	buttonOptionsService: {
		width: "70%",
		alignSelf: "center",
		margin: 8,
	},
	price: {
		width: "100%",
		fontSize: 24,
		fontWeight: "bold",
		paddingHorizontal: 8,
		paddingTop: 4,
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
