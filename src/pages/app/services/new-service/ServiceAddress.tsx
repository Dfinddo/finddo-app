import React, {useState, useEffect} from "react";
import {
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Button, Text, Layout} from "@ui-kitten/components";
import {useService, useAddressList, useSwitch} from "hooks";
import {observer} from "mobx-react-lite";
import AddressForm from "components/AddressForm";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";

type ServiceAddressScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceAddress"
>;

const ServiceAddress = observer<ServiceAddressScreenProps>(props => {
	const [isLoading, setIsLoading] = useState(false);
	const serviceStore = useService();
	const addressStore = serviceStore.address;
	const addressListStore = useAddressList();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onSaveAttempt = (): void => {
		if (addressStore.hasErrors) return setFillAttemptAsFailed();
		props.navigation.navigate("ConfirmService");
	};

	return (
		<Layout level="3">
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : void 0}
					// keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
					style={styles.formWrapper}
				>
					<Text category="h1">Definir Endereço</Text>
					<AddressForm
						addressStore={addressStore}
						forceErrorDisplay={hasFailedToFillForm}
					/>
					<Button onPress={onSaveAttempt}>CONTINUAR</Button>
				</KeyboardAvoidingView>
			</ScrollView>
		</Layout>
	);
});

export default ServiceAddress;

const styles = StyleSheet.create({
	backgroundImageContent: {width: "100%", height: "100%"},
	formWrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
});
