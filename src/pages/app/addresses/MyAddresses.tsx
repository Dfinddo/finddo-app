import React, {useState, useEffect, useCallback} from "react";
import {View, StyleSheet, Alert} from "react-native";
import {Button, List, ListItem, Icon, Layout} from "@ui-kitten/components";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AddressStackParams} from "src/routes/app";
import {StackScreenProps} from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { AdressesState } from "stores/modules/adresses/types";
import finddoApi, { AddressApiResponse } from "finddo-api";
import { removeAddress, setAdressesList } from "stores/modules/adresses/actions";

type MyAddressesScreenProps = StackScreenProps<
	AddressStackParams,
	"MyAddresses"
>;

const MyAddresses = (({navigation}: MyAddressesScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const userStoreID = useSelector<State, string>(state => state.user.id);
	const addressListStore = useSelector<State, AdressesState>(state => state.adresses);
	const [isLoading, setIsLoading] = useState(false);
	// const addressListStore = useAddressList();

	const getAdresses = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			const response = await finddoApi.get(`/addresses/user/${userStoreID}`);
			const adresses: AddressApiResponse[] = response.data;
			
			dispatch(setAdressesList(adresses));
		} catch (error) {
			if (error.response) {
				Alert.alert("Erro", "Verifique sua conexão e tente novamente");
			} else if (error.request) {
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
				);
			} else throw error;
		} finally {
			setIsLoading(false);
		}
	}, [dispatch, userStoreID]);

	useEffect(() => void getAdresses(), [getAdresses]);

	const handleDeleteAddress = useCallback(
		(id: string): void => {
			try {
				Alert.alert("Finddo", "Deseja excluir o endereço selecionado?", [
					{text: "Não"},
					{
						text: "Sim",
						onPress: async () => {
							try {
								await finddoApi.delete(`/addresses/${id}`);
								dispatch(removeAddress(id));
							} catch (error) {
								if (error.response) throw new Error("Invalid address data");
								else if (error.request) throw new Error("Connection error");
								else throw error;
							}
						},
					},
				]);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log({error});
				Alert.alert(
					"Erro ao tentar remover o endereço. Endereço está em uso.",
				);
			}
		},
		[dispatch],
	);

	return (
		<Layout level="2" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<List
				style={styles.addressListContainer}
				data={addressListStore.list}
				renderItem={({item}) => (
					<ListItem
						title={item.addressAlias}
						description={`${item.street}, ${item.number} ${item.complement}`}
						onPress={() =>
							navigation.navigate("ManageAddress", {
								id: item.id,
							})
						}
						accessoryRight={() =>
							(!item.readOnly && (
								<View style={styles.address}>
									<Button
										size="small"
										appearance="ghost"
										status="success"
										accessoryRight={props => (
											<Icon {...props} name="star" />
										)}
									/>
									<Button
										onPress={() => {
											handleDeleteAddress(item.id);
										}}
										size="small"
										appearance="ghost"
										status="danger"
										accessoryRight={props => (
											<Icon {...props} name="close" />
										)}
									/>
								</View>
							)) as JSX.Element
						}
					/>
				)}
			/>
			<Button
				style={styles.button}
				onPress={() => navigation.navigate("ManageAddress")}
			>
				ADICIONAR ENDEREÇO
			</Button>
		</Layout>
	);
});

export default MyAddresses;

const styles = StyleSheet.create({
	container: {flex: 1},
	addressListContainer: {marginTop: 10},
	address: {flexDirection: "row"},
	button: {margin: 16},
});
