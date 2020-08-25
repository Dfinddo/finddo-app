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
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import TimeLine from "react-native-timeline-flatlist";

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

		const data = useMemo(
			() => [
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
				},
				{
					title: "Orçamento prévio?",
					body: (
						<Layout style={styles.timeLineLayout} level="3">
							<Text>O cliente solicitou orçamento presencial</Text>
						</Layout>
					),
				},
				{
					title: "Aguardando data do serviço",
				},
				{
					title: "Profissional a caminho",
					body: (
						<Button style={styles.timeLineButton} onPress={() => {}}>
							Reagendar
						</Button>
					),
				},
				{
					title: "Serviço em execução",
				},
				{
					title: "Concluído",
				},
			],
			[serviceStore, navigation],
		);

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
	timeLineView: {width: "80%"},
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
