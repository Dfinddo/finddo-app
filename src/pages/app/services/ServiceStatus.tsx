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

import {ScrollView} from "react-native-gesture-handler";
import {format} from "date-fns";

import PreviousBudgetView from "components/TimelineStatusComponents/PreviousBudgetView";

type ServiceStatusScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceStatus"
>;

interface ITimeLineDataRender {
	title: string;
	body?: JSX.Element | undefined;
	icon: JSX.Element;
}

const statusIcon = (current: number, status: number): JSX.Element => (
	<SvgXml
		xml={status >= current ? bolaCheia : bolaApagada}
		width={16}
		height={16}
	/>
);

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
					icon: statusIcon(0, status),
				},
				{
					title: "Orçamento prévio?",
					body: (
						<Layout style={styles.timeLineLayout} level="3">
							{serviceStore && (
								<PreviousBudgetView
									userStore={userStore}
									serviceStore={serviceStore}
									setIsLoading={setIsLoading}
									navigation={navigation}
								/>
							)}
						</Layout>
					),
					icon: statusIcon(1, status),
				},
				{
					title: "Aguardando data do serviço",
					body: (
						<Layout style={styles.timeLineLayout} level="3">
							{serviceStore?.startTime && (
								<Text>
									{serviceStore.rescheduling
										? serviceStore.rescheduling.date_order
										: format(serviceStore.serviceDate, "dd/MM/yyyy")}
								</Text>
							)}
							<Button
								style={styles.timeLineButton}
								onPress={() => setIsReschedule(true)}
							>
								REAGENDAR
							</Button>
						</Layout>
					),
					icon: statusIcon(2, status),
				},
				{
					title: "Profissional a caminho",
					icon: statusIcon(4, status),
				},
				{
					title: "Serviço em execução",
					icon: statusIcon(5, status),
				},
				{
					title: "Concluído",
					icon: statusIcon(6, status),
				},
			];
		}, [serviceStore, navigation, userStore]);

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
				await serviceStore?.reschedulingCreateService(userStore);
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
					{userStore.userType === "user" && (
						<Text
							status="danger"
							style={styles.textOptionsService}
							onPress={handleCancelOrder}
						>
							CANCELAR PEDIDO
						</Text>
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
	textOptionsService: {
		width: "70%",
		textAlign: "center",
		alignSelf: "center",
		textDecorationLine: "underline",
		fontSize: 12,
		margin: 8,
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
