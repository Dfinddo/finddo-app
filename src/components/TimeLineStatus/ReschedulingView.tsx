/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-native/no-color-literals */
import React, {FC, useMemo, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {Button, Layout, Text, Modal} from "@ui-kitten/components";

import {format} from "date-fns";

import DataForm from "components/DataForm";

import { UserState } from "stores/modules/user/types";
import { Service } from "stores/modules/services/types";
import finddoApi from "finddo-api";
import { updateService } from "stores/modules/services/actions";
import { useDispatch } from "react-redux";

interface ReschedulingViewProps {
	userStore: UserState;
	serviceStore: Service;
	setIsLoading(condition: boolean): void;
}

const ReschedulingView: FC<ReschedulingViewProps> = ({
	userStore,
	serviceStore,
	setIsLoading,
}) => {
	const [isReschedule, setIsReschedule] = useState(false);

	const dispatch = useDispatch();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const initialDate = useMemo(() => new Date(serviceStore.serviceDate), []);

	const handleUpdateSchedule = async (): Promise<void> => {
		setIsLoading(true);
		setIsReschedule(false);

		const rescheduling = {
			date_order: format(serviceStore.serviceDate, "dd/MM/yyyy"),
			hora_inicio: serviceStore.hora_inicio,
			hora_fim: serviceStore.hora_fim,
			professional_accepted:
				userStore.user_type === "professional" ? true : null,
			user_accepted: userStore.user_type === "user" ? true : null,
		};

		try {
			await finddoApi.post(`/orders/${serviceStore.id}/reschedulings`, {
				rescheduling,
			});

			const response = await finddoApi.get(`/orders/${serviceStore.id}`);

			dispatch(updateService(response.data));
			
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
						{userStore.user_type === "user" ? (
							<View style={styles.buttonGroup}>
								<Button
									style={styles.button}
									status="primary"
									onPress={async () => {
										await finddoApi.put(`/orders/${serviceStore.id}/reschedulings/${true}`);
										const response = await finddoApi.get(`/orders/${serviceStore.id}`);

										dispatch(updateService(response.data));
									}}
								>
									ALTERAR
								</Button>
								<Button
									style={styles.button}
									status="danger"
									onPress={async () => {
										await finddoApi.put(`/orders/${serviceStore.id}/reschedulings/${false}`);
										const response = await finddoApi.get(`/orders/${serviceStore.id}`);

										dispatch(updateService(response.data));
									}}
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
						)} entre ${serviceStore.hora_inicio} e ${
							serviceStore.hora_fim
						}`}</Text>
						{userStore.user_type === "professional" ? (
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
