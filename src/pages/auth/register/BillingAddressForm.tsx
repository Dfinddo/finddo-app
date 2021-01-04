/* eslint-disable require-await */
import React, { useCallback, useState } from "react";
import AddressForm, { AddressFormData } from "components/AddressForm";
import {useSwitch} from "hooks";
import {Layout} from "@ui-kitten/components";
import {ScrollView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { updateUser } from "stores/modules/user/actions";

type BillingAddressFormScreenProps = StackScreenProps<
	RegisterStackParams,
	"BillingAddressForm"
>;

const BillingAddressForm = ((props: BillingAddressFormScreenProps): JSX.Element => {
	const userStore = useSelector<State, UserState>(state => state.user);
	const dispatch = useDispatch();
	
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onAdvanceAttempt = useCallback(async (data: AddressFormData): Promise<void> => {
		if (data.hasErrors)setFillAttemptAsFailed()

		dispatch(updateUser({...userStore, billingAddress: {...data.address}}));
		props.navigation.navigate("LoginDataForm");

	}, [props.navigation, setFillAttemptAsFailed, dispatch, userStore]);

	return (
		<Layout level="1" style={styles.container}>
			<ScrollView>
				<AddressForm
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
