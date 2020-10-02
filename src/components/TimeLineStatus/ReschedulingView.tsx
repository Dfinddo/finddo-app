/* eslint-disable react-native/no-color-literals */
import React, {FC, useMemo, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {Button, Layout, Text, Modal} from "@ui-kitten/components";

import UserStore from "stores/user-store";
import ServiceStore from "stores/service-store";

import {format} from "date-fns";

import DataForm from "components/DataForm";

interface ReschedulingViewProps {
	userStore: UserStore;
	serviceStore: ServiceStore;
	setIsLoading(condition: boolean): void;
}

const ReschedulingView: FC<ReschedulingViewProps> = ({
	userStore,
	serviceStore,
	setIsLoading,
}) => {
	const [isReschedule, setIsReschedule] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const initialDate = useMemo(() => new Date(serviceStore.serviceDate), []);

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

	return (
		<>
			{serviceStore &&
				(serviceStore.rescheduling ? (
					<View>
						<Text>
							{`${format(
								new Date(serviceStore.rescheduling.date_order),
								"dd/MM/yyyy",
							)} entre ${serviceStore.rescheduling.hora_inicio} e ${
								serviceStore.rescheduling.hora_fim
							}`}
						</Text>
						{userStore.userType === "user" ? (
							<View style={styles.buttonGroup}>
								<Button
									style={styles.button}
									status="primary"
									onPress={() =>
										serviceStore.reschedulingAcceptedService(true)
									}
								>
									ALTERAR
								</Button>
								<Button
									style={styles.button}
									status="danger"
									onPress={() =>
										serviceStore.reschedulingAcceptedService(false)
									}
								>
									NÃO ALTERAR
								</Button>
							</View>
						) : (
							<View>
								<Text>Aguardando resposta do cliente</Text>
							</View>
						)}
					</View>
				) : (
					<View>
						<Text>{`${format(
							new Date(serviceStore.serviceDate),
							"dd/MM/yyyy",
						)} entre ${serviceStore.startTime} e ${
							serviceStore.endTime
						}`}</Text>
						{userStore.userType === "professional" ? (
							<Text
								style={styles.text}
								status="primary"
								onPress={() => setIsReschedule(true)}
							>
								REAGENDAR
							</Text>
						) : (
							<Text>Aguardando resposta do profissional</Text>
						)}
					</View>
				))}
			<Modal
				visible={isReschedule}
				backdropStyle={styles.backdrop}
				style={styles.modalContainer}
				onBackdropPress={() => setIsReschedule(false)}
			>
				<Layout level="2" style={styles.modalContent}>
					<DataForm
						serviceStore={serviceStore}
						initialDate={initialDate}
					/>
				</Layout>
				<Button onPress={handleUpdateSchedule}>REAGENDAR</Button>
			</Modal>
		</>
	);
};

export default ReschedulingView;

const styles = StyleSheet.create({
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
	text: {
		textAlign: "center",
		textDecorationLine: "underline",
		fontSize: 12,
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});