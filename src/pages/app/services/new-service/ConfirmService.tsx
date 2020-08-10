import React, {FC} from "react";
import {StyleSheet} from "react-native";
import {useService} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";

type ConfirmServiceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ConfirmService"
>;

const ConfirmService: FC = observer(props => {
	const serviceStore = useService();

	return <ServiceDataDisplay serviceStore={serviceStore} />;
});

const visualizarPedidoStyle = StyleSheet.create({
	titulos: {
		paddingHorizontal: 13,
		textAlign: "left",
		fontSize: 25,
		width: "100%",
		fontWeight: "bold",
		marginTop: 10,
	},
	textos: {
		paddingHorizontal: 13,
		textAlign: "left",
		fontSize: 18,
		width: "100%",
		marginTop: 5,
	},
});

export default ConfirmService;
