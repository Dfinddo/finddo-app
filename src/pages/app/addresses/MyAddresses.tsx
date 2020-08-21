import React, {useState, useEffect, useCallback} from "react";
import {View, StyleSheet, Alert} from "react-native";
import {Button, List, ListItem, Icon, Layout} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {useAddressList, useUser} from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AddressStackParams} from "src/routes/app";
import {StackScreenProps} from "@react-navigation/stack";
import AddressStore from "stores/address-store";

type MyAddressesScreenProps = StackScreenProps<
	AddressStackParams,
	"MyAddresses"
>;

const MyAddresses = observer<MyAddressesScreenProps>(({navigation}) => {
	const [addressStore, setAddressStore] = useState<AddressStore | undefined>(
		new AddressStore(),
	);
	const [isLoading, setIsLoading] = useState(false);
	const addressListStore = useAddressList();
	const userStore = useUser();

	useEffect(() => {
		setIsLoading(true);
		try {
			addressListStore.fetchAddresses(userStore);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
		setIsLoading(false);
	}, [addressListStore, userStore]);

	const handleDeleteAddress = useCallback(
		(id: string): void => {
			try {
				Alert.alert("Finddo", "Deseja excluir o endereço selecionado?", [
					{text: "Não"},
					{
						text: "Sim",
						onPress: () => addressStore?.deleteAddressById(id),
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
		[addressStore],
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
