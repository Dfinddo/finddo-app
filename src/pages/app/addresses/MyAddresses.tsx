import React, {useState, useEffect} from "react";
import {View, StyleSheet} from "react-native";
import {Button, List, ListItem, Icon, Layout} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {useAddressList, useUser} from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {AddressStackParams} from "src/routes/app";
import {StackScreenProps} from "@react-navigation/stack";

type MyAddressesScreenProps = StackScreenProps<
	AddressStackParams,
	"MyAddresses"
>;

const MyAddresses = observer<MyAddressesScreenProps>(({navigation}) => {
	const [isLoading, setIsLoading] = useState(false);
	const addressListStore = useAddressList();
	const userStore = useUser();

	useEffect(() => {
		setIsLoading(true);
		try {
			addressListStore.fetchAddresses(userStore);
		} catch (error) {
			console.log({error});
		}
		setIsLoading(false);
	}, [addressListStore, userStore]);

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
										onPress={() => void 0}
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
			<Button onPress={() => navigation.navigate("ManageAddress")}>
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
});
