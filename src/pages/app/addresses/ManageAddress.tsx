import React, {useState, useEffect, FC, useCallback} from "react";
import {ScrollView, StyleSheet, Alert} from "react-native";
import {useAddressList, useSwitch} from "hooks";
import AddressStore from "stores/address-store";
import {Layout, Button} from "@ui-kitten/components";
import AddressForm from "components/AddressForm";
import {StackScreenProps} from "@react-navigation/stack";
import {AddressStackParams} from "src/routes/app";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";

type ManageAddressScreenProps = StackScreenProps<
	AddressStackParams,
	"ManageAddress"
>;

const ManageAddress: FC<ManageAddressScreenProps> = ({navigation, route}) => {
	const [addressStore, setAddressStore] = useState<AddressStore | undefined>(
		new AddressStore(),
	);
	const [isLoading, setIsLoading] = useState(false);
	const addressList = useAddressList();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	useEffect(() => {
		if (route.params?.id)
			setAddressStore(
				addressList.list.find(({id}) => route.params?.id === id),
			);
	}, [route.params?.id, addressList.list]);

	const onSaveAttempt = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true);
			if (addressStore?.hasErrors) return setFillAttemptAsFailed();
			await addressStore?.saveAddress();
			navigation.goBack();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			Alert.alert("Erro ao tentar atualizar endereço, tente novamente");
		} finally {
			setIsLoading(false);
		}
	}, [addressStore, navigation, setFillAttemptAsFailed]);

	if (addressStore === void 0) return null;

	return (
		<Layout level="1" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ScrollView>
				<AddressForm
					addressStore={addressStore}
					forceErrorDisplay={hasFailedToFillForm}
				/>
				<Button style={styles.button} onPress={onSaveAttempt}>
					CONTINUAR
				</Button>
			</ScrollView>
		</Layout>
	);
};

export default ManageAddress;

const styles = StyleSheet.create({
	container: {flex: 1},
	button: {margin: 16},
});
