/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useMemo} from "react";
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
		const [isReschedule, setIsReschedule] = useState(false);

		const serviceListStore = useServiceList();
		const userStore = useUser();
		const theme = useTheme();

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

		useEffect(() => {
			if (route.params?.id)
				setServiceStore(
					serviceListStore.list.find(({id}) => route.params.id === id),
				);
		}, [route.params?.id, serviceListStore.list]);

		const data = useMemo(() => {
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
							<Text>O cliente solicitou orçamento presencial</Text>
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
							xml={status >= 3 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Serviço em execução",
					icon: (
						<SvgXml
							xml={status >= 4 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
				{
					title: "Concluído",
					icon: (
						<SvgXml
							xml={status >= 5 ? bolaCheia : bolaApagada}
							width={16}
							height={16}
						/>
					),
				},
			];
		}, [serviceStore, navigation]);

		const renderDetail = (
			rowData: typeof data[0],
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
			} catch (error) {
				if (error.message === "Invalid service data")
					Alert.alert("Erro no envio do serviço, tente novamente");
				else if (error.message === "Connection error")
					Alert.alert("Falha ao conectar");
				else throw error;
				setIsLoading(false);
			} finally {
				setIsLoading(false);
				Alert.alert("Serviço alterado com sucesso");
			}
		};

		if (serviceStore === void 0) return null;

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
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
		padding: "5%",
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
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
