/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useMemo} from "react";
import {
	View,
	RefreshControl,
	Alert,
	StyleSheet,
	ImageBackground,
} from "react-native";
import {Text, useTheme, Button, Layout} from "@ui-kitten/components";
import {useServiceList} from "hooks";
import {SvgXml} from "react-native-svg";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import TimeLine from "react-native-timeline-flatlist";

import {bolaCheia} from "../../../assets/svg/bola-cheia";
import {bolaApagada} from "../../../assets/svg/bola-apagada";
import {ServiceStatusEnum} from "finddo-api";

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
							Detalhes do pedido
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
						<Button style={styles.timeLineButton} onPress={() => {}}>
							Reagendar
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
		width: "70%",
		alignSelf: "center",
		marginTop: 8,
		borderRadius: 30,
	},
});
