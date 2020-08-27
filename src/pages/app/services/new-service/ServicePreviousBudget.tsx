import React from "react";
import {
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Text, Button, Layout, RadioGroup, Radio} from "@ui-kitten/components";
import {useService} from "hooks";
import {observer} from "mobx-react-lite";
import {serviceCategories} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {priceFormatter, numericFormattingFilter} from "utils";

type ServicePreviousBudgetScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServicePreviousBudget"
>;

const NewService = observer<ServicePreviousBudgetScreenProps>(props => {
	const serviceStore = useService();
	const selectedCategory = serviceCategories[serviceStore.categoryID!];

	const onAdvanceAttempt = (): void => {
		props.navigation.navigate("ServiceDate");
	};

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
						<Text style={styles.title}>
							Como deseja receber o orçamento?
						</Text>
						<RadioGroup
							selectedIndex={serviceStore.previous_budget ? 0 : 1}
							onChange={index =>
								(serviceStore.previous_budget = index === 0)
							}
							style={styles.radioGroup}
						>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Orçamento prévio
									</Text>
								)}
							</Radio>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Orçamento presencial
									</Text>
								)}
							</Radio>
						</RadioGroup>
					</View>
				</KeyboardAvoidingView>
				{serviceStore.previous_budget && (
					<View style={styles.budgetContainer}>
						<Text style={styles.text}>
							Você já recebeu um orçamento? Nos informe o valor.
						</Text>
						<ValidatedMaskedInput
							style={styles.input}
							placeholder="(opcional)"
							formatter={priceFormatter}
							formattingFilter={numericFormattingFilter}
							onChangeText={input => {
								serviceStore.previous_budget_value = parseInt(
									input,
									10,
								);
							}}
							value={
								serviceStore.previous_budget_value?.toString() || ""
							}
							maxLength={11}
						/>
					</View>
				)}
				<View style={styles.continueButtonContainer}>
					<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
				</View>
			</ScrollView>
		</Layout>
	);
});

export default NewService;

const styles = StyleSheet.create({
	background: {width: "100%", height: "100%"},
	categoryImage: {width: "100%"},
	contentWrapper: {
		width: "100%",
		paddingHorizontal: 10,
		marginTop: 48,
		alignItems: "center",
	},
	continueButtonContainer: {
		marginVertical: 10,
		width: "100%",
		height: 45,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {fontSize: 22, width: "90%", textAlign: "center"},
	text: {fontSize: 16, width: "90%"},
	input: {marginTop: 8},
	radioGroup: {
		width: "90%",
		alignItems: "flex-start",
		flexDirection: "column",
		justifyContent: "space-around",
		paddingVertical: 8,
		paddingHorizontal: "15%",
	},
	radio: {fontSize: 18, marginLeft: 8},
	budgetContainer: {
		flex: 1,
		width: "100%",
		marginTop: "0.8%",
		paddingHorizontal: "5%",
	},
});
