import React, {useState, useEffect, useCallback} from "react";
import {StyleSheet, View} from "react-native";
import ValidatedInput from "components/ValidatedInput";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {cepFormatter, numericFormattingFilter, validateInput, validations} from "utils";
import TaskAwaitIndicator from "./TaskAwaitIndicator";
import { Address } from "stores/modules/adresses/types";
import { Button } from "@ui-kitten/components";

export interface AddressFormData {
	address: Address;
	hasErrors: boolean;
}
interface AddressFormProps {
	addressStore?: Address;
	forceErrorDisplay?: boolean;
	onSubmitForm(data: AddressFormData): Promise<void>; 
}

const defaultTests = [validations.required(), validations.maxLength(128)];
const cepTests = [validations.required(), validations.definedLength(8)];
const numberTests = [validations.required(), validations.maxLength(10)];
const stateTests = [validations.required(), validations.maxLength(2)];
const complementTests = [validations.maxLength(128)];

const AddressForm = ((props: AddressFormProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	const {addressStore, forceErrorDisplay, onSubmitForm} = props;

	const [id, setId] = useState("");

	const [cep, setCep] = useState("");
	const [cepError, setCepError] = useState<string|undefined>("");

	const [addressAlias, setAddressAlias] = useState("");
	const [addressAliasError, setAddressAliasError] = useState<string|undefined>("");

	const [state, setState] = useState("");
	const [stateError, setStateError] = useState<string|undefined>("");

	const [city, setCity] = useState("");
	const [cityError, setCityError] = useState<string|undefined>("");

	const [district, setDistrict] = useState("");
	const [districtError, setDistrictError] = useState<string|undefined>("");

	const [street, setStreet] = useState("");
	const [streetError, setStreetError] = useState<string|undefined>("");

	const [number, setNumber] = useState("");
	const [numberError, setNumberError] = useState<string|undefined>("");

	const [complement, setComplement] = useState("");
	const [complementError, setComplementError] = useState<string|undefined>("");

	// Função temporária enquanto serviço só ser utilizado no Rio e Brasil
	useEffect(() => {
		setState("RJ");
		setCity("Rio de Janeiro");
		
		if(addressStore){
			setId(addressStore.id);
			setCep(addressStore.cep);
			setAddressAlias(addressStore.name);
			setDistrict(addressStore.district);
			setStreet(addressStore.street);
			setNumber(addressStore.number);
			setComplement(addressStore.complement);
		}
	}, [addressStore]);

	const getAddressData = useCallback(async (): Promise<void> => {
		if (cep.length === 8) {
			setIsLoading(true);
			const {bairro, logradouro, uf, localidade} = await fetch(
				`https://viacep.com.br/ws/${cep}/json`,
			).then(response => response.json());

			setStreet(logradouro ?? "");
			setState(uf ?? "");
			setCity(localidade ?? "");
			setDistrict(bairro ?? "");

			setIsLoading(false);
		}
	}, [cep]);

	const handleSubmit = useCallback(async () => {
		const data: AddressFormData = {
			address: {
				id,
				name: addressAlias,
				cep,
				state,
				city,
				district,
				street,
				number,
				complement,
			},
			hasErrors: Boolean(addressAliasError || 
			cepError || 
			stateError || 
			cityError || 
			districtError ||
			streetError||
			numberError ||
			complementError),
		};

		await onSubmitForm(data);
	}, [
		id,
		addressAlias,
		cep,
		state,
		city,
		district,
		street,
		number,
		complement,
		addressAliasError, 
		cepError, 
		stateError, 
		cityError, 
		districtError,
		streetError,
		numberError,
		complementError,
		onSubmitForm,
	]);

	return (
		<View
			// behavior={Platform.OS === "ios" ? "padding" : "height"}
			// keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
			style={styles.cadastroForm}
		>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ValidatedMaskedInput
				formatter={cepFormatter}
				formattingFilter={numericFormattingFilter}
				onChangeText={input => {
					setCep(input);
					setCepError(validateInput(input, cepTests));
				}}
				label="CEP"
				keyboardType={"number-pad"}
				value={cep}
				error={cepError}
				forceErrorDisplay={forceErrorDisplay}
				onBlur={getAddressData}
				maxLength={9}
				returnKeyType="next"
			/>
			<ValidatedInput
				onChangeText={input => {
					setAddressAlias(input);
					setAddressAliasError(validateInput(input, defaultTests));
				}}
				label="Nome do endereço"
				value={addressAlias}
				error={addressAliasError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => {
					setState(input);
					setStateError(validateInput(input, stateTests));
				}}
				label="Estado"
				// retirar quando atender mais estados
				disabled={true}
				value={state}
				error={stateError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => {
					setCity(input);
					setCityError(validateInput(input, defaultTests));
				}}
				label="Cidade"
				// retirar quando atender mais cidades
				disabled={true}
				value={city}
				error={cityError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => {
					setDistrict(input);
					setDistrictError(validateInput(input, defaultTests));
				}}
				label="Bairro"
				value={district}
				error={districtError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => {
					setStreet(input);
					setStreetError(validateInput(input, defaultTests));
				}}
				label="Rua"
				value={street}
				error={streetError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => {
					setNumber(input);
					setNumberError(validateInput(input, numberTests));
				}}
				label="Número"
				value={number}
				error={numberError}
				forceErrorDisplay={forceErrorDisplay}
				keyboardType="number-pad"
			/>
			<ValidatedInput
				onChangeText={input => {
					setComplement(input);
					setComplementError(validateInput(input, complementTests));
				}}
				label="Complemento"
				value={complement}
				error={complementError}
				forceErrorDisplay={forceErrorDisplay}
			/>

			<Button style={styles.buttomAddressForm} onPress={handleSubmit}>
				CONTINUAR
			</Button>
		</View>
	);
});

export default AddressForm;

const styles = StyleSheet.create({
	cadastroForm: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
	},
	buttomAddressForm: {
		alignItems: "center",
		alignSelf: "center",
		height: 24,
	},
});
