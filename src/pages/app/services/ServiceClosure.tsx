/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useCallback} from "react";
import {Alert, StyleSheet, ImageBackground, View} from "react-native";
import {Avatar, Button, Text, Card} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ScrollView} from "react-native-gesture-handler";

import {SvgXml} from "react-native-svg";

import {useServiceList, useUser} from "hooks";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import {serviceCategories, serviceStatusDescription} from "finddo-api";

import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {priceFormatter} from "utils";
import {BACKEND_URL_STORAGE} from "@env";

import {star} from "assets/svg/star";
import {starSolid} from "assets/svg/star-solid";
import {format} from "date-fns";

type ServiceClosureScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceClosure"
>;

interface InfoData {
	name: string | undefined;
	photo: {
		uri: string;
	};
}

const starIcon = (value: number, current: number): JSX.Element => (
	<SvgXml xml={current >= value ? starSolid : star} width={24} height={24} />
);

const ServiceClosure = observer<ServiceClosureScreenProps>(
	({route, navigation}) => {
		const [serviceStore, setServiceStore] = useState<
			ServiceStore | undefined
		>();
		const [isLoading, setIsLoading] = useState(false);
		const [rate, setRate] = useState(0);

		const serviceListStore = useServiceList();
		const userStore = useUser();

		useEffect(() => {
			if (route.params?.id)
				setServiceStore(
					serviceListStore.list.find(({id}) => route.params.id === id),
				);
		}, [route.params?.id, serviceListStore.list, serviceStore]);

		if (serviceStore === void 0 || !serviceStore.categoryID) return null;

		const info: InfoData =
			userStore.userType === "user"
				? {
						name: serviceStore.professional_order?.name,
						photo: {
							uri: `${BACKEND_URL_STORAGE}${serviceStore.professional_photo}`,
						},
				  }
				: {
						name: serviceStore.user?.name,
						photo: {
							uri: `${BACKEND_URL_STORAGE}${serviceStore.user_photo}`,
						},
				  };

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
				<ScrollView style={styles.scrollViewContent}>
					<TaskAwaitIndicator isAwaiting={isLoading} />
					<Card style={styles.card}>
						<Text style={styles.title}>
							{serviceCategories[serviceStore.categoryID].name}
						</Text>
						{serviceStore.budget && (
							<Text style={styles.total} status="primary">
								{priceFormatter(
									(
										serviceStore.budget.value_with_tax +
										serviceStore.budget.material_value
									).toString(),
								)}
							</Text>
						)}
					</Card>
					<Card style={styles.card}>
						<View style={styles.infoView}>
							<Avatar
								style={styles.avatar}
								source={info.photo || require("assets/sem-foto.png")}
							/>
							<Text style={styles.name}>{info.name}</Text>
						</View>
						<View style={styles.rate}>
							<Button
								style={styles.buttonRate}
								onPress={() => (rate === 1 ? setRate(0) : setRate(1))}
								accessoryLeft={() => starIcon(1, rate)}
							/>
							<Button
								style={styles.buttonRate}
								onPress={() => (rate === 2 ? setRate(0) : setRate(2))}
								accessoryLeft={() => starIcon(2, rate)}
							/>
							<Button
								style={styles.buttonRate}
								onPress={() => (rate === 3 ? setRate(0) : setRate(3))}
								accessoryLeft={() => starIcon(3, rate)}
							/>
							<Button
								style={styles.buttonRate}
								onPress={() => (rate === 4 ? setRate(0) : setRate(4))}
								accessoryLeft={() => starIcon(4, rate)}
							/>
							<Button
								style={styles.buttonRate}
								onPress={() => (rate === 5 ? setRate(0) : setRate(5))}
								accessoryLeft={() => starIcon(5, rate)}
							/>
						</View>
					</Card>
					<View style={styles.details}>
						<Card style={styles.smallCard}>
							<Text>Data agendada:</Text>
							<Text>
								{format(serviceStore.serviceDate, "dd/MM/yyyy")}
							</Text>
						</Card>
						<Card style={styles.smallCard}>
							<Text>
								{serviceStatusDescription[serviceStore.status]}
							</Text>
						</Card>
					</View>
					<Button style={styles.button}>Encerrar serviço</Button>
				</ScrollView>
			</ImageBackground>
		);
	},
);

export default ServiceClosure;

const styles = StyleSheet.create({
	backgroundImageContent: {
		width: "100%",
		height: "100%",
	},
	scrollViewContent: {
		width: "100%",
	},
	card: {
		width: "85%",
		height: 168,
		alignSelf: "center",
		borderRadius: 8,
		marginTop: 16,
	},
	title: {
		fontSize: 26,
		textAlign: "center",
		margin: 12,
	},
	total: {
		fontSize: 24,
		textAlign: "center",
	},
	name: {
		fontSize: 20,
		textAlign: "right",
		marginTop: 8,
	},
	infoView: {
		width: "90%",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	avatar: {
		width: 80,
		height: 80,
	},
	rate: {
		width: "90%",
		marginTop: 4,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	buttonRate: {
		backgroundColor: "transparent",
		borderColor: "transparent",
	},
	details: {
		width: "90%",
		alignSelf: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	smallCard: {
		width: "45%",
		height: 80,
		alignSelf: "center",
		borderRadius: 8,
		marginTop: 16,
		marginHorizontal: 8,
	},
	button: {
		width: "90%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
	},
});
