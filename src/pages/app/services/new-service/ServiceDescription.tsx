/* eslint-disable react-native/no-color-literals */
import React, {useState} from "react";
import {
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {
	Select,
	SelectItem,
	IndexPath,
	Text,
	Button,
	Modal,
	Card,
	Layout,
} from "@ui-kitten/components";
import ValidatedInput from "components/ValidatedInput";
import {useService, useSwitch} from "hooks";
import {observer} from "mobx-react-lite";
import {serviceCategories} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";

type ServiceDescriptionScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceDescription"
>;

const NewService = observer<ServiceDescriptionScreenProps>(props => {
	const [isConfirmingUrgency, setIsConfirmingUrgency] = useState(false);
	const serviceStore = useService();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);
	const selectedCategory = serviceCategories[serviceStore.categoryID!];

	const onAdvanceAttempt = (): void => {
		if (serviceStore.descriptionError) return setFillAttemptAsFailed();
		if (serviceStore.urgency === "urgent" && !isConfirmingUrgency)
			return setIsConfirmingUrgency(true);

		setIsConfirmingUrgency(false);
		props.navigation.navigate("ServicePreviousBudget");
	};

	const setUrgency = ({row}: {row: number}): void =>
		void (serviceStore.urgency = (["delayable", "urgent"] as const)[row]);

	const urgencies = ["Sem urgência", "Com urgência"] as const;

	return (
		<Layout style={styles.background}>
			<ScrollView>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<Image
						style={styles.categoryImage}
						source={selectedCategory.imageUrl}
					/>
					<View style={styles.contentWrapper}>
						<Select
							label="Urgência"
							selectedIndex={
								new IndexPath(
									{delayable: 0, urgent: 1}[serviceStore.urgency],
								)
							}
							onSelect={
								setUrgency as (index: IndexPath | IndexPath[]) => void
							}
							value={
								urgencies[
									{delayable: 0, urgent: 1}[serviceStore.urgency]
								]
							}
						>
							{urgencies.map((urgency, i) => (
								<SelectItem key={i} title={urgency} />
							))}
						</Select>
						<ValidatedInput
							label="Descrição do serviço"
							textStyle={styles.urgencyInput}
							multiline={true}
							placeholder="Nos conte o que precisa, ex.: Minha pia entupiu..."
							onChangeText={input => (serviceStore.description = input)}
							value={serviceStore.description}
							error={serviceStore.descriptionError}
							forceErrorDisplay={hasFailedToFillForm}
						/>
					</View>
					<Modal
						backdropStyle={styles.backdrop}
						style={styles.modalContainer}
						visible={isConfirmingUrgency}
					>
						<Card>
							<Text style={styles.urgencyModalText}>
								Faremos o máximo possível para lhe atender o quanto
								antes.
							</Text>
							<Text style={styles.urgencyModalText}>
								Por favor nos informe uma data e uma faixa de horário
								ideais para o atendimento.
							</Text>
							<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
						</Card>
					</Modal>
				</KeyboardAvoidingView>
			</ScrollView>
			<View style={styles.continueButtonContainer}>
				<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
			</View>
		</Layout>
	);
});

export default NewService;

const styles = StyleSheet.create({
	background: {width: "100%", height: "100%"},
	categoryImage: {width: "100%"},
	contentWrapper: {width: "100%", paddingHorizontal: 10, marginTop: 8},
	continueButtonContainer: {
		marginVertical: 10,
		width: "100%",
		height: 45,
		alignItems: "center",
		justifyContent: "center",
	},
	urgencyInput: {height: 100},
	urgencyModalText: {
		paddingHorizontal: 10,
		paddingBottom: 16,
		fontSize: 18,
	},
	modalContainer: {
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		width: "90%",
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
