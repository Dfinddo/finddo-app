import React, {FC, useCallback, useMemo} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {Button, Text} from "@ui-kitten/components";
import {priceFormatter} from "utils";
import {StackNavigationProp} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import UserStore from "stores/user-store";
import ServiceStore from "stores/service-store";

interface PreviousBudgetViewProps {
	userStore: UserStore;
	serviceStore: ServiceStore;
	setIsLoading(condition: boolean): void;
	navigation: StackNavigationProp<ServicesStackParams, "ServiceStatus">;
}

const PreviousBudgetView: FC<PreviousBudgetViewProps> = ({
	userStore,
	serviceStore,
	setIsLoading,
	navigation,
}) => {
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
								text: "Cancelar negociação",
								onPress: () =>
									serviceStore?.disassociateProfessionalOrder(),
							},
						],
					);
				}

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
		},
		[serviceStore, setIsLoading],
	);

	const getPrevious = useMemo(() => serviceStore.previous_budget, [
		serviceStore,
	]);

	return (
		<>
			{!getPrevious ? (
				<Text>
					{userStore.userType === "professional" ? "O cliente" : "Você"}{" "}
					solicitou orçamento presencial.
				</Text>
			) : (
				<>
					<Text style={styles.price}>
						{serviceStore.budget ? (
							priceFormatter(
								(
									serviceStore.budget.budget +
									serviceStore.budget.material_value
								).toString(),
							)
						) : (
							<Text>Aguardando orçamento do profissional</Text>
						)}
					</Text>
					{userStore.userType === "professional" &&
						serviceStore.budget?.accepted && (
							<Text>Aguardando orçamento do profissional</Text>
						)}
					{userStore.userType === "professional" &&
					!serviceStore.budget ? (
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
									onPress={() => handleBudgetApprove(false)}
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
		</>
	);
};

export default PreviousBudgetView;

const styles = StyleSheet.create({
	timeLineButton: {
		width: "60%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
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
	price: {
		width: "100%",
		fontSize: 24,
		fontWeight: "bold",
		paddingHorizontal: 8,
		paddingTop: 4,
	},
});
