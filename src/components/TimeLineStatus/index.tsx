/* eslint-disable react-native/no-color-literals */
import React, {useMemo, FC, useState, useEffect} from "react";
import {View, RefreshControl, Alert, StyleSheet} from "react-native";
import {Text, useTheme, Layout} from "@ui-kitten/components";
import {SvgXml} from "react-native-svg";
import TimeLine from "react-native-timeline-flatlist";

import ServiceStore from "stores/service-store";
import {StackNavigationProp} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import UserStore from "stores/user-store";
import {ServiceStatusEnum} from "finddo-api";

import PreviousBudgetView from "./PreviousBudgetView";
import ReschedulingView from "./ReschedulingView";

import {bolaCheia} from "../../assets/svg/bola-cheia";
import {bolaApagada} from "../../assets/svg/bola-apagada";
import ServiceAnalysisView from "./ServiceAnalysisView";

interface ITimeLineDataRender {
	title: string;
	body?: JSX.Element | undefined;
	icon: JSX.Element;
}

interface TimeLineStatusProps {
	userStore: UserStore;
	serviceStore: ServiceStore;
	navigation: StackNavigationProp<ServicesStackParams, "ServiceStatus">;
}

const statusIcon = (current: number, status: number): JSX.Element => (
	<SvgXml
		xml={status >= current ? bolaCheia : bolaApagada}
		width={16}
		height={16}
	/>
);

const TimeLineStatus: FC<TimeLineStatusProps> = ({
	userStore,
	serviceStore,
	navigation,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<ServiceStatusEnum>(0);
	const theme = useTheme();

	useEffect(() => {
		setStatus(ServiceStatusEnum[serviceStore?.status || "analise"]);
	}, [serviceStore]);

	const data = useMemo(
		(): ITimeLineDataRender[] => [
			{
				title: "Pedido em análise",
				body: (
					<Layout style={styles.timeLineLayout} level="3">
						<ServiceAnalysisView
							userStore={userStore}
							serviceStore={serviceStore}
							navigation={navigation}
						/>
					</Layout>
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
						{serviceStore && (
							<ReschedulingView
								userStore={userStore}
								serviceStore={serviceStore}
								setIsLoading={setIsLoading}
							/>
						)}
					</Layout>
				),
				icon: statusIcon(2, status),
			},
			{
				title: "Profissional a caminho",
				icon: statusIcon(4, status),
			},
		],
		[serviceStore, status, navigation, userStore],
	);

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
		const title = <Text style={styles.timeLineTitle}>{rowData.title}</Text>;

		return (
			<View style={styles.timeLineView}>
				{title}
				{rowData.body}
			</View>
		);
	};

	return (
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
	);
};

export default TimeLineStatus;

const styles = StyleSheet.create({
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
});