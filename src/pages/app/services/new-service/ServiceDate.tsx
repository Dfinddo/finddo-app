/* eslint-disable require-await */
import React from "react";
import {StyleSheet} from "react-native";
import {Layout} from "@ui-kitten/components";
import {useSwitch} from "hooks";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import DataForm, { DataFormOnSubmitProps } from "components/DataForm";
import { useDispatch, useSelector } from "react-redux";
import { Service } from "stores/modules/services/types";
import { State } from "stores/index";
import { updateNewService } from "stores/modules/services/actions";

type ServiceDateScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceDate"
>;

// const screenWidth = Math.round(Dimensions.get("window").width);

const ServiceDate = ((props: ServiceDateScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const serviceStore = useSelector<State, Service>(state =>
		state.services.newService
	);
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onAdvanceAttempt = async (data: DataFormOnSubmitProps): Promise<void> => {
		dispatch(updateNewService({
			...serviceStore,
			...data,
		}));
		if (!(serviceStore.hora_inicio && serviceStore.hora_fim))
			setFillAttemptAsFailed();
		else props.navigation.navigate("ServicePhotos");
	};

	return (
		<Layout level="2" style={styles.container}>
			<DataForm
				serviceStore={serviceStore}
				forceErrorDisplay={hasFailedToFillForm}
				onSubmit={onAdvanceAttempt}
			/>
		</Layout>
	);
});

export default ServiceDate;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		paddingVertical: 24,
		alignItems: "center",
	},
	// modalDialogContainer: {
	// 	flex: 1,
	// 	alignItems: "center",
	// 	justifyContent: "center",
	// },
	// modalDialogContent: {
	// 	width: 340,
	// 	borderRadius: 18,
	// 	opacity: 1,
	// 	alignItems: "center",
	// },
});
