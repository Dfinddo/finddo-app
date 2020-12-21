/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useState, useCallback} from "react";
import {Alert, StyleSheet, ImageBackground, View, StyleProp, ImageStyle} from "react-native";
import {Avatar, Button, Text, Card, Modal, Layout, useStyleSheet, StyleService} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import {ScrollView} from "react-native-gesture-handler";

import {SvgXml} from "react-native-svg";

import {ServicesStackParams} from "src/routes/app";
import {serviceCategories, serviceStatusDescription} from "finddo-api";

import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {priceFormatter} from "utils";
import {BACKEND_URL_STORAGE} from "@env";

import {star} from "assets/svg/star";
import {starSolid} from "assets/svg/star-solid";
import {format} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Service, ServiceList } from "stores/modules/services/types";
import { UserState } from "stores/modules/user/types";

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

// {{APIUrl}}/api/v2/orders/rate/:order_id?user_rate=4.5&professional_rate=3.4


const starIcon = (value: number, current: number): JSX.Element => (
	<SvgXml xml={current >= value ? starSolid : star} width={24} height={24} />
);

const ServiceClosure = ({route, navigation}: ServiceClosureScreenProps): JSX.Element => {
	const styles = useStyleSheet(themedStyles);
	const [serviceStore, setServiceStore] = useState<
		Service | undefined
	>();
	const [isLoading, setIsLoading] = useState(false);
	const [rate, setRate] = useState(0);

	const [isBudgetDetails, setIsBudgetDetails] = useState(false);

	const dispatch = useDispatch();
	const serviceListStore = useSelector<State, ServiceList>(state => state.services.list);
	const userStore = useSelector<State, UserState>(state => state.user);

	useEffect(() => {
		if (route.params?.id)
			setServiceStore(
				serviceListStore.items.find(({id}) => route.params.id === id),
			);
	}, [route.params?.id, serviceListStore, serviceStore]);

	if (serviceStore === void 0 || !serviceStore.category.id) return <View></View>;

	const info: InfoData =
		userStore.user_type === "user"
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
							{serviceCategories[serviceStore.category.id].name}
						</Text>
						{serviceStore.budget && (
							<Text 
								onPress={() => setIsBudgetDetails(true)}
								style={styles.total} 
								status="primary"
							>
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
								style={styles.avatar as StyleProp<ImageStyle>}
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
								{serviceStatusDescription[serviceStore.order_status]}
							</Text>
						</Card>
					</View>
					<Button style={styles.button}>Encerrar serviço</Button>
				</ScrollView>
				{serviceStore.budget && (
					<Modal
						visible={isBudgetDetails}
						backdropStyle={styles.backdrop}
						style={styles.modalContainer}
						onBackdropPress={() => setIsBudgetDetails(false)}
					>
						<Layout level="2" style={styles.modalContent}>
							<Text style={styles.title}>Cálculo do serviço</Text>
							<View style={styles.viewText}>
								<Text style={styles.textPrice}>
									{priceFormatter(
										serviceStore.budget.budget.toString(),
									)}
								</Text>
								<Text style={styles.text}>(Serviço)</Text>
							</View>
							<View style={styles.viewText}>
								<Text style={styles.textPrice}>
									{priceFormatter(
										(
											serviceStore.budget.value_with_tax -
											serviceStore.budget.budget
										).toString(),
									)}
								</Text>
								<Text style={styles.text}>(Finddo)</Text>
							</View>
							<View style={styles.viewText}>
								<Text style={styles.textPrice}>
									{priceFormatter(
										serviceStore.budget.material_value.toString(),
									)}
								</Text>
								<Text style={styles.text}>(Produtos)</Text>
							</View>
							<View style={styles.viewTotal}>
								<Text style={styles.textTotal}>
									TOTAL:{"     "}
									<Text style={styles.textPrice}>
										{priceFormatter(
											(
												serviceStore.budget.value_with_tax +
												serviceStore.budget.material_value
											).toString(),
										)}
									</Text>
								</Text>
									</View>
							<Button onPress={() => setIsBudgetDetails(false)}>
								OK
							</Button>
						</Layout>
				</Modal>
			)}
			</ImageBackground>
		);
	};

export default ServiceClosure;

const themedStyles = StyleService.create({
	// view
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
		marginLeft: 8,
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
	// modal
	modalContainer: {
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		height: "56%",
		width: "60%",
	},
	modalContent: {
		flex: 1,
		padding: "6%",
		marginBottom: "5%",
		borderRadius: 8,
	},
	textTotal: {
		fontSize: 16,
		color: "grey",
		alignSelf: "center",
	},
	textPrice: {
		fontSize: 20,
		color: "color-primary-default",
	},
	viewText: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 16,
	},
	text: {
		color: "color-primary-default",
		fontSize: 16,
		marginTop: 8,
	},
	viewTotal: {
		width: "100%",
		alignSelf: "center",
		padding: 16,
		marginBottom: 16,
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
