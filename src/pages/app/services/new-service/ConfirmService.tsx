import React, {FC, useState, useCallback} from "react";
import {StyleSheet, Alert} from "react-native";
import {useService, useServiceList, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import {Layout, Button} from "@ui-kitten/components";
import {ScrollView} from "react-native-gesture-handler";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";

type ConfirmServiceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ConfirmService"
>;

const ConfirmService: FC<ConfirmServiceScreenProps> = observer<
	ConfirmServiceScreenProps
>(props => {
	const [isLoading, setIsLoading] = useState(false);
	const serviceStore = useService();
	const userStore = useUser();
	const serviceListStore = useServiceList();

	const handleSubmitService = useCallback(async () => {
		setIsLoading(true);
		try {
			await serviceStore.saveService(userStore);
			Alert.alert("Serviço cadastrado com sucesso");
		} catch (error) {
			if (error.message === "Invalid service data")
				Alert.alert("Erro no envio do serviço, tente novamente");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			await serviceListStore.updateServiceList();
			setIsLoading(false);
			props.navigation.navigate("Services", {screen: "MyServices"});
		}
	}, [serviceStore, userStore, serviceListStore, props]);

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
