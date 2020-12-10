import React from "react";
import AddressForm from "components/AddressForm";
import {useUser, useSwitch} from "hooks";
import {Layout, Button} from "@ui-kitten/components";
import {ScrollView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";
import { useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import AddressStore from "stores/address-store";

type BillingAddressFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"BillingAddressForm"
>;

const BillingAddressForm = ((props: BillingAddressFormScreenProps): JSX.Element => {
	const userStore = useSelector<State, UserState>(state => state.user);

	console.log(userStore);
	// const {billingAddress: addressStore} = userStore;
	const addressStore = new AddressStore();
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
