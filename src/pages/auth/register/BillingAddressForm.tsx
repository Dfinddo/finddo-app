import React from "react";
import {observer} from "mobx-react-lite";
import AddressForm from "components/AddressForm";
import {useAuth, useSwitch} from "hooks";
import {Layout, Button} from "@ui-kitten/components";
import {ScrollView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";

type BillingAddressFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"BillingAddressForm"
>;

const BillingAddressForm = observer<BillingAddressFormScreenProps>(props => {
	const authStore = useAuth();
	const {billingAddress: addressStore} = authStore;
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onAdvanceAttempt = (): void => {
		if (addressStore.hasErrors) return setFillAttemptAsFailed();
		props.navigation.navigate("LoginDataForm");
	};

	return (
		<Layout level="1" style={styles.container}>
			<ScrollView>
				<AddressForm
					addressStore={addressStore}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
			</ScrollView>
		</Layout>
	);
});

export default BillingAddressForm;

const styles = StyleSheet.create({
	container: {flex: 1},
});
