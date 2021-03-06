import React, {useState} from "react";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import ValidatedInput from "components/ValidatedInput";
import {observer} from "mobx-react-lite";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import AddressStore from "stores/address-store";
import {cepFormatter, numericFormattingFilter} from "utils";
import TaskAwaitIndicator from "./TaskAwaitIndicator";

interface AddressFormProps {
	addressStore: AddressStore;
	forceErrorDisplay?: boolean;
}

const AddressForm = observer<AddressFormProps>(props => {
	const [isLoading, setIsLoading] = useState(false);
	const {addressStore, forceErrorDisplay} = props;

	const getAddressData = async (): Promise<void> => {
		if (addressStore.cep.length === 8) {
			setIsLoading(true);
			const {bairro, logradouro, uf} = await fetch(
				`https://viacep.com.br/ws/${addressStore.cep}/json`,
			).then(response => response.json());

			addressStore.street = logradouro ?? "";
			addressStore.state = uf ?? "";
			addressStore.district = bairro ?? "";

			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
			style={styles.cadastroForm}
		>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<ValidatedMaskedInput
				formatter={cepFormatter}
				formattingFilter={numericFormattingFilter}
				onChangeText={input => (addressStore.cep = input)}
				label="CEP"
				keyboardType={"number-pad"}
				value={addressStore.cep}
				error={addressStore.cepError}
				forceErrorDisplay={forceErrorDisplay}
				onBlur={getAddressData}
				maxLength={9}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.addressAlias = input)}
				label="Nome do endereço"
				value={addressStore.addressAlias}
				error={addressStore.addressAliasError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.state = input)}
				label="Estado"
				value={addressStore.state}
				error={addressStore.stateError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.city = input)}
				label="Cidade"
				value={addressStore.city}
				error={addressStore.cityError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.district = input)}
				label="Bairro"
				value={addressStore.district}
				error={addressStore.districtError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.street = input)}
				label="Rua"
				value={addressStore.street}
				error={addressStore.streetError}
				forceErrorDisplay={forceErrorDisplay}
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.number = input)}
				label="Número"
				value={addressStore.number}
				error={addressStore.numberError}
				forceErrorDisplay={forceErrorDisplay}
				keyboardType="number-pad"
			/>
			<ValidatedInput
				onChangeText={input => (addressStore.complement = input)}
				label="Complemento"
				value={addressStore.complement}
				error={addressStore.complementError}
				forceErrorDisplay={forceErrorDisplay}
			/>
		</KeyboardAvoidingView>
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
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
});
