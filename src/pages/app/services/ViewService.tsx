import React, {useEffect, useState} from "react";
import {StyleSheet, Alert, View} from "react-native";
import {Button, Layout} from "@ui-kitten/components";
import {useServiceList, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import ServiceStore from "stores/service-store";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackActions} from "@react-navigation/native";

type ViewServiceScreenProps = StackScreenProps<
	ServicesStackParams,
	"ViewService"
>;

const ViewService = observer<ViewServiceScreenProps>(({route, navigation}) => {
	const [serviceStore, setServiceStore] = useState<ServiceStore | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const serviceListStore = useServiceList();
	const userStore = useUser();

	useEffect(() => {
		if (route.params?.id)
			setServiceStore(
				serviceListStore.list.find(({id}) => route.params.id === id),
			);
	}, [route.params?.id, serviceListStore.list]);

	if (serviceStore === void 0) return null;

	const handleAssociateService = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await serviceStore.associateProfessionalOrder(userStore);
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
		userStore.userType === "professional" &&
		serviceStore.status === "analise"
	) {
		return (
			<Layout level="1" style={styles.container}>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<View style={styles.containerDetails}>
					<ServiceDataDisplay serviceStore={serviceStore} />
				</View>
				<Button onPress={handleAssociateService}>ASSOCIAR AO PEDIDO</Button>
			</Layout>
		);
	}

	return <ServiceDataDisplay serviceStore={serviceStore} />;
});

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
		height: "85%",
		alignItems: "center",
	},
});
