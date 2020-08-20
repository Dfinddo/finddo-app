import React, {useState, useEffect} from "react";
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import {
	Button,
	Text,
	Layout,
	Autocomplete,
	AutocompleteItem,
} from "@ui-kitten/components";
import {useService, useAddressList, useSwitch, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import AddressForm from "components/AddressForm";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import AddressStore from "stores/address-store";

type ServiceAddressScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceAddress"
>;

const filter = (item: AddressStore, query: string): boolean =>
	item.addressAlias.toLowerCase().includes(query.toLowerCase());

const ServiceAddress = observer<ServiceAddressScreenProps>(props => {
	const userStore = useUser();
	const serviceStore = useService();
	const addressStore = serviceStore.address;
	const addressListStore = useAddressList();

	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = React.useState<AddressStore[]>([]);
	const [value, setValue] = useState<string | undefined>();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	useEffect(() => {
		setIsLoading(true);
		try {
			addressListStore.fetchAddresses(userStore).then(() => {
				setData(addressListStore.list);
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
		setIsLoading(false);
	}, [addressListStore, userStore]);

	const onSaveAttempt = (): void => {
		if (addressStore.hasErrors) return setFillAttemptAsFailed();
		props.navigation.navigate("ConfirmService");
	};

	const onSelect = (index: number): void => {
		setValue(addressListStore.list[index].addressAlias);
	};

	const onChangeText = (query: string): void => {
		setValue(query);
		setData(data.filter(item => filter(item, query)));
	};

	const renderOption = (item: AddressStore, index: number): JSX.Element => (
		<AutocompleteItem key={index} title={item.addressAlias} />
	);

	const handleAutoCompleteForm = (): void => {
		Object.assign(
			addressStore,
			data.find(item => item.addressAlias === value) || {},
			{city: "Rio de Janeiro", state: "RJ"},
		);
	};

	return (
		<Layout level="3">
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : void 0}
					keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
					style={styles.formWrapper}
				>
					<Text category="h1">Definir Endereço</Text>
					<View style={styles.pickUpAddress}>
						<Autocomplete
							placeholder="Utilizar um endereço existente"
							value={value}
							onSelect={onSelect}
							onChangeText={onChangeText}
							style={styles.searchAddress}
						>
							{data.map(renderOption)}
						</Autocomplete>
						<Button
							onPress={handleAutoCompleteForm}
							style={styles.searchAddressButton}
						>
							Preencher
						</Button>
					</View>

					<AddressForm
						addressStore={addressStore}
						forceErrorDisplay={hasFailedToFillForm}
					/>
					<Button onPress={onSaveAttempt}>CONTINUAR</Button>
				</KeyboardAvoidingView>
			</ScrollView>
		</Layout>
	);
});

export default ServiceAddress;

const styles = StyleSheet.create({
	// backgroundImageContent: {width: "100%", height: "100%"},
	formWrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	pickUpAddress: {
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		margin: 16,
	},
	searchAddress: {
		height: 24,
		marginRight: 16,
	},
	searchAddressButton: {
		height: 24,
		marginTop: 16,
	},
	// modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
});
