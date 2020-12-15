/* eslint-disable require-await */
import React, { useCallback, useState } from "react";
import AddressForm, { AddressFormData } from "components/AddressForm";
import {useSwitch} from "hooks";
import {Layout, Button} from "@ui-kitten/components";
import {Alert, ScrollView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { Address } from "stores/modules/adresses/types";
import { updateUser } from "stores/modules/user/actions";

type BillingAddressFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"BillingAddressForm"
>;

const BillingAddressForm = ((props: BillingAddressFormScreenProps): JSX.Element => {
	const userStore = useSelector<State, UserState>(state => state.user);
	const dispatch = useDispatch();

	console.log(userStore);
	// const {billingAddress: addressStore} = userStore;
	const [addressStore, setAddressStore] = useState<Address>({
		id: "",
		cep: "",
		name: "",
		state: "",
		city: "",
		district: "",
		street: "",
		number: "",
		complement: "",
	});
	
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onAdvanceAttempt = useCallback(async (data: AddressFormData): Promise<void> => {
		if (data.hasErrors)setFillAttemptAsFailed()

		dispatch(updateUser({...userStore, ...addressStore, billingAddress: {...addressStore}}));
		props.navigation.navigate("LoginDataForm");

	}, [props.navigation, setFillAttemptAsFailed, dispatch, userStore, addressStore]);

	return (
		<Layout level="1" style={styles.container}>
			<ScrollView>
				<AddressForm
					addressStore={addressStore}
					forceErrorDisplay={hasFailedToFillForm}
					onSubmitForm={onAdvanceAttempt}
				/>
			</ScrollView>
		</Layout>
	);
});

export default BillingAddressForm;

const styles = StyleSheet.create({
	container: {flex: 1},
});
