import React, {useEffect, useState} from "react";
import {StyleSheet, View, Alert} from "react-native";
import {Button} from "@ui-kitten/components";
import {useServiceList, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import ServiceStore from "stores/service-store";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {navigate} from "src/routes/rootNavigation";

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
			navigation.navigate("ServiceStatus", {id: serviceStore.id as number});
		} catch (error) {
			if (error.message === "Invalid service data")
				Alert.alert("Erro na associação do serviço, tente novamente");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			Alert.alert("Serviço associado com sucesso");
		}
	};

	if (
		userStore.userType === "professional" &&
		serviceStore.status === "analise"
	) {
		return (
			<View style={styles.container}>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<ServiceDataDisplay serviceStore={serviceStore} />
				<Button onPress={handleAssociateService}>ASSOCIAR AO PEDIDO</Button>
			</View>
		);
	}

	return <ServiceDataDisplay serviceStore={serviceStore} />;
});

export default ViewService;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 30,
		alignItems: "center",
	},
});
