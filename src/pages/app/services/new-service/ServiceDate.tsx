import React from "react";
import {StyleSheet} from "react-native";
import {Button, Layout} from "@ui-kitten/components";
import {useService, useSwitch} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import DataForm from "components/DataForm";

type ServiceDateScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceDate"
>;

// const screenWidth = Math.round(Dimensions.get("window").width);

const ServiceDate = observer<ServiceDateScreenProps>(props => {
	const serviceStore = useService();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);
	const onAdvanceAttempt = (): void => {
		if (!(serviceStore.startTime && serviceStore.endTime))
			setFillAttemptAsFailed();
		else props.navigation.navigate("ServicePhotos");
	};

	return (
		<Layout level="2" style={styles.container}>
			<DataForm
				serviceStore={serviceStore}
				forceErrorDisplay={hasFailedToFillForm}
			/>

			<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
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
	modalDialogContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	modalDialogContent: {
		width: 340,
		borderRadius: 18,
		opacity: 1,
		alignItems: "center",
	},
});
