import React, {FC} from "react";
import {StyleSheet, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Avatar, Icon, Text} from "@ui-kitten/components";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";
import {BACKEND_URL_STORAGE} from "config";

interface ServiceAnalysisViewProps {
	userStore: UserStore;
	serviceStore: ServiceStore;
	navigation: StackNavigationProp<ServicesStackParams, "ServiceStatus">;
}

interface InfoData {
	name: string | undefined;
	photo: {
		uri: string;
	};
	rate: string | null;
}

const ServiceAnalysisView: FC<ServiceAnalysisViewProps> = ({
	userStore,
	serviceStore,
	navigation,
}) => {
	const info: InfoData =
		userStore.userType === "user"
			? {
					name: serviceStore.professional_order?.name,
					photo: {
						uri: `${BACKEND_URL_STORAGE}${serviceStore.professional_photo}`,
					},
					rate: serviceStore.rate,
			  }
			: {
					name: serviceStore.user?.name,
					photo: {
						uri: `${BACKEND_URL_STORAGE}${serviceStore.user_photo}`,
					},
					rate: serviceStore.user_rate,
			  };

	return (
		<>
			{info.name && (
				<View style={styles.infoView}>
					<Avatar
						size="medium"
						source={info.photo || require("assets/sem-foto.png")}
					/>
					<Text>{info.name}</Text>
					<View style={styles.rateView}>
						<Text status="warning">{info.rate ? info.rate : "0.0"}</Text>
						<Icon
							style={styles.icon}
							fill={"#FCBD00"}
							animation="zoom"
							name="star"
						/>
					</View>
				</View>
			)}
			<Text
				style={styles.text}
				status="primary"
				onPress={() => {
					if (serviceStore && serviceStore.id) {
						navigation.navigate("ViewService", {
							id: serviceStore.id,
						});
					}
				}}
			>
				DETALHES DO SERVIÇO
			</Text>
		</>
	);
};

export default ServiceAnalysisView;

const styles = StyleSheet.create({
	infoView: {
		width: "90%",
		marginTop: 4,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	rateView: {
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	text: {
		textAlign: "center",
		textDecorationLine: "underline",
		fontSize: 12,
	},
	icon: {
		width: 16,
		height: 16,
	},
});
