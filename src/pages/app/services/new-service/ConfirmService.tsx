import React, {FC, useState, useCallback} from "react";
import {StyleSheet, Alert} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import {Layout, Button} from "@ui-kitten/components";
import {ScrollView} from "react-native-gesture-handler";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Service } from "stores/modules/services/types";
import { UserState } from "stores/modules/user/types";
import { pick } from "utils";
import finddoApi from "finddo-api";
import { clearNewService, setServices } from "stores/modules/services/actions";

type ConfirmServiceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ConfirmService"
>;

const orderApiFields = [
	"category_id",
	"description",
	"user_id",
	"urgency",
	"start_order",
	"previous_budget",
	"previous_budget_value",
	"filtered_professional",
	"hora_inicio",
	"hora_fim",
] as const;

const addressApiFields = [
	"cep",
	"name",
	"district",
	"street",
	"number",
	"complement",
] as const;

const ConfirmService: FC<ConfirmServiceScreenProps> = (props => {
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const serviceStore = useSelector<State, Service>(state => state.services.newService);
	const userStore = useSelector<State, UserState>(state => state.user);

	const handleSubmitService = useCallback(async () => {
		setIsLoading(true);

		const data = {
			category_id: serviceStore.category.id,
			user_id: userStore.id,
			start_order: `${serviceStore.serviceDate.toDateString()} ${serviceStore.hora_inicio}`,
			hora_inicio: serviceStore.hora_inicio,
			hora_fim: serviceStore.hora_fim,
		};

		const order = pick({...serviceStore, ...data}, orderApiFields);

		const address = pick(
			{...serviceStore.address, name: serviceStore.address.name},
			addressApiFields,
		);

		const images: any[] = [];

		if(serviceStore.images)serviceStore.images.map((image, i) =>
			images.push({
				base64: image.data,
				file_name: `${userStore.id}_${serviceStore.hora_inicio}_photo${i + 1}`,
			}),
		);

		try {
			await finddoApi.post("/orders", {
				order,
				address,
				images,
			});

			const params = {page: 1};

			const response = await finddoApi.get(`/orders/user/active`, {params});
			const {items, total_pages: total} = response.data;

			dispatch(setServices({
				items,
				page: 1,
				total,
			}));
			
			Alert.alert("Serviço cadastrado com sucesso");
		} catch (error) {
			if (error.message === "Invalid service data")
				Alert.alert("Erro no envio do serviço, tente novamente");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			dispatch(clearNewService())
			
			setIsLoading(false);
			props.navigation.navigate("Services", {screen: "MyServices"});
		}
	}, [serviceStore, userStore, props, dispatch]);

	return (
		<Layout level="3">
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ScrollView style={styles.serviceView}>
				<ServiceDataDisplay serviceStore={serviceStore} />
			</ScrollView>

			<Button style={styles.button} onPress={handleSubmitService}>
				CONFIRMAR
			</Button>
		</Layout>
	);
});

const styles = StyleSheet.create({
	serviceView: {
		height: "85%",
	},
	button: {
		marginTop: "5%",
		marginHorizontal: 16,
	},
});

export default ConfirmService;
