/* eslint-disable require-await */
import React, {useState, useEffect, useCallback} from "react";
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
	Alert,
} from "react-native";
import {
	Button,
	Text,
	Layout,
	Autocomplete,
	AutocompleteItem,
	Icon,
} from "@ui-kitten/components";
import {useSwitch} from "hooks";
import AddressForm, { AddressFormData } from "components/AddressForm";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { Service } from "stores/modules/services/types";
import { Address, AdressesState } from "stores/modules/adresses/types";
import finddoApi, { AddressApiResponse } from "finddo-api";
import { setAdressesList } from "stores/modules/adresses/actions";
import { updateNewService } from "stores/modules/services/actions";

type ServiceAddressScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceAddress"
>;

const filter = (item: Address, query: string): boolean =>
	item.name.toLowerCase().includes(query.toLowerCase());

const ServiceAddress = ((props: ServiceAddressScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const userStore = useSelector<State, UserState>(state => state.user);
	const newService = useSelector<State, Service>(state =>
		state.services.newService
	);
	const addressListStore = useSelector<State, AdressesState>(state => state.adresses);

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

	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = React.useState<Address[]>([]);
	const [value, setValue] = useState<string | undefined>();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);

	const getAdresses = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			const response = await finddoApi.get(`/addresses/user/${userStore.id}`);
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
	}, [dispatch, userStore]);

	useEffect(() => void getAdresses(), [getAdresses]);

	useEffect(()=>{
		setData(addressListStore.list);
	}, [addressListStore]);


	const onSaveAttempt = useCallback(async (data: AddressFormData): Promise<void> => {
		try {
			setIsLoading(true);
			if (data.hasErrors) return setFillAttemptAsFailed();

			dispatch(updateNewService({
				...newService,
				address: data.address,
			}));
			props.navigation.navigate("ConfirmService");
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			Alert.alert("Erro ao tentar atualizar endereço, tente novamente");
		} finally {
			setIsLoading(false);
		}
	}, [props.navigation, setFillAttemptAsFailed, dispatch, newService]);

	const onSelect = (index: number): void => {
		setValue(addressListStore.list[index].name);
	};

	const onChangeText = (query: string): void => {
		setValue(query);
		setData(data.filter(item => filter(item, query)));
	};

	const renderOption = (item: Address, index: number): JSX.Element => (
		<AutocompleteItem key={index} title={item.name} />
	);

	const clearInput = (): void => {
		setValue("");
		setData(addressListStore.list);
	};

	const renderCloseIcon = (props: any): JSX.Element => (
		<TouchableWithoutFeedback onPress={clearInput}>
			<Icon {...props} name="close" />
		</TouchableWithoutFeedback>
	);

	const handleAutoCompleteForm = useCallback((): void => {
		setAddressStore(
			addressListStore.list.find(item => item.name === value) || {} as Address
		);
	}, [addressListStore,value]);

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
							accessoryRight={renderCloseIcon}
							style={styles.searchAddress}
						>
							{addressListStore.list.map(renderOption)}
						</Autocomplete>
						<Button
							onPress={handleAutoCompleteForm}
							style={styles.searchAddressButton}
						>
							OK
						</Button>
					</View>

					<AddressForm
						addressStore={addressStore}
						forceErrorDisplay={hasFailedToFillForm}
						onSubmitForm={onSaveAttempt}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
		</Layout>
	);
});

export default ServiceAddress;

const styles = StyleSheet.create({
	formWrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	pickUpAddress: {
		alignItems: "center",
		alignSelf: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
		width: "90%",
		margin: 16,
	},
	searchAddress: {
		flex: 1,
		height: 26,
		width: "100%",
		borderBottomRightRadius: 0,
		borderTopRightRadius: 0,
	},
	searchAddressButton: {
		height: 24,
		alignItems: "center",
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,
	},
});
