import React, {FC} from "react";
import {StyleSheet, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Button} from "@ui-kitten/components";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";

interface ServiceAnalysisViewProps {
	userStore: UserStore;
	serviceStore: ServiceStore;
	navigation: StackNavigationProp<ServicesStackParams, "ServiceStatus">;
}

const ServiceAnalysisView: FC<ServiceAnalysisViewProps> = ({
	userStore,
	serviceStore,
	navigation,
}) => (
	<>
		<View></View>
		<Button
			style={styles.timeLineButton}
			onPress={() => {
				if (serviceStore && serviceStore.id) {
					navigation.navigate("ViewService", {
						id: serviceStore.id,
					});
				}
			}}
		>
			DETALHES DO SERVIÇO
		</Button>
	</>
);

export default ServiceAnalysisView;

const styles = StyleSheet.create({
	timeLineButton: {
		width: "60%",
		height: 24,
		alignSelf: "center",
		margin: 16,
		borderRadius: 30,
	},
});
