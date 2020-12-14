import React, {useEffect, useState} from "react";
import {StyleSheet, Alert, View} from "react-native";
import {Button, Layout, Text} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackActions} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Service, ServiceList } from "stores/modules/services/types";
import { UserState } from "stores/modules/user/types";
import finddoApi, { isRegistered } from "finddo-api";
import { updateService } from "stores/modules/services/actions";
import { sendAutomaticMessageAdm } from "src/utils/automaticMessage";

type ViewServiceScreenProps = StackScreenProps<
	ServicesStackParams,
	"ViewService"
>;

const ViewService = ({route, navigation}: ViewServiceScreenProps): JSX.Element => {
	const [serviceStore, setServiceStore] = useState<Service | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const userStore = useSelector<State, UserState>(state => state.user);
	const serviceListStore = useSelector<State, ServiceList>(state => state.services.list);

	useEffect(() => {
		if (route.params?.id)
			setServiceStore(
				serviceListStore.items.find(({id}) => route.params.id === id),
			);
	}, [route.params?.id, serviceListStore.items]);

	if (serviceStore === void 0) return <View></View>;

	const handleAssociateService = async (): Promise<void> => {
		setIsLoading(true);
		try {
			if (userStore.user_type === "user" || !await(isRegistered({
				email: userStore.email,
				cellphone: userStore.cellphone,
				cpf: userStore.cpf
			})))
			throw new Error("Unauthorized user");

			await finddoApi.put(`/orders/associate/${serviceStore.id}/${userStore.id}`);

			const response = await finddoApi.get(`/orders/${serviceStore.id}`);

			dispatch(updateService(response.data));

			navigation.dispatch(StackActions.pop(1));
			navigation.navigate("ServiceStatus", {id: serviceStore.id as number});
			Alert.alert("Serviço associado com sucesso");
		} catch (error) {
			if (error.message === "Invalid service data")
				Alert.alert("Erro na associação do serviço, tente novamente");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	if (
		userStore.user_type === "professional" &&
		serviceStore.status === "analise"
	) {
		return (
			<Layout level="1" style={styles.container}>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<View style={styles.containerDetails}>
					<ServiceDataDisplay serviceStore={serviceStore} />
				</View>
				<Button onPress={handleAssociateService}>ASSOCIAR AO PEDIDO</Button>
				{/* TODO: Adicionar ação ao botão */}
				{serviceStore.previous_budget && (
					<Text status="danger" style={styles.text} onPress={async () => {
						await sendAutomaticMessageAdm({
							order: serviceStore,
							user: userStore,
							reason: "cant_previous",
						})

						Alert.alert(
							"Uma mensagem foi enviada para o suporte",
							"Sua solicitação foi enviada para análise, entre nas suas conversa na aba suporte para mais informações",
						);
					}}>
						EXIGE ORÇAMENTO PRESENCIAL
					</Text>
				)}
			</Layout>
		);
	}

	return <ServiceDataDisplay serviceStore={serviceStore} />;
};

export default ViewService;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		paddingTop: 30,
		alignItems: "center",
	},
	containerDetails: {
		width: "100%",
		height: "80%",
		alignItems: "center",
	},
	text: {
		fontSize: 11,
		textDecorationLine: "underline",
		marginTop: 24,
	},
});
