import React, {useState, useEffect, FC} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {useAddressList, useSwitch} from "hooks";
import AddressStore from "stores/address-store";
import {Layout, Button} from "@ui-kitten/components";
import AddressForm from "components/AddressForm";
import {StackScreenProps} from "@react-navigation/stack";
import {AddressStackParams} from "src/routes/app";

type ManageAddressScreenProps = StackScreenProps<
	AddressStackParams,
	"ManageAddress"
>;

const ManageAddress: FC<ManageAddressScreenProps> = ({navigation, route}) => {
	const [addressStore, setAddressStore] = useState<AddressStore | undefined>(
		new AddressStore(),
	);
	const addressList = useAddressList();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const onSaveAttempt = (): void => {
		if (addressStore?.hasErrors) return setFillAttemptAsFailed();
		navigation.goBack();
	};

	useEffect(() => {
		if (route.params?.id)
			setAddressStore(
				addressList.list.find(({id}) => route.params.id === id),
			);
	}, [route.params?.id, addressList.list]);

	if (addressStore === void 0) return null;

	return (
		<Layout level="1" style={styles.container}>
			<ScrollView>
				<AddressForm
					addressStore={addressStore}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<Button onPress={onSaveAttempt}>CONTINUAR</Button>
			</ScrollView>
		</Layout>
	);
};

export default ManageAddress;

const styles = StyleSheet.create({
	container: {flex: 1},
});
