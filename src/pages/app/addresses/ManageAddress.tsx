import React, {useState, useEffect, FC, useCallback} from "react";
import {ScrollView, StyleSheet, Alert} from "react-native";
import {useSwitch} from "hooks";
import {Layout} from "@ui-kitten/components";
import AddressForm, { AddressFormData } from "components/AddressForm";
import {StackScreenProps} from "@react-navigation/stack";
import {AddressStackParams} from "src/routes/app";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Address } from "stores/modules/adresses/types";
import finddoApi from "finddo-api";
import { updateAdressesList } from "stores/modules/adresses/actions";

type ManageAddressScreenProps = StackScreenProps<
	AddressStackParams,
	"ManageAddress"
>;

const ManageAddress: FC<ManageAddressScreenProps> = ({navigation, route}) => {
	const [addressStore, setAddressStore] = useState<Address>({
		id: "",
		cep: "",
		addressAlias: "",
		state: "",
		city: "",
		district: "",
		street: "",
		number: "",
		complement: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const addressList = useSelector<State, Address[]>(state => 
		state.adresses.list
	);
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	useEffect(() => {
		if (route.params && route.params.id){
			const getAddress = addressList.find(({id}) => route.params?.id === id);

			if(getAddress)setAddressStore(getAddress);
		}
	}, [route.params, addressList]);

	const onSaveAttempt = useCallback(async (data: AddressFormData): Promise<void> => {
		try {
			setIsLoading(true);
			if (data.hasErrors) return setFillAttemptAsFailed();
			const response = data.address.id
				? await finddoApi.put(`/addresses/${data.address.id}`, {address:{...data.address}})
				: await finddoApi.post("/addresses", {address:{...data.address}});

			dispatch(updateAdressesList(response.data));
			navigation.goBack();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			Alert.alert("Erro ao tentar atualizar endereço, tente novamente");
		} finally {
			setIsLoading(false);
		}
	}, [navigation, setFillAttemptAsFailed]);

	if (addressStore === void 0) return null;

	return (
		<Layout level="1" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ScrollView>
				<AddressForm
					addressStore={addressStore}
					forceErrorDisplay={hasFailedToFillForm}
					onSubmitForm={onSaveAttempt}
				/>
				{/* <Button style={styles.button} onPress={onSaveAttempt}>
					CONTINUAR
				</Button> */}
			</ScrollView>
		</Layout>
	);
};

export default ManageAddress;

const styles = StyleSheet.create({
	container: {flex: 1},
	// button: {margin: 16},
});
