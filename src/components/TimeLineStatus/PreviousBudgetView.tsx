import React, {FC, useCallback, useMemo, useState} from "react";
import {Alert, View} from "react-native";
import {
	Button,
	Layout,
	Modal,
	StyleService,
	Text,
	useStyleSheet,
} from "@ui-kitten/components";
import {priceFormatter} from "utils";
import {StackNavigationProp} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import { UserState } from "stores/modules/user/types";
import { Service } from "stores/modules/services/types";
import finddoApi, { ConversationApiResponse } from "finddo-api";
import { useDispatch, useSelector } from "react-redux";
import { updateService } from "stores/modules/services/actions";
import { sendAutomaticMessage } from "src/utils/automaticMessage";
import { State } from "stores/index";

interface PreviousBudgetViewProps {
	userStore: UserState;
	serviceStore: Service;
	setIsLoading(condition: boolean): void;
	navigation: StackNavigationProp<ServicesStackParams, "ServiceStatus">;
}

const PreviousBudgetView: FC<PreviousBudgetViewProps> = ({
	userStore,
	serviceStore,
	setIsLoading,
	navigation,
}) => {
	const styles = useStyleSheet(themedStyles);
	const dispatch = useDispatch();
	const chatInfo = useSelector<State, ConversationApiResponse | undefined>(
		state => state.chats.chatLists.default.list.find(
			chat => chat.order_id === serviceStore.id
		)
	);

	const [isBudgetDetails, setIsBudgetDetails] = useState(false);

	const handleBudgetApprove = useCallback(
		async (approve: boolean) => {
			setIsLoading(true);

			try {			
				if (!approve) {
					Alert.alert(
						"Finddo",
						"Deseja renegociar com o profissional ou buscar por um novo?",
						[
							{
								text: "Renegociar",
								onPress: async () => {
									await finddoApi.post("/orders/budget_approve", {
										id: serviceStore.id,
										accepted: approve,
									});
									if(serviceStore.professional_order && chatInfo){
										await sendAutomaticMessage({
											order: serviceStore,
											user: userStore,
											reason: "renegotiate",
										})
										navigation.navigate("Chat", {
											order_id: chatInfo.order_id,
											receiver_id: chatInfo.another_user_id,
											isAdminChat: false,
											title: chatInfo.title,
											photo: serviceStore.professional_photo,
										});
									}
								},
							},
							{
								text: "Cancelar negociação",
								onPress: async () => {
									await finddoApi.post("/orders/budget_approve", {
										id: serviceStore.id,
										accepted: approve,
									});
									await finddoApi.put(`/orders/disassociate/${serviceStore.id}`)
								}
							},
						],
					);
				} else {
					Alert.alert(
						"Finddo",
						"Deseja mesmo aceitar o orçamento feito pelo profissional?",
						[
							{
								text: "Sim",
								onPress: async () => {
									await finddoApi.post("/orders/budget_approve", {
										id: serviceStore.id,
										accepted: approve,
									});
								},
							},
							{
								text: "Não",
							},
						],
					);
				}

				await finddoApi.get(`/orders/${serviceStore.id}`).then(response => {
					dispatch(updateService(response.data));
				});
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
		},
		[serviceStore, setIsLoading, dispatch, userStore, navigation, chatInfo],
	);

	const getPrevious = useMemo(() => serviceStore.previous_budget, [
		serviceStore,
	]);

	return (
		<>
			{!getPrevious ? (
				<Text>
					{userStore.user_type === "professional" ? "O cliente" : "Você"}{" "}
					solicitou orçamento presencial.
				</Text>
			) : (
				<>
					{serviceStore.budget ? (
						<Text
							onPress={() => setIsBudgetDetails(true)}
							style={styles.price}
						>
							{priceFormatter(
								(
									serviceStore.budget.value_with_tax +
									serviceStore.budget.material_value
								).toString(),
							)}
						</Text>
					) : (
						<Text>Aguardando orçamento do profissional</Text>
					)}
					{userStore.user_type === "professional" &&
						serviceStore.budget &&
						!serviceStore.budget?.accepted && (
							<Text>Aguardando aprovação do cliente</Text>
						)}
					{userStore.user_type === "professional" ? (
						<>
							{!serviceStore.budget ? (
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
								<Text
									style={styles.textLink}
									status="primary"
									onPress={() => {
										if (serviceStore && serviceStore.id) {
											navigation.navigate("ServiceBudget", {
												id: serviceStore.id,
											});
										}
									}}
								>
									RENEGOCIAR
								</Text>
							)}
						</>
					) : (
						serviceStore.budget && !serviceStore.budget.accepted && (
							<View style={styles.buttonGroup}>
								<Button
									onPress={() => handleBudgetApprove(true)}
									style={styles.button}
								>
									ACEITAR
								</Button>
								<Button
									onPress={() => handleBudgetApprove(false)}
									style={styles.button}
									status="danger"
								>
									RENEGOCIAR
								</Button>
							</View>
						)
					)}
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
				</>
			)}
		</>
	);
};

export default PreviousBudgetView;

const themedStyles = StyleService.create({
	title: {
		fontSize: 24,
		alignSelf: "center",
		fontWeight: "bold",
		paddingBottom: 8,
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
	textLink: {
		textAlign: "center",
		textDecorationLine: "underline",
		fontSize: 12,
	},
	viewTotal: {
		width: "100%",
		alignSelf: "center",
		padding: 16,
		marginBottom: 16,
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
	timeLineButton: {
		width: "60%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
	},
	buttonGroup: {
		maxWidth: "98%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	button: {
		height: 24,
		alignSelf: "center",
		margin: 16,
	},
	price: {
		width: "100%",
		fontSize: 24,
		fontWeight: "bold",
		paddingHorizontal: 8,
		paddingTop: 4,
	},
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
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
