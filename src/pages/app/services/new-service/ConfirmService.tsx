import React, {FC, useState, useCallback} from "react";
import {StyleSheet, Alert} from "react-native";
import {useService, useUser} from "hooks";
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

	const handleSubmitService = useCallback(async () => {
		setIsLoading(true);
		try {
			await serviceStore.saveService(userStore);
		} catch (error) {
			if (error.message === "Invalid service data")
				Alert.alert("Erro no envio do serviço, tente novamente");
			else if (error.message === "Connection error")
				Alert.alert("Falha ao conectar");
			else throw error;
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			// props.navigation.navigate();
		}
	}, [serviceStore, userStore]);

	return (
		<Layout level="3">
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ScrollView>
				<ServiceDataDisplay serviceStore={serviceStore} />
			</ScrollView>
			<Button style={styles.button} onPress={handleSubmitService}>
				CONFIRMAR
			</Button>
		</Layout>
	);
});

const styles = StyleSheet.create({
	button: {
		marginTop: "5%",
	},
});

export default ConfirmService;
