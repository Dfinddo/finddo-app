import React, { useState } from "react";
import {
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Text, Button, Layout, RadioGroup, Radio} from "@ui-kitten/components";
import {serviceCategories} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {priceFormatter, numericFormattingFilter} from "utils";
import { useDispatch, useSelector } from "react-redux";
import { Service } from "stores/modules/services/types";
import { State } from "stores/index";
import { updateNewService } from "stores/modules/services/actions";

type ServicePreviousBudgetScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServicePreviousBudget"
>;

const NewService = ((props: ServicePreviousBudgetScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const newService = useSelector<State, Service>(state => 
		state.services.newService
	);
	const selectedCategory = serviceCategories[newService.category.id!];

	const [previousBudgetValue, setPreviousBudgetValue] = useState("");

	const onAdvanceAttempt = (): void => {
		if(previousBudgetValue) {
			dispatch(updateNewService({
				...newService,
				previous_budget_value: parseInt(
					previousBudgetValue,
					10,
				),
			}));
		}
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
							selectedIndex={newService.previous_budget ? 0 : 1}
							onChange={index =>
								dispatch(updateNewService({
									...newService,
									previous_budget: index === 0,
								}))
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
				{newService.previous_budget && (
					<View style={styles.budgetContainer}>
						<Text style={styles.text}>
							Você já recebeu um orçamento? Nos informe o valor.
						</Text>
						<ValidatedMaskedInput
							style={styles.input}
							placeholder="(opcional)"
							formatter={priceFormatter}
							formattingFilter={numericFormattingFilter}
							keyboardType={"number-pad"}
							onChangeText={input => {
								setPreviousBudgetValue(input);
							}}
							value={previousBudgetValue}
							maxLength={11}
						/>
					</View>
				)}
				<View style={styles.continueButtonContainer}>
					<Button style={styles.buttom} onPress={onAdvanceAttempt}>CONTINUAR</Button>
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
	buttom: {
		margin: 8,
		width: "90%",
		height: 24,
	},
});
